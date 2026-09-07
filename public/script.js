document.addEventListener("DOMContentLoaded", function () {

    console.log("MediNova script loaded successfully!");

    // =========================================
    // FIND "START NEW INTAKE" CARD
    // =========================================

    const cards = document.querySelectorAll(".quick");
    
    let intakeCard = null;

    cards.forEach(function (card) {

        const heading = card.querySelector("h3");

        if (heading && heading.textContent.includes("Start New Intake")) {
            intakeCard = card;
        }

    });


    // =========================================
    // CREATE VOICE PANEL
    // =========================================

    const voicePanel = document.createElement("div");

    voicePanel.id = "voicePanel";

    voicePanel.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.55);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        font-family: Arial, sans-serif;
    `;


    voicePanel.innerHTML = `
        <div style="
            background:white;
            width:90%;
            max-width:550px;
            border-radius:20px;
            padding:30px;
            box-shadow:0 10px 40px rgba(0,0,0,0.25);
        ">

            <div style="
                display:flex;
                justify-content:space-between;
                align-items:center;
            ">

                <h2 style="margin:0;">
                    🎙️ AI Voice Intake
                </h2>

                <button id="closeVoice"
                    style="
                        border:none;
                        background:none;
                        font-size:28px;
                        cursor:pointer;
                    ">
                    ×
                </button>

            </div>


            <p style="color:#666; margin-top:15px;">
                Tell us about your health problem.
                MediNova will create a short summary.
            </p>


            <div id="voiceStatus"
                style="
                    background:#f1f5f9;
                    padding:15px;
                    border-radius:10px;
                    margin:20px 0;
                    text-align:center;
                ">
                Ready to listen
            </div>


            <button id="startVoice"
                style="
                    width:100%;
                    padding:15px;
                    border:none;
                    border-radius:10px;
                    background:#2563eb;
                    color:white;
                    font-size:16px;
                    cursor:pointer;
                ">
                🎙️ Start Speaking
            </button>


            <button id="stopVoice"
                style="
                    width:100%;
                    padding:15px;
                    border:none;
                    border-radius:10px;
                    background:#dc2626;
                    color:white;
                    font-size:16px;
                    cursor:pointer;
                    display:none;
                    margin-top:10px;
                ">
                ⏹ Stop Recording
            </button>


            <div style="margin-top:20px;">

                <h4>Your Voice Input</h4>

                <div id="transcript"
                    style="
                        min-height:70px;
                        background:#f8fafc;
                        padding:15px;
                        border-radius:10px;
                        color:#334155;
                    ">
                    Your speech will appear here...
                </div>

            </div>


            <button id="summarizeVoice"
                disabled
                style="
                    width:100%;
                    padding:15px;
                    margin-top:20px;
                    border:none;
                    border-radius:10px;
                    background:#16a34a;
                    color:white;
                    font-size:16px;
                    cursor:pointer;
                    opacity:0.6;
                ">
                ✨ Generate Short Summary
            </button>


            <div style="margin-top:20px;">

                <h4>AI Summary</h4>

                <div id="summary"
                    style="
                        min-height:60px;
                        background:#ecfdf5;
                        padding:15px;
                        border-radius:10px;
                        color:#166534;
                    ">
                    Your AI summary will appear here.
                </div>

            </div>

        </div>
    `;


    document.body.appendChild(voicePanel);


    // =========================================
    // GET ELEMENTS
    // =========================================

    const closeVoice =
        document.getElementById("closeVoice");

    const startVoice =
        document.getElementById("startVoice");

    const stopVoice =
        document.getElementById("stopVoice");

    const summarizeVoice =
        document.getElementById("summarizeVoice");

    const transcript =
        document.getElementById("transcript");

    const summary =
        document.getElementById("summary");

    const voiceStatus =
        document.getElementById("voiceStatus");


    // =========================================
    // OPEN VOICE PANEL
    // =========================================

    if (intakeCard) {

        intakeCard.style.cursor = "pointer";

        intakeCard.addEventListener("click", function () {

            voicePanel.style.display = "flex";

        });

    }


    // =========================================
    // SPEECH RECOGNITION
    // =========================================

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

        voiceStatus.innerText =
            "❌ Voice recognition is not supported in this browser.";

        startVoice.disabled = true;

        return;
    }


    const recognition =
        new SpeechRecognition();


    recognition.continuous = true;

    recognition.interimResults = true;

    recognition.lang = "en-IN";


    let finalText = "";


    // =========================================
    // START SPEAKING
    // =========================================

    startVoice.addEventListener("click", function () {

        finalText = "";

        transcript.innerText = "";

        summary.innerText =
            "Your AI summary will appear here.";

        voiceStatus.innerText =
            "🔴 Listening... Speak now";

        startVoice.style.display = "none";

        stopVoice.style.display = "block";

        summarizeVoice.disabled = true;

        summarizeVoice.style.opacity = "0.6";


        try {

            recognition.start();

        } catch (error) {

            console.log("Recognition already running.");

        }

    });


    // =========================================
    // SPEECH RESULT
    // =========================================

    recognition.onresult = function (event) {

        let currentText = "";

        for (
            let i = event.resultIndex;
            i < event.results.length;
            i++
        ) {

            const text =
                event.results[i][0].transcript;


            if (event.results[i].isFinal) {

                finalText += text + " ";

            } else {

                currentText += text;

            }

        }


        transcript.innerText =
            finalText + currentText;


        if (finalText.trim().length > 0) {

            summarizeVoice.disabled = false;

            summarizeVoice.style.opacity = "1";

        }

    };


    // =========================================
    // STOP SPEAKING
    // =========================================

    stopVoice.addEventListener("click", function () {

        recognition.stop();

        voiceStatus.innerText =
            "✅ Voice input captured";

        startVoice.style.display = "block";

        stopVoice.style.display = "none";

    });


    // =========================================
    // RECOGNITION END
    // =========================================

    recognition.onend = function () {

        startVoice.style.display = "block";

        stopVoice.style.display = "none";


        if (finalText.trim().length > 0) {

            voiceStatus.innerText =
                "✅ Voice input captured";

            summarizeVoice.disabled = false;

            summarizeVoice.style.opacity = "1";

        }

    };


    // =========================================
    // RECOGNITION ERROR
    // =========================================

    recognition.onerror = function (event) {

        console.error(
            "Speech recognition error:",
            event.error
        );


        voiceStatus.innerText =
            "❌ Microphone error. Please try again.";

        startVoice.style.display = "block";

        stopVoice.style.display = "none";

    };


    // =========================================
    // SEND TEXT TO BACKEND
    // =========================================

    summarizeVoice.addEventListener("click", async function () {

        const text = finalText.trim();


        if (!text) {

            alert("Please speak something first.");

            return;
        }


        summary.innerText =
            "✨ AI is creating your summary...";


        summarizeVoice.disabled = true;


        try {

            const response = await fetch(
                "http://localhost:5000/api/summarize",
            {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        text: text
                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.error || "Server error"
                );

            }


            summary.innerText =
                data.summary;


        } catch (error) {

            console.error(error);

            summary.innerText =
                "❌ Could not generate summary. Please check that the backend is running.";

        }


        summarizeVoice.disabled = false;

    });


    // =========================================
    // CLOSE WINDOW
    // =========================================

    closeVoice.addEventListener("click", function () {

        voicePanel.style.display = "none";

        try {
            recognition.stop();
        } catch (error) {
            console.log(error);
        }

    });


});