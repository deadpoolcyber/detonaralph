const state = {
    view:{
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        lives: document.querySelector("#lives")
    },
    values:{
        gameVelocity: 1000,
        hitPosition: 0,
        result: 0,
        curretTime: 60,
        lives: 3
    },
    actions:{   
        timerId: setInterval(randomSquare, 1000),
        countDonwId: setInterval(countdown, 1000),
    }
}

function countdown(){
    state.values.curretTime--;
    state.view.timeLeft.textContent = state.values.curretTime;

    if(state.values.curretTime <= 0){
        clearInterval(state.actions.countDonwId);
        clearInterval(state.actions.timerId);
        alert("Game Over! Your final score is: " + state.values.result);
    }
}

function playSound(audioName){
    let audio = new Audio(`./src/audio/${audioName}.m4a`);
    audio.volume = 0.2;
    audio.play();
}

function randomSquare(){
    // remove o inimigo de todos os quadrados
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });

     // Se o jogador não clicou no inimigo anterior → perde uma vida
    if (state.values.hitPosition) {
        state.values.lives--; // tira 1 vida
        state.view.lives.textContent = state.values.lives; // mostra no HTML

        if (state.values.lives <= 0) {
            clearInterval(state.actions.countDonwId);
            clearInterval(state.actions.timerId);
            alert("Você perdeu todas as vidas! Pontuação final: " + state.values.result);
            return; // sai da função para não gerar novo inimigo
        }
    }

    // escolhe sempre um novo quadrado para ser o inimigo
    let randomNumber = Math.floor(Math.random() * state.view.squares.length);
    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");
    state.values.hitPosition = randomSquare.id;

    // verifica se acabou as vidas
    if (state.values.lives <= 0) {
        clearInterval(state.actions.countDonwId);
        clearInterval(state.actions.timerId);
        alert("Você perdeu todas as vidas! Pontuação final: " + state.values.result);
    }
}

/*function moveEnemy(){
    state.values.timerId = setInterval(randomSquare, state.values.gameVelocity)
}*/

function addListenerHitBox(){
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {
            if(square.id === state.values.hitPosition){
                state.values.result++;
                state.view.score.textContent = state.values.result;
                state.values.hitPosition = null;
                playSound("hit");
            }
        });
    });
}

function init(){
    /*moveEnemy();*/
    addListenerHitBox();
}

init();