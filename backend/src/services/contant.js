export const QUESTIONS_PROMPT = `You are an expert technical interviewer.
Based on the following inputs, generate a well-structured list of high-quality interview questions:

Job Title: {{jobTitle}}  
Job Description: {{jobDescription}}  
Interview Duration: {{duration}} minutes  
Interview Type: {{type}}  

📝 Your task:
- Analyze the job description to identify key responsibilities, required skills, and expected experience
- Generate exactly 7 interview questions matching the duration
- Ensure questions match a real-life {{type}} interview
- NEVER include markdown code blocks or explanations
- Output ONLY valid JSON with this structure:
{
  "questions": [
    {
      "question": "Full question text here",
      "type": "Technical/Behavioral/Experience"
    }
  ]
}

🎯 Example output:
{
  "questions": [
    {"question": "Walk me through your experience...", "type": "Experience"},
    {"question": "How would you solve...", "type": "Technical"}
  ]
}`;


export const FEEDBACK_PROMPT=`{{conversation}}
Depends on this Interview Conversation between assitant and user,
Give me feedback for user interview. Give me rating out of 10 for techncial Skills,
Communication, Problem Solving, Experince. Also give me summery in 3 lines
about the interview and one line to let me know whether is recommanded
for hire or not with msg. Give me response in JSON format
{
  feedback:{
    rating:{
      techicalSkills:5,
      communication:6,
      problemSolving:4,
      experince:7
    },
    summery:<in 3 Line>,
    Recommendation:'',
    RecommendationMsg:''
  }
}`
