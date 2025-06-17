
import { InterviewHeader } from "@/components/interview/InterviewHeader";
import { InterviewControls } from "@/components/interview/InterviewControls";
import { InterviewTranscript } from "@/components/interview/InterviewTranscript";
import { InterviewInstructions } from "@/components/interview/InterviewInstructions";
import { useVapi } from "@/hooks/useVapi";

const Interview = () => {
  const {
    isConnected,
    isLoading,
    transcript,
    currentSpeaker,
    startInterview,
    endInterview
  } = useVapi();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <InterviewHeader isConnected={isConnected} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <InterviewControls
          isConnected={isConnected}
          isLoading={isLoading}
          currentSpeaker={currentSpeaker}
          onStartInterview={startInterview}
          onEndInterview={endInterview}
        />

        <InterviewTranscript transcript={transcript} />

        {!isConnected && <InterviewInstructions />}
      </div>
    </div>
  );
};

export default Interview;
