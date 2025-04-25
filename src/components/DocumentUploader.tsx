import  { useState } from 'react';
import Dashboard from './Dashboard';

const DocumentUploader = () => {
  const [studentPdf, setStudentPdf] = useState<File | null>(null);
  const [answerKeyPdf, setAnswerKeyPdf] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [gradingResults, setGradingResults] = useState(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');

  const handleStudentPdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setStudentPdf(e.target.files[0]);
    }
  };

  const handleAnswerKeyPdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAnswerKeyPdf(e.target.files[0]);
    }
  };

  // Function to simulate progress updates
  const simulateProgress = () => {
    // Reset progress at the start
    setProgress(0);
    setStatusText('Preparing documents...');
    
    // Simulate different stages of processing
    const stages = [
      { progress: 15, text: 'Extracting text from student PDF...', delay: 1000 },
      { progress: 30, text: 'Processing student answers...', delay: 2000 },
      { progress: 50, text: 'Extracting text from answer key...', delay: 1500 },
      { progress: 70, text: 'Analyzing responses...', delay: 2000 },
      { progress: 85, text: 'Generating grading results...', delay: 1500 },
      { progress: 95, text: 'Finalizing...', delay: 1000 }
    ];
    
    // Schedule each stage
    let currentDelay = 0;
    stages.forEach(stage => {
      currentDelay += stage.delay;
      setTimeout(() => {
        setProgress(stage.progress);
        setStatusText(stage.text);
      }, currentDelay);
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!studentPdf || !answerKeyPdf) {
      setError('Please upload both the student answer and answer key PDFs');
      return;
    }

    setIsUploading(true);
    setError('');
    
    // Start the progress simulation
    simulateProgress();

    const formData = new FormData();
    formData.append('student_pdf', studentPdf);
    formData.append('answer_key_pdf', answerKeyPdf);

    try {
      const response = await fetch('https://evalo.onrender.com/process-pdfs', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      // Set progress to 100% when request completes
      setProgress(100);
      setStatusText('Complete!');
      
      const data = await response.json();
      setGradingResults(data);
    }  catch (error: any) { // or create a more specific error type
      console.error('Error uploading files:', error);
      setError(`Failed to process PDFs: ${error.message}`);
      setStatusText('Failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {!gradingResults ? (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-700 via-purple-500 to-indigo-500">
            Upload Exam Files
          </h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student Answer PDF
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col w-full h-32 border-2 border-dashed border-purple-300 rounded-lg cursor-pointer hover:bg-purple-50 transition duration-150">
                  <div className="flex flex-col items-center justify-center pt-7">
                    <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p className="pt-1 text-sm tracking-wider text-gray-600 group-hover:text-gray-600">
                      {studentPdf ? studentPdf.name : "Upload student answer"}
                    </p>
                  </div>
                  <input type="file" className="opacity-0" accept=".pdf" onChange={handleStudentPdfChange} />
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Answer Key PDF
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col w-full h-32 border-2 border-dashed border-purple-300 rounded-lg cursor-pointer hover:bg-purple-50 transition duration-150">
                  <div className="flex flex-col items-center justify-center pt-7">
                    <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p className="pt-1 text-sm tracking-wider text-gray-600 group-hover:text-gray-600">
                      {answerKeyPdf ? answerKeyPdf.name : "Upload answer key"}
                    </p>
                  </div>
                  <input type="file" className="opacity-0" accept=".pdf" onChange={handleAnswerKeyPdfChange} />
                </label>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isUploading}
                className={`bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-md hover:from-purple-700 hover:to-indigo-700 transition duration-150 ease-in-out ${
                  isUploading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isUploading ? "Processing..." : "Grade Exam"}
              </button>
            </div>
            
            {/* Progress bar section */}
            {isUploading && (
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{statusText}</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-purple-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </form>
        </div>
      ) : (
        <Dashboard gradingResults={gradingResults} />
      )}
    </div>
  );
};

export default DocumentUploader;