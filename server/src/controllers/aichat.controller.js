const { GoogleGenerativeAI } = require("@google/generative-ai");
const Mentor = require("../models/Mentor");
const Student = require("../models/Student");
const response = require("../utils/responses.utils");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports = {
    chatWithAI: async (req, res) => {
        try {
            const { prompt } = req.body;
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            // 1. Get Logged-in Student Info
            const student = await Student.findById(req.user._id);
            
            // 2. Fetch relevant Mentors for context
            const mentors = await Mentor.find({}, "firstname lastname department designation");
            
            const systemContext = `
                You are the Intellinest AI Assistant. 
                Current Student Info: 
                - Name: ${student?.firstname} ${student?.lastname}
                - Department: ${student?.department}
                - Semester: ${student?.semester}

                Available Mentors: ${JSON.stringify(mentors)}

                Your Task: 
                - Answer student questions professionally.
                - If they ask for a mentor, prioritize suggesting someone from the ${student?.department} department first.
                - Keep answers helpful but concise.
            `;

            const result = await model.generateContent(`${systemContext}\nStudent: ${prompt}`);
            const aiResponse = await result.response.text();

            response.success(res, "AI Response success", { message: aiResponse });
        } catch (err) {
            console.error("AI Error:", err);
            response.error(res, "AI is currently resting. Please try again later.");
        }
    }
};