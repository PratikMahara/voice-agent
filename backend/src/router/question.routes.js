import { Router } from 'express';
// import QuestionList from '../controller/que.controller.js'; // Note the .js extension
import generateQuestions from '../controller/openai.controller.js'
const router = Router();

// router.route("/set").post(QuestionList);
router.post("/generate-questions", generateQuestions);

export default router;
