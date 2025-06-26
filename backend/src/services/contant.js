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
