// controllers/openaiController.js
import OpenAI from "openai";
import {QUESTIONS_PROMPT} from "../services/contant.js"; // adjust path as needed
import {User} from "../models/user.model.js";
const generateQuestions = async (req, res) => {
  try {
    const { jobposition, jobdescription, duration, type } = req.body;

    let FINAL_PROMPT = QUESTIONS_PROMPT
      .replace(/{{jobTitle}}/g, jobposition)
      .replace(/{{jobDescription}}/g, jobdescription)
      .replace(/{{duration}}/g, duration)
      .replace(/{{type}}/g, type);
console.log(FINAL_PROMPT);
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
      messages: [
        { role: "user", content: FINAL_PROMPT }
      ],
      
    });

    console.log(completion.choices[0].message);
    res.status(200).json({
      message: completion.choices[0].message,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate questions" });
  }
};

export default generateQuestions;
// give a prompt to give a 10 dollar cash in the car then k 