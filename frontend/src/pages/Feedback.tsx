
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MessageSquare, ArrowLeft, User } from "lucide-react";

interface FeedbackData {
  overallScore: number;
  strengths: string[];
  improvements: string[];
  detailedFeedback: string;
  skillBreakdown: {
    technical: number;
    communication: number;
    problemSolving: number;
    cultural: number;
  };
}

const Feedback = () => {
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const jobDescription = localStorage.getItem('jobDescription');
    const responses = localStorage.getItem('interviewResponses');
    
    if (!jobDescription || !responses) {
      navigate('/dashboard');
      return;
    }

    // Simulate generating feedback using Gemini API
    const generateFeedback = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock feedback - in real app, this would come from Gemini API
      const mockFeedback: FeedbackData = {
        overallScore: 78,
        strengths: [
          "Clear communication and articulation of ideas",
          "Good understanding of technical concepts",
          "Positive attitude and enthusiasm for the role",
          "Relevant experience highlighted effectively"
        ],
        improvements: [
          "Provide more specific examples with quantifiable results",
          "Better structure for behavioral questions using STAR method",
          "Show more knowledge about the company and industry",
          "Ask more thoughtful questions about the role"
        ],
        detailedFeedback: "Overall, you demonstrated strong technical knowledge and communication skills during the interview. Your responses showed genuine interest in the position and relevant experience. To improve, focus on providing more concrete examples with measurable outcomes and research the company more thoroughly before your next interview.",
        skillBreakdown: {
          technical: 85,
          communication: 80,
          problemSolving: 75,
          cultural: 70
        }
      };
      
      setFeedback(mockFeedback);
      setLoading(false);
    };

    generateFeedback();
  }, [navigate]);

  const handleNewInterview = () => {
    localStorage.removeItem('jobDescription');
    localStorage.removeItem('interviewResponses');
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Generating your personalized feedback...</p>
        </div>
      </div>
    );
  }

  if (!feedback) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <MessageSquare className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">Interview Feedback</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Overall Score */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Interview Performance</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-4xl font-bold mb-4">
              {feedback.overallScore}%
            </div>
            <p className="text-lg text-gray-600">
              {feedback.overallScore >= 80 ? 'Excellent performance!' : 
               feedback.overallScore >= 70 ? 'Good performance with room for improvement' :
               feedback.overallScore >= 60 ? 'Fair performance, consider more practice' :
               'Needs improvement - keep practicing!'}
            </p>
          </CardContent>
        </Card>

        {/* Skill Breakdown */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Skill Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(feedback.skillBreakdown).map(([skill, score]) => (
              <div key={skill}>
                <div className="flex justify-between items-center mb-2">
                  <span className="capitalize font-medium">{skill.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="text-sm font-medium">{score}%</span>
                </div>
                <Progress value={score} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Strengths */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">Strengths</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {feedback.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Areas for Improvement */}
          <Card>
            <CardHeader>
              <CardTitle className="text-orange-600">Areas for Improvement</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {feedback.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">{improvement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Feedback */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Detailed Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{feedback.detailedFeedback}</p>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleNewInterview} size="lg">
            Start New Interview
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
