function rectangularCollition({
    rectangle1,
    rectangle2
}) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x
        && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
        && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
        && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    );
}

function determineWinner({ player, enemy, timerId }) {
    clearTimeout(timerId);
    const element = document.querySelector('.winner-game');
    element.style.display = 'flex';

    if(player.health === enemy.health){
        const phrase = 'Empate!';
        
        phraseToRestartPage(phrase, element);
    } else if(player.health > enemy.health) {
        const phrase = 'Jogador 1 ganhou!';

        phraseToRestartPage(phrase, element);
    } else if(enemy.health > player.health) {
        const phrase = 'Jogador 2 ganhou!';

        phraseToRestartPage(phrase, element);
    }
}

function phraseToRestartPage(phrase, element) {
    element.textContent = phrase + ' Recomeçando o jogo em instantes...';

    setTimeout(() => {
        document.location.reload(true);
    }, 2500);
}

let timer = 60;
let timerId;
function decreaseTimer(){
    if(timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--;
        document.querySelector('.timer').textContent = timer;
    }

    if(timer === 0)
        determineWinner({ player, enemy, timerId });
}