from typing import List, Dict, Any, Optional, Tuple
import json
import os
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
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
from grading import grade_student_answers


load_dotenv()

class PageExtraction(BaseModel):
    page_number: int
    text: str
    visual_description: str
    confidence_text: float
    confidence_visual: float

class ExtractionResults(BaseModel):
    extractions: List[PageExtraction]

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
def create_pdf_with_text(folder_path, output_file_name, title, text):
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
    output_path = os.path.join(folder_path, output_file_name)
    try:
        pdfmetrics.getFont('DejaVuSerif')
    except KeyError:
        font_path = os.path.join(os.path.dirname(__file__), 'fonts', 'DejaVuSerif.ttf')
        if os.path.exists(font_path):
            pdfmetrics.registerFont(TTFont('DejaVuSerif', font_path))
        else:
            print("DejaVu font not found. Using built-in fonts which may not support all mathematical symbols.")
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=72
    )
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'Title',
        parent=styles['Heading1'],
        fontSize=16,
        alignment=TA_CENTER,
        spaceAfter=20,
        fontName='DejaVuSerif' if 'DejaVuSerif' in pdfmetrics.getRegisteredFontNames() else 'Helvetica'
    )
    text_style = ParagraphStyle(
        'Normal',
        parent=styles['Normal'],
        fontSize=12,
        alignment=TA_LEFT,
        fontName='DejaVuSerif' if 'DejaVuSerif' in pdfmetrics.getRegisteredFontNames() else 'Helvetica',
        leading=14
    )
    content = []
    content.append(Paragraph(title, title_style))
    content.append(Spacer(1, 20))
    math_replacements = {
        '\\partial': '&part;',
        '\\int': '&#8747;',
        '\\sum': '&#8721;',
        '\\alpha': '&alpha;',
        '\\beta': '&beta;',
        '\\gamma': '&gamma;',
        '\\delta': '&delta;',
        '\\Delta': '&Delta;',
        '\\pi': '&pi;',
        '\\Pi': '&Pi;',
        '\\phi': '&phi;',
        '\\infty': '&infin;',
        '\\times': '&times;',
        '\\div': '&divide;',
        '\\pm': '&plusmn;',
        '\\leq': '&le;',
        '\\geq': '&ge;',
        '\\neq': '&ne;',
        '\\approx': '&asymp;',
        '\\equiv': '&equiv;',
        '\\ldots': '&hellip;',
        '\\theta': '&theta;',
        '\\lambda': '&lambda;',
        '\\mu': '&mu;',
        '\\nu': '&nu;',
        '\\rho': '&rho;',
        '\\sigma': '&sigma;',
        '\\tau': '&tau;',
        '\\omega': '&omega;',
        '^2': '<sup>2</sup>',
        '^3': '<sup>3</sup>',
        '_2': '<sub>2</sub>',
        '_3': '<sub>3</sub>',
    }
    for old, new in math_replacements.items():
        text = text.replace(old, new)
    text = text.replace('∫', '&#8747;')
    text = text.replace('∂', '&part;')
    text = text.replace('λ', '&lambda;')
    paragraphs = []
    current_paragraph = []
    for line in text.split('\n'):
        if line.strip() == '':
            if current_paragraph:
                paragraphs.append('<br/>'.join(current_paragraph))
                current_paragraph = []
        else:
            if line.startswith('---'):
                if current_paragraph:
                    paragraphs.append('<br/>'.join(current_paragraph))
                    current_paragraph = []
                paragraphs.append(line)
            else:
                if (len(current_paragraph) > 0 and 
                    (line.strip()[0].isdigit() and 
                     len(line.strip()) > 1 and 
                     (line.strip()[1] == '.' or line.strip()[1] == ')'))):
                    current_paragraph.append('<br/>' + line)
                elif len(current_paragraph) > 0 and line.strip().startswith('ans'):
                    current_paragraph.append('<br/><br/>' + line)
                else:
                    current_paragraph.append(line)
    if current_paragraph:
        paragraphs.append('<br/>'.join(current_paragraph))
    for p in paragraphs:
        if p.startswith('---'):
            content.append(Spacer(1, 10))
            clean_title = p.strip('-').strip()
            content.append(Paragraph(f"<b>{clean_title}</b>", text_style))
        else:
            p = p.replace('<br/>', '<br/>')
            content.append(Paragraph(p, text_style))
        content.append(Spacer(1, 8))
    doc.build(content)
    print(f"PDF created successfully at {output_path}")


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
                    You are an expert image analyzer that extracts text and describes visuals.
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
            temperature=0,
            stream=False
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
            print(f"Failed to parse JSON response: {je}")
            print(f"Raw response: {response_text}")
            return []
    
    except Exception as e:
        print(f"Error during API call: {e}")
        return []

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

    print("Converting PDF to images...")
    save_pdf_images(pdf_path, output_folder)
    
    combined_text = ""  
    all_confidence_scores = {}  
    page_offset = 0  
    
    while True:
        image_paths = list_image_paths(output_folder, limit=batch_size)
        if not image_paths:
            print("No more images to process.")
            break
        
        print(f"Processing batch of {len(image_paths)} images...")
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
        
        print("Extracting combined text and confidence scores...")
        if data:
            for item in data:
                item['page_number'] = item.get('page_number', 0) + page_offset
            
            batch_text, batch_confidence = extract_text_and_confidence(data)
            combined_text += batch_text
            
            all_confidence_scores.update(batch_confidence)
            
            page_offset += len(image_paths)
        
        print(f"Deleting {len(image_paths)} processed images...")
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
        print(f"An error occurred while extracting text: {e}")
    
    return extracted_text
def main():
    pdf_path = input("Enter the path to the PDF file: ") 
    output_folder = input("Enter the output folder for images: ")
    batch_size = 5
    
    combined_text, confidence_scores = process_pdf_to_text(pdf_path, output_folder, batch_size=batch_size)
    
    print("Final Combined Text:")
    print(combined_text)
    
    print("\nConfidence Scores:")
    for page, score in sorted(confidence_scores.items()):
        print(f"Page {page}: {score:.2f}")
    output_folder = input("Enter the output folder for pdf: ")
    name = input("Enter the name of the output PDF file with extension: ") 

    create_pdf_with_text(output_folder, name, "Extracted Text", combined_text)
    answer_key_path = input("Enter the path to the answer key PDF file: ")
    answer_key = extract_text_from_pdf(answer_key_path)
    data = grade_student_answers(answer_key, combined_text)
    print(data)
    output_folder = input("Enter the output folder for pdf: ")
    name = input("Enter the name of the output PDF file with extension: ") 
    create_pdf_with_text(output_folder, name, "Extracted Text", data)

if __name__ == "__main__":
    main()