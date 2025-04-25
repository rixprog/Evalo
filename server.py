from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional, Tuple
import json
import os
import tempfile
import shutil
from typing import Optional
import base64
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import pypdfium2 as pdfium
import PyPDF2
from groq import Groq
from dotenv import load_dotenv
import io
from fastapi.responses import StreamingResponse


from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import json
import os
import tempfile
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
import io
from fastapi.responses import StreamingResponse

load_dotenv()

app = FastAPI()

# Configure CORS to allow requests from React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GradingResponse(BaseModel):
    total_score: float
    total_possible: float
    percentage: float
    questions: List[Dict[str, Any]]

class PageExtraction(BaseModel):
    page_number: int
    text: str
    visual_description: str
    confidence_text: float
    confidence_visual: float

class Question(BaseModel):
    question_number: int
    points_earned: float
    points_possible: float
    feedback: str
    justification: Optional[str] = None

class GradingResults(BaseModel):
    total_score: float
    total_possible: float
    percentage: float
    questions: List[Question]


def save_pdf_images(pdf_path, output_folder, scale=4):
    os.makedirs(output_folder, exist_ok=True)
    pdf_name = os.path.splitext(os.path.basename(pdf_path))[0]
    pdf = pdfium.PdfDocument(pdf_path)
    for i in range(len(pdf)):
        page = pdf[i]
        image = page.render(scale=scale).to_pil()
        output_path = os.path.join(output_folder, f"{pdf_name}_{i:03d}.jpg")
        image.save(output_path)

