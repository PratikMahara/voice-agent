import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Vapi from "@vapi-ai/web";

const InterviewPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const vapiRef = useRef(null);

  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isCallActive, setIsCallActive] = useState(false);
  const [loadingError, setLoadingError] = useState(null);
  const [vapiStatus, setVapiStatus] = useState("idle");

  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) {
        setLoadingError("Session ID is missing in the URL.");
        return;
      }
      try {
        const response = await fetch(
          `http://localhost:8000/api/interview/get/${sessionId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const contentType = response.headers.get("content-type");
        if (!contentType?.includes("application/json")) {
          const text = await response.text();
          throw new Error(`Invalid response: ${text.substring(0, 100)}...`);
        }

        const data = await response.json();
        if (!data?.data?.details) {
          throw new Error("Invalid session data structure");
        }

        setSession(data.data);
        const qs =
          data.data.questions ||
          data.data.details.question?.questions ||
          data.data.details.question ||
          [];
        setQuestions(Array.isArray(qs) ? qs : []);
      } catch (error) {
        console.error("Error fetching session:", error);
        setLoadingError(error.message);
      }
    };

    fetchSession();
  }, [sessionId]);

  useEffect(() => {
    if (!session || questions.length === 0) return;

    const vapi = new Vapi(
      // import.meta.env.VITE_VAPI_PUBLIC_KEY ||
        "bc7a8997-a0d5-4da5-91f8-99de476761d9"
    );
    vapiRef.current = vapi;
    setVapiStatus("initializing");

    vapi.on("call-start", () => {
      setIsCallActive(true);
      setVapiStatus("active");
    });

    vapi.on("call-end", () => {
      setIsCallActive(false);
      setVapiStatus("ended");
      navigate(`/results/${sessionId}`);
    });

    vapi.on("error", (error) => {
      console.error("Vapi error:", error);
      setLoadingError(`Vapi error: ${error.message || JSON.stringify(error)}`);
      setVapiStatus("error");
    });

    // Prepare AI assistant configuration
    const jobPosition = session.details.jobposition || "the position";
    const questionList = questions
      .map((q, i) => `${i + 1}. ${q.question}`)
      .join("\n");

    vapi.start({
      name: "AI Recruiter",
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
      },
      voice: {
        provider: "vapi",
        voiceId: "Elliot",
      },
      model: {
        provider: "openrouter",
        model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
        messages: [
          {
            role: "system",
            content: `
You are an AI voice assistant conducting interviews.
Your job is to ask candidates provided interview questions and assess their responses.

Begin the conversation with a friendly introduction, setting a relaxed yet professional tone. Example:
"Hey there! Welcome to your ${jobPosition} interview, let's get started with a few questions!"

Ask one question at a time and wait for the candidate's response before proceeding.
Keep the questions clear and concise. Below are the questions—ask them one by one:

Questions:
${questionList}

If the candidate struggles, offer hints or rephrase the question without giving away the answer. Example:
"Need a hint? Think about how React tracks component updates!"

Provide brief, encouraging feedback after each answer. Examples:
"Nice! That's a solid answer."
"Hmm, not quite! Want to try again?"

Keep the conversation natural and engaging—use casual phrases like:
"Alright, next up..." or "Let's tackle a tricky one!"

After 5–7 questions, wrap up the interview smoothly by summarizing their performance. Example:
"That was great! You handled some tough questions well. Keep sharpening your skills!"

End on a positive note:
"Thanks for chatting! Hope to see you crushing projects soon!"

Key Guidelines:
✅ Be friendly, engaging, and witty  
✅ Keep responses short and natural, like a real conversation  
✅ Adapt based on the candidate's confidence level  
✅ Ensure the interview remains focused on React  
            `.trim(),
          },
        ],
      },
    });

    return () => vapi.stop();
  }, [session, questions, navigate, sessionId]);

  if (loadingError) {
    return (
      <div className="p-8 text-center text-red-500">
        <h2 className="text-xl font-bold">Error Loading Session</h2>
        <p className="mt-4">{loadingError}</p>
        <Button className="mt-6" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (!session) {
    return <div className="p-8 text-center">Loading interview session...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          AI Interview Session
        </h1>

        <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
          <h3 className="font-semibold text-yellow-800">Debug Information</h3>
          <p>Session ID: {sessionId}</p>
          <p>Questions loaded: {questions.length}</p>
          <p>VAPI Status: {vapiStatus}</p>
          <p>Call Active: {isCallActive ? "Yes" : "No"}</p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Job Details</h2>
          <p>
            <span className="font-medium">Position:</span>{" "}
            {session.details.jobposition}
          </p>
          <p>
            <span className="font-medium">Type:</span> {session.details.type}
          </p>
          <p>
            <span className="font-medium">Duration:</span>{" "}
            {session.details.timeduration} minutes
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Interview Questions</h2>
          <ul className="list-disc pl-5 space-y-2">
            {questions.map((q, index) => (
              <li key={index}>{q.question}</li>
            ))}
          </ul>
        </div>

        <div className="text-center">
          {isCallActive ? (
            <Button
              className="bg-red-500 hover:bg-red-600"
              onClick={() => vapiRef.current?.stop()}
            >
              End Interview
            </Button>
          ) : (
            <p className="text-green-500 font-medium">
              {vapiStatus === "starting"
                ? "Starting call..."
                : "Setting up interview call..."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
