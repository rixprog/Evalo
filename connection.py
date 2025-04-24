from combination  import extract_text_from_evaluations
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv
import google.generativeai as genai
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
import os
load_dotenv()

# genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

os.environ["GOOGLE_API_KEY"] = "AIzaSyDjBESa-5KGhDi7f-N4aYctTm7Q5Lnr2ug"

def get_text_chunks(text):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
    )
    text_chunks = text_splitter.split_text(text)
    return text_chunks

def get_vector_store(text_chunks):
    embeddings = GoogleGenerativeAIEmbeddings(model = "models/embedding-001")
    vector_store = FAISS.from_texts(text_chunks, embeddings)
    vector_store.save_local("faiss_index")
    
def conversation():
    prompt_template = """
    You are an intelligent and helpful AI assistant designed to assist students with their exam-related queries. 
    Your goal is to provide accurate, concise, and context-aware answers based on the provided information.
    Answer the question based on the context provided. If the context does not contain enough information to answer the question, let the user know and avoid making assumptions.
    - **Answer**: This is the student's response to the exam question.
    - **Answer Key**: This is the correct or ideal response to the exam question.
    - **Grading Result**: This contains feedback, scores, and explanations for the student's answer.
    Instructions:
    1. Use the provided context (Answer, Answer Key, and Grading Result) to answer the user's questions.
    2. If the user's question is unclear, politely ask for clarification.
    3. If the context does not contain enough information to answer the question, let the user know and avoid making assumptions.
    4. Always provide responses in a clear and professional tone.
    Context:\n {context}\n
    Question:\n{question}\n
    
    """
    model = ChatGoogleGenerativeAI(model="gemini-2.0-flash")
    prompt = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
    chain = load_qa_chain(model, chain_type="stuff", prompt=prompt)
    return chain

def user_input(user_question):
    embeddings = GoogleGenerativeAIEmbeddings(model = "models/embedding-001")
    vector_store = FAISS.load_local("faiss_index", embeddings,allow_dangerous_deserialization=True)
    docs = vector_store.similarity_search(user_question)
    chain = conversation()
    response = chain.invoke({"input_documents": docs, "question": user_question}, return_only_outputs=True)
    return response["output_text"]

def main():
    gmail = input("Enter your Gmail: ")
    formatted_data = extract_text_from_evaluations(gmail)
    text_chunks = get_text_chunks(formatted_data)
    get_vector_store(text_chunks)
    while True:
        user_question = input("Ask a question (or type 'exit' to quit): ")
        if user_question.lower() == 'exit':
            break
        response = user_input(user_question)
        print("Response:", response)
if __name__ == "__main__":
    main()