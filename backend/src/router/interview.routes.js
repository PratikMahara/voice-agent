import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { startInterview, getSession } from "../controller/interview.controller.js";
const router=Router();

router.post('/start',verifyJWT,startInterview);
router.get('/get/:id',getSession);
export default router;