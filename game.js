
const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const questionCounterText = document.getElementById('questionCounter');
const scoreText = document.getElementById('score');
const loading = document.getElementById('loading');
const game = document.getElementById('game');

let currentQuestion = {};
let acceptingAnswers = true;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

fetch(
   "https://opentdb.com/api.php?amount=15&category=19&difficulty=medium&type=multiple"
    //"https://opentdb.com/api.php?amount=50&category=19&difficulty=easy&type=multiple"
    //"https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple"
)
.then(res  => {
    console.log(res);
    return res.json();
})
.then(loadedQuestions => {
    console.log(loadedQuestions.results);
   questions = loadedQuestions.results.map( loadedQuestion => {
        const formattedQuestion = {
    question:loadedQuestion.question
        };

        const answerChoices = [...loadedQuestion.incorrect_answers];
        formattedQuestion.answer = Math.floor(Math.random() * 10) + 1;
        answerChoices.splice(
            formattedQuestion.answer - 1,0,
        
        loadedQuestion.correct_answer
        );
        answerChoices.forEach((choice, index) => {
            formattedQuestion["choice" + (index + 1)] = choice;
        });
        return formattedQuestion;
    });
   game.classList.remove("hidden");
   loading.classList.add("hidden");
   // questions = loadedQuestions;
   startGame();
})
.catch(err => {
console.err(err);
});

const CORRECT_BONUS = 10;
const MAX_QUESTION = 5;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    console.log(availableQuestions);
    getNewQuestion();
};

getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter >=MAX_QUESTION) {
        localStorage.setItem("mostRecentScore", score);
        // go to end page
        return window.location.assign("end.html");
    }
    questionCounter++;
     questionCounterText.innerText =  questionCounter + "/" + MAX_QUESTION;
// update the progress bar
 //progressBarFull.style.width = questionCounter  + "/" + MAX_QUESTION;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });

    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;

    function newFunction() {
        localStorage.setItem('mostRecentScore', score);
    }
};

choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        console.log(e.target);
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

       const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

       if(classToApply === 'correct') {
        incrementScore(CORRECT_BONUS);
       }

       selectedChoice.parentElement.classList.add(classToApply);

       setTimeout(() => {
        selectedChoice.parentElement.classList.remove(classToApply);
        getNewQuestion();
       }, 1000);


     //   console.log(selectedAnswer == currentQuestion.answer); // Fixed typo her
    });
});
incrementScore = num => {
  score += num;
   scoreText.innerText = score;
};