import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const QuestionList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // fallback in case user lands directly
  const {
    jobPosition = "",
    jobDescription = "",
    timeDuration = "",
    interviewType = ""
  } = location.state || {};

  // Optional: Redirect if no data (user lands here directly)
  if (!jobPosition || !jobDescription) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>No Interview Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Please start an interview from the Dashboard.</p>
            <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
  {/* Interview Details Bar at the Top */}
  <div className="w-full flex justify-center pt-8 pb-4">
    <Card className="w-full max-w-4xl shadow-md">
      <CardContent className="flex flex-wrap gap-6 justify-between items-center py-6">
        <div>
          <span className="font-semibold text-gray-700">Job Position:</span>
          <span className="ml-2 text-gray-900">{jobPosition}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Time Duration:</span>
          <span className="ml-2 text-gray-900">{timeDuration} minutes</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Interview Type:</span>
          <span className="ml-2 text-gray-900">{interviewType}</span>
        </div>
      </CardContent>
    </Card>
  </div>

  {/* Job Description Section */}
  <div className="w-full flex justify-center">
    <Card className="w-full max-w-4xl shadow-sm">
      <CardHeader>
        <CardTitle>Job Description</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-100 p-4 rounded text-gray-800 whitespace-pre-line">
          {jobDescription}
        </div>
      </CardContent>
    </Card>
  </div>
</div>

  );
};

export default QuestionList;
