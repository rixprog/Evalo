from dotenv import load_dotenv
import os
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from langchain_google_genai import ChatGoogleGenerativeAI
from combination  import extract_text_from_evaluations
import warnings

load_dotenv()
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

warnings.filterwarnings('ignore', category=DeprecationWarning)
warnings.filterwarnings('ignore', category=FutureWarning)

def split_text_to_documents(text):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=10000,
        chunk_overlap=200
    )
    docs = [Document(page_content=chunk) for chunk in text_splitter.split_text(text)]
    return docs

def create_vector_database(docs):
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    db = FAISS.from_documents(docs, embeddings)
    return db

def get_relevant_context(db, question):
    docs = db.similarity_search(question)
    context = "\n".join([doc.page_content for doc in docs])
    return context

def create_prompt(context, question):
    gemini_prompt = """
    You are an intelligent and helpful AI assistant designed to assist students with their exam-related queries.
    
    Your goal is to provide accurate, concise, and context-aware answers based on the provided information.
    Answer the question based on the context provided. If the context does not contain enough information to answer the question, let the user know and avoid making assumptions.
    - **Overview**: It includes the id , subject paper_id etc
    - **Answer**: This is the student's response to the exam question.
    - **Answer Key**: This is the correct or ideal response to the exam question.
    - **Grading Result**: This contains feedback, scores, and explanations for the student's answer.
    
    Instructions:
    1. Use the provided context (Answer, Answer Key, and Grading Result) to answer the user's questions.
    2. If the user's question is unclear, politely ask for clarification.
    3. If the context does not contain enough information to answer the question, let the user know and avoid making assumptions.
    4. Always provide responses in a clear and professional tone.
    """
    
    input_prompt = f"{gemini_prompt}\nContext: {context}\nQuestion: {question}\n"
    return input_prompt

def get_llm_response(prompt):
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash",
        api_key=os.getenv("GEMINI_API_KEY")
    )
    try:
        result = llm.invoke(prompt)
        return result.content
    except Exception as e:
        return f"Sorry, there was an error processing your question: {str(e)}"

def run_chat_session(db):
    """Run an interactive chat session."""
    print("\nWelcome to the Exam Assistant Chatbot!")
    print("Ask questions about your evaluations or type 'exit' to quit.\n")
    
    while True:
        question = input("Your question: ")
        
        if question.lower() in ['exit', 'quit', 'bye']:
            print("Thank you for using the Exam Assistant Chatbot. Goodbye!")
            break
        
        context = get_relevant_context(db, question)
        prompt = create_prompt(context, question)
        response = get_llm_response(prompt)
        
        print("\nAssistant:", response)
        print()  

def main_with_existing_text(text):
    
    docs = split_text_to_documents(text)
    db = create_vector_database(docs)
    
    run_chat_session(db)

if __name__ == "__main__":
    gmail = input("Enter your Gmail: ")
    extracted_text = extract_text_from_evaluations(gmail)
    print("Extracted Text:", extracted_text)
    main_with_existing_text(extracted_text)