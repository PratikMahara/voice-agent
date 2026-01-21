import { GoogleGenerativeAI } from "@google/generative-ai";
import { QUESTIONS_PROMPT } from "../services/contant.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Details } from "../models/details.model.js";

// console.log(process.env.GEMINI_API_KEY)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);



const generateQuestions = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
    }

    const { jobposition, jobdescription, duration, type } = req.body;

    if (!jobposition || !jobdescription || !duration || !type) {
      throw new ApiError(400, "All fields are required");
    }

    const FINAL_PROMPT = QUESTIONS_PROMPT
      .replace(/{{jobTitle}}/g, jobposition)
      .replace(/{{jobDescription}}/g, jobdescription)
      .replace(/{{duration}}/g, duration)
      .replace(/{{type}}/g, type);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const result = await model.generateContent([
      {
        role: "user",
        parts: [
          {
            text: `Return ONLY valid JSON. No explanation.\n\n${FINAL_PROMPT}`
          }
        ]
      }
    ]);

    const rawContent = result.response.text();

    let questions;
    try {
      questions = JSON.parse(rawContent);
    } catch (err) {
      console.error("RAW GEMINI RESPONSE:", rawContent);
      throw new ApiError(500, "Invalid JSON response from Gemini");
    }

    const detail = await Details.create({
      jobposition,
      jobdescription,
      duration,
      type,
      email: user.email,
      question: questions,
      user: user._id,
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        { detailsId: detail._id, questions },
        "Questions generated successfully"
      )
    );

  } catch (error) {
    console.error(error);
    return res.status(500).json(
      new ApiResponse(
        500,
        null,
        error.message || "Failed to generate questions"
      )
    );
  }
};

const getUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
  }
  res.status(200).json(
    new ApiResponse(200, req.user, "User retrieved successfully")
  );
});

export { generateQuestions, getUser };
