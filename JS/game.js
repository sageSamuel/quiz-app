// ------------ Getting the IDs for manipulation ---------------

const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressStatus = document.getElementById('progressStatus');
const quiz = document.getElementById('quiz');
const loader = document.getElementById('loader');

// current questions object
let currentQuizQuestion = {}
// for delaying when someone answers a questoin before answering 2nd question
let acceptingAnswers = false;
let score = 0;
//to keep track of the score
let questionCounter = 0;
//creating an empty array for storing copy of all questions coming from api
let availableQuizQuestions = [];

let questions = [];
// async await for fetching the questions data from opentdb api
async function getData(params) {
    try {
        const response = await fetch("https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple");
        const responseData = await response.json();
        // loading the questions
        questions = responseData.results.map((responseQuestion) => {
            const formattedQuestion = {
                question: responseQuestion.question
            };
            // choices
            const answerChoices = [...responseQuestion.incorrect_answers];
            // for displaying the answer in a random position in answer choices array in UI
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                responseQuestion.correct_answer
            );
            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });
            return formattedQuestion;
        });
    
        // for starting quiz
        startQuiz();
    }  catch (error){
        console.log(error);
    }
}

// on load
getData();

// constants for total questions and points on each question
const pointOnCorrectAnswer = 10;
const totalQuestions = 10;

startQuiz = () => {
    // initializing question counter and score as 0
    questionCounter = 0;
    score = 0;
    //copying all the question that are coming from api using spread
    availableQuizQuestions = [...questions];
    // to get a new question
    getNewQuestion();
    quiz.classList.remove('hidden');
    loader.classList.add('hidden');
};

getNewQuestion = () => {
    // if all the questions are used
    if (availableQuizQuestions.length === 0 || questionCounter >= totalQuestions) {
        // save the most recent score to score variable
        localStorage.setItem('mostRecentScore', score);
        // redirects to the end page
        return window.location.assign('./end.html');
    }

    questionCounter++;

    // update the question counter text
    progressText.innerText = `Question ${questionCounter}/${totalQuestions}`;
    //update the progress bar
    progressStatus.style.width = `${(questionCounter / totalQuestions) * 100}%`
    //to display a random question
    const questionIndex = Math.floor(Math.random() * availableQuizQuestions.length);
    currentQuizQuestion = availableQuizQuestions[questionIndex];
    question.innerHTML = currentQuizQuestion.question;

    // grabbing the choices
    choices.forEach((choice) => {
        //getting the number from Data-number
        const number = choice.dataset['number'];
        // to get the choice
        choice.innerHTML = currentQuizQuestion['choice' + number];
    })

    // Remove the used question
    availableQuizQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

// grabbing each choices
choices.forEach((choice) => {
    // adding event listener for getting the clicked option
    choice.addEventListener('click', (e) => {
            if (!acceptingAnswers) return;
            // to add a delay
            acceptingAnswers = false;

            // selecting the answer and the choice
            const selectedChoice = e.target;
            const selectedAnswer = selectedChoice.dataset['number'];    
            //if answer is correct, then add the correct clsss, else add the incorrect css class
            const classToApply =
                selectedAnswer == currentQuizQuestion.answer ? 'correct' : 'incorrect';
                // if the answer is correct then increment the score
                if (classToApply === 'correct') {
                    incrementScore(pointOnCorrectAnswer);
                }
        
            selectedChoice.parentElement.classList.add(classToApply);
            // for removing the class after a question is answered
            setTimeout( () =>{
                selectedChoice.parentElement.classList.remove(classToApply);
                // get a new question
                getNewQuestion();
            }, 1000 );
            });
        });
            
// increment the score 
incrementScore = (num) => {
    score += num;
    scoreText.innerText = score;
}

    

    
