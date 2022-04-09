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
        element.textContent = 'Empate! Recarregue a página para recomeçar novamente.';
    } else if(player.health > enemy.health) {
        element.textContent = 'Jogador 1 ganhou! Recarregue a página para recomeçar novamente.';
    } else if(enemy.health > player.health) {
        element.textContent = 'Jogador 2 ganhou! Recarregue a página para recomeçar novamente.';
    }
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