const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// ------------------------------------
// Middleware
// ------------------------------------

app.use(cors());
app.use(express.json());


// ------------------------------------
// OpenAI Client
// ------------------------------------

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


// ------------------------------------
// Test Route
// ------------------------------------

const publicFolder = path.join(__dirname, "..", "public");

app.use(express.static(publicFolder));

app.get("/", (req, res) => {
    res.sendFile(path.join(publicFolder, "index.html"));
});

// ------------------------------------
// AI Summarization Route
// ------------------------------------

app.post("/api/summarize", async (req, res) => {

    try {

        const { text } = req.body;


        // Check if text exists
        if (!text || !text.trim()) {

            return res.status(400).json({
                error: "No text was provided."
            });

        }


        // Ask AI to summarize
        const response = await openai.responses.create({

            model: "gpt-5.6-luna",

            instructions: `
You are an AI assistant for MediNova,
a clinical intake application.

Summarize the patient's speech into the
minimum possible number of words.

Keep only important clinical information.

Do not provide a diagnosis.
Do not provide medical advice.
Do not add information that the patient did not say.

Return ONLY the short summary.
`,

            input: text.trim(),

            max_output_tokens: 80

        });


        const summary = response.output_text.trim();


        // Send result back to frontend
        res.json({

            summary: summary

        });


    } catch (error) {

        console.error("AI Error:", error);

        res.status(500).json({

            error: "Failed to generate AI summary."

        });

    }

});


// ------------------------------------
// Start Server
// ------------------------------------

app.listen(PORT, () => {

    console.log(
        `MediNova backend running at http://localhost:${PORT}`
    );

});