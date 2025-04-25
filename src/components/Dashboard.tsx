import React, { useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

// Define TypeScript interfaces for the data structure
interface Question {
  question_number: number;
  points_earned: number;
  points_possible: number;
  feedback: string;
  justification?: string;
}

interface GradingResults {
  total_score: number;
  total_possible: number;
  percentage: number;
  questions: Question[];
}

interface DashboardProps {
  gradingResults: GradingResults | null;
  onBackClick: () => void; // New prop for handling back button click
}

const Dashboard: React.FC<DashboardProps> = ({ gradingResults, onBackClick }) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  if (!gradingResults) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-lg">No grading results to display</p>
      </div>
    );
  }

  const { total_score, total_possible, percentage, questions } = gradingResults;

  // Function to handle report download using the FastAPI endpoint
  const downloadReport = async () => {
    try {
      setIsGenerating(true);
      
      // Make API call to FastAPI backend to generate PDF
      const response = await fetch('https://evalo.onrender.com/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gradingResults),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      // Get the PDF as a blob
      const blob = await response.blob();
      
      // Create a link to download the PDF
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'exam-results-report.pdf');
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to download report. Please try again later.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-700 via-purple-500 to-indigo-500">
        Exam Results
      </h2>
      
      {/* Overall Score */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="w-40 h-40 mb-4 md:mb-0">
            <CircularProgressbar
              value={percentage}
              text={`${Math.round(percentage)}%`}
              styles={buildStyles({
                rotation: 0,
                strokeLinecap: 'round',
                textSize: '16px',
                pathTransitionDuration: 0.5,
                pathColor: `rgba(124, 58, 237, ${percentage / 100})`,
                textColor: '#6D28D9',
                trailColor: '#E2E8F0',
              })}
            />
          </div>
          <div className="flex-1 md:ml-6">
            <h3 className="text-xl font-semibold mb-2">Overall Performance</h3>
            <p className="text-gray-700 mb-1">Score: {total_score} out of {total_possible}</p>
            <p className="text-gray-700">Percentage: {percentage.toFixed(1)}%</p>
            <div className="mt-2">
              {percentage >= 90 ? (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Excellent</span>
              ) : percentage >= 75 ? (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Good</span>
              ) : percentage >= 60 ? (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Satisfactory</span>
              ) : (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Needs Improvement</span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Individual Questions */}
      <h3 className="text-lg font-semibold mb-4">Question Breakdown</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {questions.map((question) => {
          const questionPercentage = (question.points_earned / question.points_possible) * 100;
          
          return (
            <div key={question.question_number} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="w-16 h-16 mr-4">
                  <CircularProgressbar
                    value={questionPercentage}
                    text={`${question.points_earned}/${question.points_possible}`}
                    styles={buildStyles({
                      rotation: 0,
                      strokeLinecap: 'round',
                      textSize: '24px',
                      pathTransitionDuration: 0.5,
                      pathColor: questionPercentage === 100 
                        ? '#10B981' 
                        : questionPercentage >= 75 
                          ? '#3B82F6' 
                          : questionPercentage >= 50 
                            ? '#F59E0B' 
                            : '#EF4444',
                      textColor: '#4B5563',
                      trailColor: '#E2E8F0',
                    })}
                  />
                </div>
                <div>
                  <h4 className="font-medium">Question {question.question_number}</h4>
                  <p className="text-sm text-gray-500">{questionPercentage.toFixed(0)}% correct</p>
                </div>
              </div>
              <div className="mt-2">
                <h5 className="text-sm font-medium text-gray-700 mb-1">Feedback:</h5>
                <p className="text-sm text-gray-600">{question.feedback.length > 100 ? question.feedback.substring(0, 100) + '...' : question.feedback}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
        {/* Back Button */}
        <button 
          className="rounded bg-gray-200 text-gray-700 px-4 py-2 hover:bg-gray-300 transition duration-150 ease-in-out flex items-center justify-center"
          onClick={onBackClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Grade Another Exam
        </button>
        
        {/* Download Report Button */}
        <button 
          className="rounded bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 hover:from-purple-700 hover:to-indigo-700 transition duration-150 ease-in-out flex items-center justify-center"
          onClick={downloadReport}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Report
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Dashboard;