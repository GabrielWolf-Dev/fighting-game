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
    document.querySelector('.winner-game').style.display = 'flex';

    if(player.health === enemy.health){
        document.querySelector('.winner-game').textContent = 'Tie';
    } else if(player.health > enemy.health) {
        document.querySelector('.winner-game').textContent = 'Player 1 wins';
    } else if(enemy.health > player.health) {
        document.querySelector('.winner-game').textContent = 'Player 2 wins';
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