def list_image_paths(folder_path, limit=None):
    try:
        all_files = os.listdir(folder_path)
        image_files = [f for f in all_files if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        if limit is not None:
            image_files = image_files[:limit]
        image_paths = [os.path.join(folder_path, image) for image in image_files]
        return image_paths
    except Exception as e:
        return []

def delete_first_n_images(folder_path, n):
    try:
        all_files = os.listdir(folder_path)
        image_files = [f for f in all_files if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        image_files = sorted(image_files)[:n]
        for image in image_files:
            os.remove(os.path.join(folder_path, image))
    except Exception as e:
        pass

def encode_image(image_path: str) -> str:
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def extract_text_and_visuals(
    image_paths: List[str], 
    prompt: str, 
    num_images: Optional[int] = None,
    model: str = "meta-llama/llama-4-scout-17b-16e-instruct"
) -> List[Dict]:
  
    if num_images:
        image_paths = image_paths[:num_images]

    client = Groq(api_key=os.getenv("GROQ_API_KEY"))

    user_message = {
        "role": "user", 
        "content": [{"type": "text", "text": prompt}]
    }
    
    for idx, image_path in enumerate(image_paths):
        base64_image = encode_image(image_path)
        user_message["content"].append({
            "type": "image_url",
            "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"},
            "page_number": idx + 1
        })
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": """
                    You are an expert image analyzer that extracts text and describes visuals(documents, graphs, circuits, diagrams) from images. IMPORTANT! - If the page contains mathematical expressions, **transcribe them using plain text mathematical symbols (*, +, -, /, ^, √, ∫, ∂, ∑, etc.) rather than LaTeX format**
                    Return your analysis in JSON format as an array of objects with these properties:
                    - page_number: The sequential number of the image
                    - text: The extracted text content
                    - visual_description: Description of any visual elements
                    - confidence_text: Confidence score for text extraction (0-1)
                    - confidence_visual: Confidence score for visual description (0-1)
                    """
                },
                user_message
            ],
            model=model,
            temperature=1,
            max_completion_tokens=8192,
            top_p=1,
            stop=None,
        )
        
        response_text = chat_completion.choices[0].message.content
        
        try:
            start_idx = response_text.find('[')
            end_idx = response_text.rfind(']') + 1
            
            if start_idx >= 0 and end_idx > start_idx:
                json_str = response_text[start_idx:end_idx]
                data = json.loads(json_str)
            else:
                data = json.loads(response_text)
                if isinstance(data, dict) and 'extractions' in data:
                    data = data['extractions']
            
            return data
        
        except json.JSONDecodeError as je:
            raise HTTPException(status_code=500, detail=f"Failed to parse JSON response: {je}")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during API call: {e}")

def extract_text_and_confidence(data: List[Dict]) -> Tuple[str, Dict[int, float]]:
    
    combined_text = ""
    confidence_scores = {}
    
    sorted_data = sorted(data, key=lambda x: x.get('page_number', 0))
    
    for item in sorted_data:
        page_number = item.get('page_number', 0)
        text = item.get('text', '')
        visual_desc = item.get('visual_description', '')
        confidence_text = item.get('confidence_text', 0.0)
        confidence_visual = item.get('confidence_visual', 0.0)
        
        combined_text += f"--- Page {page_number} ---\n\n"
        
        if text:
            combined_text += f"{text}\n\n"
        
        if visual_desc:
            combined_text += f"Visual Description:\n{visual_desc}\n\n"
        
        if confidence_text > 0 and confidence_visual > 0:
            confidence_scores[page_number] = (confidence_text + confidence_visual) / 2
        elif confidence_text > 0:
            confidence_scores[page_number] = confidence_text
        elif confidence_visual > 0:
            confidence_scores[page_number] = confidence_visual
        else:
            confidence_scores[page_number] = 0.0
    
    return combined_text, confidence_scores

def process_pdf_to_text(pdf_path: str, output_folder: str, batch_size: int = 5) -> Tuple[str, Dict[int, float]]:
    save_pdf_images(pdf_path, output_folder)
    
    combined_text = ""  
    all_confidence_scores = {}  
    page_offset = 0  
    
    while True:
        image_paths = list_image_paths(output_folder, limit=batch_size)
        if not image_paths:
            break
        
        extraction_prompt = (
        "You are given a scanned image of a handwritten answer sheet page.\n\n"
        "You will be provided with a list of images containing handwritten text and visual content. The detailing should be consistent.\n\n"
        "Your tasks:\n"
        "1. If the page contains **handwritten text**, extract it ***exactly as it appears, maintaining original spelling, punctuation, line breaks, and spacing***. Use escape sequences like `\\n` for newlines and `\\t` for tabs to represent formatting.\n"
        "2. If the page contains **visual content** (like graphs, circuits, diagrams), provide a detailed, structured **technical description**.\n\n"
        "3. IMPORTANT! - If the page contains mathematical expressions, **transcribe them using plain text mathematical symbols (*, +, -, /, ^, √, ∫, ∂, ∑, etc.) rather than LaTeX format**. For example, write '∫ f(x) dx' or 'y = x²' instead of '$\\int f(x) dx$' or '$y = x^2$'.\n\n"
        "Examples of mathematical notation to use:\n" 
        "- Use ∂ for partial derivatives, not '\\partial'\n"
        "- Use direct symbols like ∫, ∑, π, θ, ∞\n"
        "- Use superscripts for powers (x²) or indicate with ^ (x^2)\n"
        "- For fractions, use / or describe with clear structure (a/b)\n"
        "- Use symbols like →, ≤, ≥, ≠, ≈ directly\n\n"
        "Examples of what to include in a visual description:\n"
        "- For graphs: axis labels, units, scale/step (e.g., 'x-axis ranges from 0 to 10 with step of 0.1V'), curves, line styles, arrows, legends.\n"
        "- For circuits: all components, their arrangement, labels, and connections.\n"
        "- For diagrams: shapes, annotations, labels, hierarchy.\n\n"
        "DO NOT interpret or solve — just transcribe text, describe visuals, and transcribe mathematical expressions as seen.\n"
        "Also give the confidence score of the text extraction and visual description of a page out of 1.\n\n"
        "No need for any explanation or additional information.\n"
    )
        
        data = extract_text_and_visuals(image_paths, extraction_prompt, num_images=batch_size)
        
        if data:
            for item in data:
                item['page_number'] = item.get('page_number', 0) + page_offset
            
            batch_text, batch_confidence = extract_text_and_confidence(data)
            combined_text += batch_text
            
            all_confidence_scores.update(batch_confidence)
            
            page_offset += len(image_paths)
        
        delete_first_n_images(output_folder, n=batch_size)
    
    return combined_text.strip(), all_confidence_scores

def extract_text_from_pdf(pdf_path):
    extracted_text = ""
    try:
        with open(pdf_path, "rb") as pdf_file:
            reader = PyPDF2.PdfReader(pdf_file)
            
            for page in reader.pages:
                extracted_text += page.extract_text() + "\n"
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while extracting text: {e}")
    
    return extracted_text

def grade_student_answers(answer_key: str, student_answer: str) -> Dict:
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": """
                    You are an expert evaluator grading student answers against an answer key. 
                    Evaluate each student response based on the marking scheme provided in the answer key. Verify whether the required points are awarded for the corresponding criteria and ensure that the content is sufficiently detailed and comprehensive for the allocated marks.
                    The output must be in JSON format following this schema:
                    {
                        "total_score": ,
                        "total_possible": ,
                        "percentage": ,
                        "questions": [
                            {
                                "question_number": ,
                                "points_earned": ,
                                "points_possible": ,
                                "justification": "",
                                "feedback": ""
                            }
                            // More items for each question...
                        ]
                    }
                    The total_score should be the sum of points_earned for each question.
                    """
                },
                {
                    "role": "user",
                    "content": f"""
                    ANSWER KEY:
                    {answer_key}

                    STUDENT ANSWER:
                    {student_answer}

                    Instructions:
                    1. Compare each student response to the corresponding question in the answer key.
                    2. Award points based on how well the student answer matches the criteria in the marking scheme.
                    3. Provide brief justification for each score.
                    4. Calculate the total score earned correctly.
                    5. Provide feedback for each question 
                    """
                }
            ],
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            temperature=0,
            stream=False,
            response_format={"type": "json_object"},
        )
        
        response_text = chat_completion.choices[0].message.content
        return json.loads(response_text)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during grading API call: {e}")

@app.post("/process-pdfs", response_model=GradingResponse)
async def process_pdfs(
    student_pdf: UploadFile = File(...),
    answer_key_pdf: UploadFile = File(...)
):
    # Create temp directories for processing
    temp_dir = tempfile.mkdtemp()
    output_folder = os.path.join(temp_dir, "images")
    os.makedirs(output_folder, exist_ok=True)
    
    try:
        # Save uploaded files to temp location
        student_pdf_path = os.path.join(temp_dir, student_pdf.filename)
        answer_key_path = os.path.join(temp_dir, answer_key_pdf.filename)
        
        with open(student_pdf_path, "wb") as f:
            shutil.copyfileobj(student_pdf.file, f)
        
        with open(answer_key_path, "wb") as f:
            shutil.copyfileobj(answer_key_pdf.file, f)
        
        # Process student PDF
        student_text, confidence_scores = process_pdf_to_text(student_pdf_path, output_folder, batch_size=1)
        
        # Extract text from answer key
        answer_key_text = extract_text_from_pdf(answer_key_path)
        
        # Grade student answers
        grading_result = grade_student_answers(answer_key_text, student_text)
        
        return grading_result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    finally:
       
    # Clean up temporary files with better error handling
        try:
            shutil.rmtree(temp_dir)
        except PermissionError:
            # Log the error but don't crash
            print(f"Warning: Could not delete temporary directory {temp_dir} - it will be cleaned up later")


@app.post("/generate-report")
async def generate_pdf_report(grading_results: GradingResults):
    try:
        # Create a buffer for the PDF
        buffer = io.BytesIO()
        
        # Create the PDF document
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=72
        )
        
        # Container for the 'Flowable' objects
        elements = []
        
        # Styles
        styles = getSampleStyleSheet()
        
        # Create a new style with a different name instead of modifying 'Title'
        styles.add(ParagraphStyle(
            name='ReportTitle',  # Different name to avoid conflict
            parent=styles['Heading1'],
            alignment=TA_CENTER,
            textColor=colors.purple,
        ))
        
        styles.add(ParagraphStyle(
            name='Heading2Purple',
            parent=styles['Heading2'],
            textColor=colors.purple,
        ))
        
        # Add style for table cells with wrapping text
        styles.add(ParagraphStyle(
            name='TableCell',
            parent=styles['Normal'],
            fontSize=9,
            leading=10,  # Line spacing
            wordWrap='CJK',  # Better word wrapping
        ))
        
        # Add specific style for header cells
        styles.add(ParagraphStyle(
            name='TableHeader',
            parent=styles['Normal'],
            fontSize=10,
            fontName='Helvetica-Bold',
            textColor=colors.whitesmoke,
            alignment=TA_CENTER,
            wordWrap='CJK',
        ))
        
        # Add title
        elements.append(Paragraph("Exam Results Report", styles['ReportTitle']))
        elements.append(Spacer(1, 20))
        
        # Add overall performance section
        elements.append(Paragraph("Overall Performance", styles['Heading2Purple']))
        elements.append(Spacer(1, 10))
        
        # Score info
        elements.append(Paragraph(f"Score: {grading_results.total_score} out of {grading_results.total_possible}", styles['Normal']))
        elements.append(Paragraph(f"Percentage: {grading_results.percentage:.1f}%", styles['Normal']))
        
        # Performance classification
        performance_text = ""
        if grading_results.percentage >= 90:
            performance_text = "Excellent"
        elif grading_results.percentage >= 75:
            performance_text = "Good"
        elif grading_results.percentage >= 60:
            performance_text = "Satisfactory"
        else:
            performance_text = "Needs Improvement"
            
        elements.append(Paragraph(f"Performance: {performance_text}", styles['Normal']))
        elements.append(Spacer(1, 20))
        
        # Add question breakdown section
        elements.append(Paragraph("Question Breakdown", styles['Heading2Purple']))
        elements.append(Spacer(1, 10))
        
        # Create table for questions with proper cell formatting and header paragraphs
        table_data = [[
            Paragraph("Question", styles['TableHeader']),
            Paragraph("Score", styles['TableHeader']),
            Paragraph("Possible", styles['TableHeader']),
            Paragraph("Percentage", styles['TableHeader']),
            Paragraph("Feedback", styles['TableHeader'])
        ]]
        
        for question in grading_results.questions:
            question_percentage = (question.points_earned / question.points_possible) * 100
            
            # Use Paragraph for feedback to enable wrapping
            table_data.append([
                Paragraph(str(question.question_number), styles['TableCell']),
                Paragraph(str(question.points_earned), styles['TableCell']),
                Paragraph(str(question.points_possible), styles['TableCell']),
                Paragraph(f"{question_percentage:.0f}%", styles['TableCell']),
                Paragraph(question.feedback, styles['TableCell'])
            ])
        
        # Adjust column widths - ensure proper spacing
        table = Table(table_data, colWidths=[60, 50, 60, 70, 230])
        
        # Add style to the table
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.purple),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('ALIGN', (0, 1), (3, -1), 'CENTER'),
            ('ALIGN', (4, 1), (4, -1), 'LEFT'),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('LEFTPADDING', (0, 0), (-1, -1), 6),  # Add padding for all cells
            ('RIGHTPADDING', (0, 0), (-1, -1), 6),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        
        elements.append(table)
        elements.append(Spacer(1, 20))
        
        # Add detailed feedback section
        elements.append(Paragraph("Detailed Feedback", styles['Heading2Purple']))
        elements.append(Spacer(1, 10))
        
        for question in grading_results.questions:
            elements.append(Paragraph(f"Question {question.question_number}:", styles['Heading3']))
            elements.append(Paragraph(question.feedback, styles['Normal']))
            elements.append(Spacer(1, 10))
        
        # Build the PDF
        doc.build(elements)
        
        # Move the buffer position to the beginning
        buffer.seek(0)
        
        # Return the PDF as a streaming response
        return StreamingResponse(
            buffer, 
            media_type="application/pdf",
            headers={
                "Content-Disposition": "attachment; filename=exam-results-report.pdf"
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating PDF report: {str(e)}")
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)