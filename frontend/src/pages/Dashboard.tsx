import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MessageSquare, User, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [jobPosition, setJobPosition] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [timeDuration, setTimeDuration] = useState("30");
  const [interviewType, setInterviewType] = useState("technical");
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobPosition.trim() || !jobDescription.trim()) {
      toast({
        title: "Required fields missing",
        description: "Please enter both job position and job description.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Send data to backend
      const response = await fetch("http://localhost:8000/api/question/set", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
    position: jobPosition,
    description: jobDescription,
    duration: timeDuration,
    type: interviewType
  })
      });

      if (!response.ok) {
        throw new Error("Failed to send details to backend");
      }
console.log(response.ok);
      const data = await response.json();

      toast({
        title: "Questions generated!",
        description: "Your interview questions are ready. Let's start the interview.",
      });

      // Optionally, store data in localStorage
      localStorage.setItem("questionListState", JSON.stringify({
        jobPosition, jobDescription, timeDuration, interviewType
      }));

      navigate("/question-list", {
        state: { jobPosition, jobDescription, timeDuration, interviewType },
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">
                AI Interviewer
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-700">
                <User className="h-4 w-4 mr-1" />
                <span className="text-sm">{user?.name}</span>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-lg text-gray-600">
            Ready to practice your next interview? Let's get started.
          </p>
        </div>

        {/* Interview Setup Card */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Interview Setup</CardTitle>
            <CardDescription>
              Fill in the details below to generate personalized interview
              questions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jobPosition">Job Position</Label>
                <Input
                  id="jobPosition"
                  value={jobPosition}
                  onChange={(e) => setJobPosition(e.target.value)}
                  placeholder="e.g., Frontend Developer"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobDescription">Job Description</Label>
                <Textarea
                  id="jobDescription"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  className="min-h-[120px]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeDuration">Time Duration</Label>
                <select
                  id="timeDuration"
                  value={timeDuration}
                  onChange={(e) => setTimeDuration(e.target.value)}
                  required
                  className="block w-full border rounded px-3 py-2"
                >
                  <option value="5">5 minutes</option>
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">60 minutes</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="interviewType">Interview Type</Label>
                <select
                  id="interviewType"
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                  required
                  className="block w-full border rounded px-3 py-2"
                >
                  <option value="technical">Technical</option>
                  <option value="behavioral">Behavioral</option>
                  <option value="problem solving">Problem Solving</option>
                </select>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Generating Questions..." : "Start Interview"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
