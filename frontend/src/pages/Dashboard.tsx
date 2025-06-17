
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare, User, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      toast({
        title: "Job description required",
        description: "Please enter a job description to generate interview questions.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Store job description in localStorage for the interview page
      localStorage.setItem('jobDescription', jobDescription);
      
      // Simulate API call to generate questions
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Questions generated!",
        description: "Your interview questions are ready. Let's start the interview.",
      });
      
      navigate("/interview");
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
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">AI Interviewer</span>
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

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
            <CardDescription>
              Paste the job description you're preparing for. Our AI will generate 
              personalized interview questions based on the role requirements.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jobDescription">Job Description</Label>
                <Textarea
                  id="jobDescription"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  className="min-h-[200px]"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Generating Questions..." : "Start Interview"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Interviews Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Interviews</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Software Engineer Interview</CardTitle>
                <CardDescription>2 days ago</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">
                  Frontend Developer role at Tech Company
                </p>
                <Button variant="outline" size="sm">View Feedback</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Product Manager Interview</CardTitle>
                <CardDescription>1 week ago</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">
                  Senior PM role at Startup
                </p>
                <Button variant="outline" size="sm">View Feedback</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
