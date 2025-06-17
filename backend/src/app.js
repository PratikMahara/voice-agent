import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
const app=express()
app.use(cors({
    origin:'*',
  
}))

app.use(express.json({limit:"20kb"}))
app.use(express.urlencoded({extended:true,limit:"20kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use(cors({ origin: '*' }));
import googleauth from './router/auth.routes.js';

app.get('/',async(req,res)=>{
    res.send("hellow world");
})
app.use('/auth',googleauth)
export default app;