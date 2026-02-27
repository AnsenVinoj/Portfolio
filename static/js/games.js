// --- Random AI Facts ---
const generateFact = async () => {
    const factDisplay = document.getElementById("fact-display");
    factDisplay.innerHTML = '<i class="fa-solid fa-spinner fa-spin fade"></i> Generating...';
    try {
        const res = await fetch('/api/fact');
        const data = await res.json();
        factDisplay.innerText = data.fact;
        factDisplay.style.color = "var(--primary-color)";
    } catch (err) {
        factDisplay.innerText = "Error loading fact. Is the AI sleeping?";
    }
};

// --- Guess the Algorithm ---
let currentAlgoAnswer = "";

const checkAlgorithm = () => {
    const guess = document.getElementById("algo-guess").value.trim().toLowerCase();
    const resultDisplay = document.getElementById("algo-result");

    if (!guess) return;

    if (guess === currentAlgoAnswer.toLowerCase()) {
        resultDisplay.innerHTML = '<span style="color: #00ffcc;"><i class="fa-solid fa-check"></i> Correct! Genius at work!</span>';
        setTimeout(loadNewAlgorithm, 2000); // Load new one after 2 seconds
    } else {
        resultDisplay.innerHTML = '<span style="color: #ff0055;"><i class="fa-solid fa-xmark"></i> Incorrect. Try again!</span>';
    }
};

const loadNewAlgorithm = async () => {
    const clueDisplay = document.getElementById("algo-clue");
    const resultDisplay = document.getElementById("algo-result");
    const guessInput = document.getElementById("algo-guess");

    guessInput.value = "";
    resultDisplay.innerHTML = "";

    try {
        const res = await fetch('/api/algorithm');
        const data = await res.json();
        clueDisplay.innerText = `"${data.clue}"`;
        currentAlgoAnswer = data.answer;
    } catch (err) {
        clueDisplay.innerText = "Error loading the game.";
    }
};

// Load the initial algorithm on page load
document.addEventListener("DOMContentLoaded", () => {
    loadNewAlgorithm();

    // Setup Double Click for Easter Egg
    const eggCard = document.getElementById("easter-egg");
    if (eggCard) {
        let isMatrix = false;
        eggCard.addEventListener("dblclick", () => {
            const eggP = eggCard.querySelector("p");
            if (!isMatrix) {
                isMatrix = true;
                eggP.innerHTML = "<span style='color: #ff0055; font-weight: bold;'>Matrix Activated.</span>";
                document.body.style.filter = "invert(1) hue-rotate(180deg)";
                setTimeout(() => {
                    document.body.style.filter = "none";
                    eggP.innerText = "Double click here to enter the Matrix.";
                    isMatrix = false;
                }, 5000);
            }
        });
    }
});
