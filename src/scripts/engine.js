/* ===========================
   Estado principal do jogo
   =========================== */
const state = {
    view:{ // Conexão com o HTML (DOM)
        squares: document.querySelectorAll(".square"), // todos os quadrados do painel
        enemy: document.querySelector(".enemy"),       // inimigo (posição atual, se existir)
        timeLeft: document.querySelector("#time-left"),// contador de tempo
        score: document.querySelector("#score"),       // pontuação do jogador
        lives: document.querySelector("#lives")        // número de vidas
    },

    values:{ // Valores que mudam durante o jogo
        gameVelocity: 1000, // velocidade do jogo (1 segundo)
        hitPosition: 0,     // posição atual do inimigo (qual quadrado ele está)
        result: 0,          // pontuação do jogador
        curretTime: 60,     // tempo inicial do jogo (em segundos)
        lives: 3            // número de vidas iniciais
    },

    actions:{   // Ações automáticas (executadas com intervalo de tempo)
        timerId: setInterval(randomSquare, 1000),  // a cada 1s chama randomSquare()
        countDonwId: setInterval(countdown, 1000), // a cada 1s chama countdown()
    }
}

/* ===========================
   Função de contagem regressiva
   =========================== */
function countdown(){
    state.values.curretTime--; // diminui 1 segundo
    state.view.timeLeft.textContent = state.values.curretTime; // atualiza no HTML

    // Se o tempo acabar → encerra o jogo
    if(state.values.curretTime <= 0){
        clearInterval(state.actions.countDonwId); // para o cronômetro
        clearInterval(state.actions.timerId);     // para os inimigos
        alert("Game Over! Your final score is: " + state.values.result); // mostra mensagem final
    }
}

/* ===========================
   Função para tocar sons
   =========================== */
function playSound(audioName){
    let audio = new Audio(`./src/audio/${audioName}.m4a`); // carrega o arquivo de som
    audio.volume = 0.2; // define volume (20%)
    audio.play();       // toca o áudio
}

/* ===========================
   Função que move o inimigo
   =========================== */
function randomSquare(){
    // Remove o inimigo de todos os quadrados
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });

    // Se o jogador não clicou no inimigo anterior → perde uma vida
    if (state.values.hitPosition) {
        state.values.lives--; // tira 1 vida
        state.view.lives.textContent = state.values.lives; // atualiza no HTML

        // Se não houver mais vidas → fim de jogo
        if (state.values.lives <= 0) {
            clearInterval(state.actions.countDonwId);
            clearInterval(state.actions.timerId);
            alert("Você perdeu todas as vidas! Pontuação final: " + state.values.result);
            return; // encerra a função para não gerar novo inimigo
        }
    }

    // Sorteia um número aleatório entre 0 e 8 (9 quadrados)
    let randomNumber = Math.floor(Math.random() * state.view.squares.length);
    let randomSquare = state.view.squares[randomNumber]; // escolhe o quadrado
    randomSquare.classList.add("enemy"); // coloca o inimigo nele
    state.values.hitPosition = randomSquare.id; // salva a posição atual do inimigo

    // Garantia extra: se vidas acabarem, fecha o jogo
    if (state.values.lives <= 0) {
        clearInterval(state.actions.countDonwId);
        clearInterval(state.actions.timerId);
        alert("Você perdeu todas as vidas! Pontuação final: " + state.values.result);
    }
}

/* ===========================
   Função que detecta cliques no painel
   =========================== */
function addListenerHitBox(){
    // Para cada quadrado, adiciona um evento de clique
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {
            // Se o jogador acertar o quadrado onde o inimigo está
            if(square.id === state.values.hitPosition){
                state.values.result++; // soma 1 ponto
                state.view.score.textContent = state.values.result; // mostra no HTML
                state.values.hitPosition = null; // reseta (para não perder vida automaticamente)
                playSound("hit"); // toca som de acerto
            }
        });
    });
}

/* ===========================
   Função que inicia o jogo
   =========================== */
function init(){
    /* moveEnemy();  -> estava previsto para controlar a velocidade do inimigo */
    addListenerHitBox(); // ativa os eventos de clique
}

// Inicializa o jogo
init();
