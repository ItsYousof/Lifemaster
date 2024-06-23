document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('start');
    const homeButton = document.querySelector('.fa-solid.fa-house');
    const practiceButton = document.getElementById('practice');
    const quizContainer = document.querySelector('.quiz-container');
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    const timerElement = document.querySelector('.timer');
    const homeContainer = document.querySelector('.hero');

    let quizData = null; // Variable to hold quiz data
    let currentQuiz = [];
    let currentIndex = 0;
    let score = 0;
    let quizLength = 10; // Number of questions per quiz
    let timer;
    let totalTime = 5; // Time per question in seconds for hard and extreme levels

    // Fetch quiz data from quiz.json
    fetch('quiz.json')
        .then(response => response.json())
        .then(data => {
            quizData = data; // Assign fetched data to quizData variable

            // Event listener for start button
            if (startButton) {
                startButton.addEventListener('click', () => startQuiz('easy'));
            }

            // Event listener for home button
            if (homeButton) {
                homeButton.addEventListener('click', () => location.reload());
            }

            // Event listener for practice button
            if (practiceButton) {
                practiceButton.addEventListener('click', () => startPractice());
            }

            // Event listeners for difficulty buttons
            const difficultyButtons = document.querySelectorAll('.easy, .normal, .hard, .extreme');
            difficultyButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const difficulty = button.classList.contains('easy') ? 'easy' :
                        button.classList.contains('normal') ? 'normal' :
                            button.classList.contains('hard') ? 'hard' :
                                button.classList.contains('extreme') ? 'extreme' : '';
                    startQuiz(difficulty);
                });
            });
        })
        .catch(error => console.error('Error fetching quiz data:', error));

    // Function to start quiz
    function startQuiz(difficulty) {
        if (!quizData) {
            console.error('Quiz data not loaded yet.');
            return;
        }

        document.querySelector('.hero').style.display = 'none';
        // Access quiz data based on difficulty
        currentQuiz = shuffleArray(quizData[difficulty]).slice(0, quizLength);

        // Initialize quiz variables
        currentIndex = 0;
        score = 0;
        showQuestion(currentQuiz[currentIndex]);
        showProgress();
        startTimer();

        // Hide home button and show quiz container
        if (homeButton) {
            homeButton.style.display = 'none';
        }
        if (quizContainer) {
            quizContainer.style.display = 'block';
        }
    }

    // Function to start practice mode
    function startPractice() {
        const practiceQuestions = generatePracticeQuestions();
        currentQuiz = practiceQuestions;

        // Initialize practice variables
        currentIndex = 0;
        score = 0;
        showQuestion(currentQuiz[currentIndex]);
        showProgress();

        // Hide home button and show quiz container
        if (homeButton) {
            document.querySelector('.hero').style.display = 'none'
            homeButton.style.display = 'none';
        }
        if (quizContainer) {
            quizContainer.style.display = 'block';
        }
    }

    // Function to generate practice questions
    // Function to generate practice questions
    function generatePracticeQuestions() {
        const questions = [];

        for (let i = 0; i < quizLength; i++) {
            let num1 = getRandomNumber(1, 20);
            let num2 = getRandomNumber(1, 20);
            const operator = getRandomOperator();
            let question, answer;

            switch (operator) {
                case '+':
                    question = `${num1} + ${num2}`;
                    answer = num1 + num2;
                    break;
                case '-':
                    question = `${num1} - ${num2}`;
                    answer = num1 - num2;
                    break;
                case '*':
                    question = `${num1} * ${num2}`;
                    answer = num1 * num2;
                    break;
                case '/':
                    // Ensure division is integer and denominator is not zero
                    num2 = getRandomNumber(1, 10); // limit denominator
                    num1 = num2 * getRandomNumber(1, 10); // multiply to get the quotient
                    question = `${num1} / ${num2}`;
                    answer = num1 / num2;
                    break;
            }

            // Add question object to array
            questions.push({
                question: question,
                answer: answer.toFixed(2) // Round answer to 2 decimal places for division
            });
        }

        return questions;
    }


    // Function to get random number in a range
    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Function to get random operator (+, -, *, /)
    function getRandomOperator() {
        const operators = ['+', '-', '*', '/'];
        return operators[Math.floor(Math.random() * operators.length)];
    }

    // Function to display next question
    function showQuestion(question) {
        const questionElement = document.querySelector('.question');
        const choicesElement = document.querySelector('.choices');

        if (questionElement && choicesElement) {
            questionElement.textContent = question.question;
            choicesElement.innerHTML = ''; // Clear previous choices

            // Generate multiple choice options
            const choices = generateChoices(question.answer);

            choices.forEach(choice => {
                const button = document.createElement('button');
                button.textContent = choice;
                button.classList.add('choice');
                button.addEventListener('click', () => checkAnswer(question, choice));
                choicesElement.appendChild(button);
            });
        }
    }

    function generateChoices(correctAnswer) {
        const choices = [];
        choices.push(correctAnswer); // Add correct answer as one of the choices

        // Generate incorrect choices
        while (choices.length < 4) { // Adjust as needed for number of choices
            const randomChoice = getRandomNumber(correctAnswer - 10, correctAnswer + 10); // Generate random number near correct answer
            if (randomChoice !== correctAnswer && !choices.includes(randomChoice)) {
                choices.push(randomChoice.toFixed(2)); // Ensure toFixed for consistent format
            }
        }

        // Shuffle choices to randomize order
        return shuffleArray(choices);
    }

    // Function to check answer
    function checkAnswer(question) {
        const correctAnswer = parseFloat(question.answer);

        if (userAnswer === correctAnswer) {
            score++;
        }

        // Move to next question or end practice
        currentIndex++;
        if (currentIndex < currentQuiz.length) {
            showQuestion(currentQuiz[currentIndex]);
            showProgress();
        } else {
            endPractice();
        }
    }

    // Function to end practice
    function endPractice() {
        if (quizContainer) {
            quizContainer.innerHTML = `
                <h2>Practice Complete!</h2>
                <p>Your score: ${score} out of ${quizLength}</p>
                <button onclick="location.reload()">Restart Practice</button>
            `;
        }
    }

    // Function to show progress
    function showProgress() {
        const progress = Math.round((currentIndex / currentQuiz.length) * 100);
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        if (progressText) {
            progressText.textContent = `Question ${currentIndex + 1} of ${currentQuiz.length}`;
        }
    }

    // Function to start timer
    function startTimer() {
        clearInterval(timer);
        if (currentQuiz === quizData.hard || currentQuiz === quizData.extreme) {
            let timeLeft = totalTime;
            if (timerElement) {
                timerElement.textContent = `Time remaining: ${timeLeft} seconds`;
            }

            timer = setInterval(() => {
                timeLeft--;
                if (timeLeft >= 0) {
                    if (timerElement) {
                        timerElement.textContent = `Time remaining: ${timeLeft} seconds`;
                    }
                } else {
                    clearInterval(timer);
                    if (timerElement) {
                        timerElement.textContent = 'Time\'s up!';
                    }
                    setTimeout(() => {
                        currentIndex++;
                        if (currentIndex < currentQuiz.length) {
                            showQuestion(currentQuiz[currentIndex]);
                            showProgress();
                            startTimer();
                        } else {
                            endQuiz();
                        }
                    }, 1000); // Delay to show correct answer before moving to next question
                }
            }, 1000); // 1 second intervals
        } else {
            if (timerElement) {
                timerElement.textContent = ''; // No timer for easy and normal levels
            }
        }
    }

    // Function to shuffle array (Fisher-Yates shuffle)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
});
