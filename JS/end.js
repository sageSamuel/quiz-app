// To get reference to the UI
const username = document.querySelector('#username')
const saveScoreBtn = document.querySelector('#saveScoreBtn')
const finalScore = document.querySelector('#finalScore')

// to get the most recent score from local storage
const mostRecentScore = localStorage.getItem('mostRecentScore')

const highScores = JSON.parse(localStorage.getItem('highScores')) || []

// maximum high scores to show in the high scores page
const maximumHighScore = 5

//updating the final score
finalScore.innerText = mostRecentScore;

// Adding eventListener
username.addEventListener('keyup', () => {
    //disadbling the save button if nothing is typed
    saveScoreBtn.disabled = !username.value
})

// function to save the high score which will be invoked on click of the save buton on UI

const saveHighScore = e => {
    //prevents from redirecting to a different page
    e.preventDefault()
    // 
    const score = {
        score: mostRecentScore,
        name: username.value
    }

    highScores.push(score)
    // sorting the highscores in descending order
    highScores.sort((a,b) => {
        return b.score - a.score
    })
    // to add only 5 high scores
    highScores.splice(5)

    //saving the highscores in local storage
    localStorage.setItem('highScores', JSON.stringify(highScores))
    window.location.assign('../index.html')

    
}

