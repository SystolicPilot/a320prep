document.addEventListener("DOMContentLoaded", () => {
    let questionBank = [];
    let shuffledQuestions = [];
    let currentQuestionIndex = 0;
    let correctAnswers = 0;

    const quizContainer = document.querySelector(".quiz-container");

    function loadQuestions() {
        fetch("https://systolicpilot.github.io/a320prep/questions.json")
            .then(response => response.json())
            .then(data => {
                questionBank = data;
                console.log("Total questions loaded:", questionBank.length);
                shuffledQuestions = [...questionBank].sort(() => Math.random() - 0.5);
                console.log("Shuffled questions count:", shuffledQuestions.length);
                startQuiz();
            })
            .catch(error => {
                console.error("Error loading questions:", error);
                quizContainer.innerHTML = "<p>Failed to load questions. Please try again.</p>";
            });
    }

    function startQuiz() {
        currentQuestionIndex = 0;
        correctAnswers = 0;
        renderQuizUI();
        setNextQuestion();
    }

    function renderQuizUI() {
        quizContainer.innerHTML = `
            <h1>Airbus A320 Quiz - Study Mode</h1>
            <hr class="title-divider"> <!-- Divider under title -->
            <div id="question-container">
                <p id="question-text">Loading questions...</p>
                <div id="answer-buttons" class="btn-grid"></div>
            </div>
            <div id="navigation-container">
                <span id="back-chevron" class="chevron disabled">&lt;</span>
                <div id="progress-bar">
                    <div id="progress-fill"></div>
                </div>
                <span id="next-chevron" class="chevron">&gt;</span>
            </div>
        `;
        attachGlobalEventListeners(); // Attach event listeners once
    }

    function setNextQuestion() {
        resetState();
        if (currentQuestionIndex >= shuffledQuestions.length) {
            showResults();
            return;
        }

        console.log(`Displaying question ${currentQuestionIndex + 1} of ${shuffledQuestions.length}`);
        const question = shuffledQuestions[currentQuestionIndex];
        document.getElementById("question-text").textContent = question.question;

        question.answers.forEach((answer, index) => {
            const button = document.createElement("button");
            button.textContent = answer;
            button.classList.add("btn");
            button.addEventListener("click", () => handleAnswer(button, index === question.correct));
            document.getElementById("answer-buttons").appendChild(button);
        });

        updateProgressBar();
        updateChevrons();
    }

    function handleAnswer(button, isCorrect) {
        Array.from(document.getElementById("answer-buttons").children).forEach(btn => {
            btn.disabled = true;
        });

        if (isCorrect) {
            button.classList.add("correct");
            correctAnswers++;
        } else {
            button.classList.add("wrong");
            const correctButton = Array.from(document.getElementById("answer-buttons").children)[
                shuffledQuestions[currentQuestionIndex].correct
            ];
            correctButton.classList.add("correct");
        }
    }

    function showResults() {
        const percentage = Math.round((correctAnswers / shuffledQuestions.length) * 100);
        const resultMessage = percentage >= 75 ? "Pass" : "Fail";
    
        quizContainer.innerHTML = `
            <h1>Quiz Completed!</h1>
            <p style="font-size: 24px; font-weight: bold;">You scored: ${percentage}%</p>
            <p style="color: ${percentage >= 75 ? 'green' : 'red'}; font-size: 18px;">${resultMessage}</p>
            <p>${correctAnswers} out of ${shuffledQuestions.length}</p>
            <button id="restart-btn" class="btn">Try Again</button>
        `;
    
        document.getElementById("restart-btn").addEventListener("click", startQuiz);
    }
    
    

    function resetState() {
        console.log("Resetting question UI state.");
        document.getElementById("answer-buttons").innerHTML = "";
    }

    function updateProgressBar() {
        const progressFill = document.getElementById("progress-fill");
        const progressText = `${currentQuestionIndex + 1} / ${shuffledQuestions.length}`;
        const progressPercentage = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;
    
        progressFill.style.width = `${progressPercentage}%`;
        progressFill.textContent = progressText; // Display x/y inside the progress bar
        progressFill.style.color = "#fff"; // Ensure the text is visible
        progressFill.style.textAlign = "center";
        progressFill.style.lineHeight = "15px";
    }
    
    function updateChevrons() {
        const backChevron = document.getElementById("back-chevron");
        const nextChevron = document.getElementById("next-chevron");
    
        backChevron.classList.toggle("disabled", currentQuestionIndex === 0);
        // Keep the next button active on the last question to move to the score page
        nextChevron.classList.toggle("disabled", currentQuestionIndex >= shuffledQuestions.length);
    
        console.log(`Current question index BEFORE click: ${currentQuestionIndex}`);
    
        backChevron.onclick = currentQuestionIndex > 0 ? () => { 
            currentQuestionIndex--; 
            console.log(`Back clicked. New index: ${currentQuestionIndex}`);
            setNextQuestion(); 
        } : null;
    
        nextChevron.onclick = currentQuestionIndex < shuffledQuestions.length ? () => { 
            currentQuestionIndex++; 
            console.log(`Next clicked. New index: ${currentQuestionIndex}`);
            setNextQuestion(); 
        } : null;
    }
    

    function attachGlobalEventListeners() {
        console.log("Attaching global event listeners.");
    }

    loadQuestions();
});
