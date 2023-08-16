const highScoreList = document.getElementById("highScoreList");
const highScore = JSON.parse(localStorage.getItem("highScores")) || [];

highScoreList.innerHTML =
    highScores.map(score => {
    return `<li> class="high-score">${score.name} - ${score.score}</li>`;
}).join("");
