import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
const app=express()

app.use(cors({ origin: '*' }));
app.use(express.json({limit:"20kb"}))
app.use(express.urlencoded({extended:true,limit:"20kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import googleauth from './router/auth.routes.js';
import question from './router/question.routes.js'
// app.get('/api/question/getting', (req, res) => {
//   res.send('Route is working!');
// });
app.use('/api/auth',googleauth)
app.use('/api/question',question);
export default app;