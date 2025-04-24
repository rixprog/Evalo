import mysql.connector
from dotenv import load_dotenv
import os
# from combination import extract_text_from_pdf 
from typing import List, Dict

load_dotenv()
password = os.getenv('MYSQL_PASSWORD')

def create_database_and_table_v2():
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password=password
    )
    cursor = conn.cursor()

    cursor.execute("CREATE DATABASE IF NOT EXISTS student_evaluation")
    cursor.execute("USE student_evaluation")

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS evaluations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            subject VARCHAR(100),
            gmail VARCHAR(100),
            paper_id VARCHAR(50),
            student_answer_url TEXT,
            answer_key_url TEXT,
            grading_url TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.commit()
    conn.close()
    print("✅ Database and table created successfully.")

create_database_and_table_v2()

def insert_evaluation_record(subject, gmail, paper_id,
                             student_answer_url, answer_key_url, grading_url,):
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password=password,
        database="student_evaluation"
    )
    cursor = conn.cursor()

    query = """
        INSERT INTO evaluations (
            subject, gmail, paper_id,
            student_answer_url, answer_key_url, grading_url
            
        )
        VALUES (%s, %s, %s, %s, %s, %s)
    """
    values = (
        subject, gmail, paper_id,
        student_answer_url, answer_key_url, grading_url,
    )

    cursor.execute(query, values)
    conn.commit()
    conn.close()
    print("✅ Record inserted successfully.")

def get_evaluations_by_gmail(gmail: str) -> List[Dict]:
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password=password,
            database="student_evaluation"
        )
        cursor = conn.cursor(dictionary=True)  

        query = "SELECT * FROM evaluations WHERE gmail = %s"
        cursor.execute(query, (gmail,))

        results = cursor.fetchall()  
        conn.close()

        if results:
            print("✅ Evaluation data retrieved successfully.")
            return results  
        else:
            print("❌ No data found for the given Gmail.")
            return []

    except mysql.connector.Error as e:
        print(f"❌ Error retrieving data: {e}")
        return []

def extract_text_from_evaluations(gmail: str) -> str:
   
    evaluation_data = get_evaluations_by_gmail(gmail)

    if not evaluation_data:
        return "❌ No evaluation data found for the given Gmail."

    formatted_output = ""

    for idx, record in enumerate(evaluation_data, start=1):
        try:
            print(f"Processing Record {idx}: {record}")

            student_answer_text = extract_text_from_pdf(record['student_answer_url'])
            answer_key_text = extract_text_from_pdf(record['answer_key_url'])
            grading_text = extract_text_from_pdf(record['grading_url'])

            print(f"Extracted Text for Record {idx}:")
            print(f"Answer:\n{student_answer_text}")
            print(f"Answer Key:\n{answer_key_text}")
            print(f"Grading Notes:\n{grading_text}")

            formatted_output += f"Extracted Text for Record {idx}:\n"
            formatted_output += f"Answer:\n{student_answer_text}\n\n"
            formatted_output += f"Answer Key:\n{answer_key_text}\n\n"
            formatted_output += f"Grading Notes:\n{grading_text}\n\n"
            formatted_output += "-" * 50 + "\n\n"

        except Exception as e:
            print(f"❌ Error processing record {idx}: {e}")
            formatted_output += f"❌ Error processing record {idx}: {e}\n"
            formatted_output += "-" * 50 + "\n\n"

    return formatted_output


