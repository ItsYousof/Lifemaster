document.addEventListener("DOMContentLoaded", function () {
    let lessons = [];
    let currentLesson = null;
    let currentQuestionIndex = 0;
    let correctAnswers = 0;

    // Fetch the lessons data
    fetch('lessons.json')
        .then(response => response.json())
        .then(data => {
            lessons = data.lessons;
            displayLessons();
        })
        .catch(error => console.error('Error loading lessons:', error));

    function showSection(sectionId) {
        document.querySelectorAll('section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');
    }

    function displayLessons() {
        const lessonList = document.getElementById('lesson-list');
        lessonList.innerHTML = ''; // Clear the list first
        lessons.forEach(lesson => {
            const lessonItem = document.createElement('div');
            lessonItem.className = 'lesson-item';
            lessonItem.innerText = lesson.title;
            lessonItem.onclick = () => startLesson(lesson.id);
            lessonList.appendChild(lessonItem);
        });
    }

    function startLesson(lessonId) {
        currentLesson = lessons.find(lesson => lesson.id === lessonId);
        if (!currentLesson) {
            console.error('Lesson not found:', lessonId);
            return;
        }
        currentQuestionIndex = 0;
        correctAnswers = 0;
        showSection('lesson-detail');
        displayQuestion();
    }

    function displayQuestion() {
        if (!currentLesson || currentQuestionIndex >= currentLesson.questions.length) {
            endLesson();
            return;
        }

        const questionContainer = document.getElementById('questions-container');
        questionContainer.innerHTML = '';

        const question = currentLesson.questions[currentQuestionIndex];
        document.getElementById('lesson-title').innerText = currentLesson.title;

        const questionText = document.createElement('p');
        questionText.innerText = question.question;
        questionContainer.appendChild(questionText);

        switch (question.type) {
            case 'multiple_choice':
                question.options.forEach(option => {
                    const optionButton = document.createElement('button');
                    optionButton.innerText = option;
                    optionButton.onclick = () => checkAnswer(option);
                    questionContainer.appendChild(optionButton);
                });
                break;
            case 'typing':
                const inputField = document.createElement('input');
                inputField.type = 'text';
                inputField.id = 'typing-answer';
                questionContainer.appendChild(inputField);

                const submitButton = document.createElement('button');
                submitButton.innerText = 'Submit';
                submitButton.onclick = () => checkTypingAnswer();
                questionContainer.appendChild(submitButton);
                break;
            case 'matching':
                const words = question.pairs.map(pair => pair.word);
                const matches = question.pairs.map(pair => pair.match);

                const wordList = document.createElement('div');
                const matchList = document.createElement('div');
                wordList.className = 'matching-list';
                matchList.className = 'matching-list';

                words.forEach(word => {
                    const wordItem = document.createElement('div');
                    wordItem.className = 'matching-item';
                    wordItem.innerText = word;
                    wordList.appendChild(wordItem);
                });

                matches.forEach(match => {
                    const matchItem = document.createElement('div');
                    matchItem.className = 'matching-item';
                    matchItem.innerText = match;
                    matchList.appendChild(matchItem);
                });

                questionContainer.appendChild(wordList);
                questionContainer.appendChild(matchList);

                const submitMatchingButton = document.createElement('button');
                submitMatchingButton.innerText = 'Submit';
                submitMatchingButton.onclick = () => checkMatchingAnswer();
                questionContainer.appendChild(submitMatchingButton);
                break;
        }
    }

    function checkAnswer(selectedOption) {
        const question = currentLesson.questions[currentQuestionIndex];
        if (selectedOption === question.answer) {
            correctAnswers++;
            alert('Correct!');
        } else {
            alert('Try again!');
        }
        currentQuestionIndex++;
        displayQuestion();
    }

    function checkTypingAnswer() {
        const inputField = document.getElementById('typing-answer');
        const answer = inputField.value.trim();
        const question = currentLesson.questions[currentQuestionIndex];
        let clickedAnswer = document.querySelector(`button[onclick="checkAnswer('${answer}')"]`);
        if (answer === question.answer) {
            correctAnswers++;
        } else {
            clickedAnswer.style.backgroundColor = 'red';
            return;
        }
        currentQuestionIndex++;
        displayQuestion();
    }

    function checkMatchingAnswer() {
        const words = document.querySelectorAll('.matching-list:first-child .matching-item');
        const matches = document.querySelectorAll('.matching-list:last-child .matching-item');
        const question = currentLesson.questions[currentQuestionIndex];

        let correct = true;
        words.forEach((wordItem, index) => {
            const matchItem = matches[index];
            const pair = question.pairs.find(p => p.word === wordItem.innerText);
            if (!pair || pair.match !== matchItem.innerText) {
                correct = false;
            }
        });

        if (correct) {
            correctAnswers++;
            alert('Correct!');
        } else {
            alert('Try again!');
        }
        currentQuestionIndex++;
        displayQuestion();
    }

    function endLesson() {
        const progress = document.getElementById('progress');
        const totalQuestions = currentLesson.questions.length;
        const score = (correctAnswers / totalQuestions) * 100;
        progress.innerText = `${score}%`;
        showSection('lessons');
        alert(`Lesson completed! Your score: ${score}%`);
    }

    document.querySelectorAll('footer nav ul li a').forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            showSection(this.getAttribute('href').substring(1));
        });
    });

    window.showSection = showSection;
    window.startLesson = startLesson;
    window.checkAnswer = checkAnswer;
});
