import { InterviewSession } from "../models/interviewSession.model.js";
import { Details } from "../models/details.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// Create interview session
const startInterview = asyncHandler(async (req, res) => {
  const user = req.user;
  const { detailsId } = req.body;
console.log(detailsId);
  if (!detailsId) {
    throw new ApiError(400, "Details ID is required");
  }

  // Fetch interview questions from Details
  const details = await Details.findById(detailsId);
  if (!details) {
    throw new ApiError(404, "Interview details not found");
  }

  // Create new session
  const session = await InterviewSession.create({
    user: user._id,
    details: detailsId,
    currentQuestionIndex: 0,
    questions: details.question, // Store questions directly
    answers: []
  });

  res.status(201).json(
    new ApiResponse(201, session, "Interview session started")
  );
});

// Get session by ID
const getSession = asyncHandler(async (req, res) => {
  const session = await InterviewSession.findById(req.params.id)
    .populate("details")
    .populate("user");

  if (!session) {
    throw new ApiError(404, "Session not found");
  }

  res.status(200).json(
    new ApiResponse(200, session, "Session retrieved")
  );
});

export { startInterview, getSession };
