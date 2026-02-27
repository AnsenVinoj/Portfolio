document.addEventListener("DOMContentLoaded", () => {

    const chatToggle = document.getElementById("chat-toggle");
    const chatWindow = document.getElementById("chat-window");
    const chatClose = document.getElementById("chat-close");
    const chatBody = document.getElementById("chat-body");
    const chatInput = document.getElementById("chat-input");
    const chatSendBtn = document.getElementById("chat-send");
    const voiceBtn = document.getElementById("voice-btn");

    // Toggle Chat Window
    if (chatToggle && chatWindow && chatClose) {
        chatToggle.addEventListener("click", () => {
            chatWindow.classList.toggle("d-none");
            chatToggle.style.display = chatWindow.classList.contains("d-none") ? "flex" : "none";
        });

        chatClose.addEventListener("click", () => {
            chatWindow.classList.add("d-none");
            chatToggle.style.display = "flex";
        });
    }

    // Add Message to UI
    const addMessage = (text, sender) => {
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("message", sender);
        msgDiv.innerText = text;
        chatBody.appendChild(msgDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    };

    // Send Message Logic
    const sendMessage = async () => {
        const message = chatInput.value.trim();
        if (!message) return;

        // User message
        addMessage(message, "user");
        chatInput.value = "";

        // Typing indicator
        const typingMsg = document.createElement("div");
        typingMsg.classList.add("message", "bot");
        typingMsg.innerHTML = '<i class="fa-solid fa-ellipsis fa-fade"></i>';
        typingMsg.id = "typing-status";
        chatBody.appendChild(typingMsg);
        chatBody.scrollTop = chatBody.scrollHeight;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });
            const data = await response.json();

            // Remove typing indicator
            const typingObj = document.getElementById("typing-status");
            if (typingObj) {
                typingObj.remove();
            }

            // Bot response
            addMessage(data.response, "bot");
        } catch (error) {
            console.error("Chat Error:", error);
            const typingObj = document.getElementById("typing-status");
            if (typingObj) {
                typingObj.remove();
            }
            addMessage("Error connecting to server.", "bot");
        }
    };

    if (chatSendBtn) {
        chatSendBtn.addEventListener("click", sendMessage);
    }

    if (chatInput) {
        chatInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") sendMessage();
        });
    }

    // --- Web Speech API (Speech to Text) ---
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        // Voice Button Logic
        if (voiceBtn) {
            voiceBtn.addEventListener('click', () => {
                recognition.start();
                voiceBtn.style.color = '#ff0055'; // Indicating listening state
                chatInput.placeholder = "Listening...";
            });
        }

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            chatInput.value = transcript;
            voiceBtn.style.color = 'var(--primary-color)';
            chatInput.placeholder = "Type a message...";
            sendMessage(); // Automatically send
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            voiceBtn.style.color = 'var(--primary-color)';
            chatInput.placeholder = "Type a message...";
        };

        recognition.onend = () => {
            voiceBtn.style.color = 'var(--primary-color)';
            chatInput.placeholder = "Type a message...";
        };

    } else {
        if (voiceBtn) voiceBtn.style.display = 'none'; // Hide if not supported
    }

});
