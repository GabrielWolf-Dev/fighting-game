const canvas = document.getElementById('canvas-game');
const context = canvas.getContext('2d'); // Inserir um contexto que provê vários métodos e funções para resolver problemas específicos, no nosso caso um game em 2d

canvas.width = 1024;
canvas.height = 567;

context.fillRect(0, 0, canvas.width, canvas.height); // Criar um retângulo(posição "x", posição "y", width, height do retângulo criado)

const gravity = 0.7;
const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './assets/background.png'
});
const shop = new Sprite({
    position: {
        x: 550,
        y: 128
    },
    imageSrc: './assets/shop.png',
    scale: 2.75,
    framesMax: 6
});
const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: { // A velocidade contém tanto no sentido direita esquerda(x), quanto cima baixo(y)
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './assets/samuraiMack/Idle.png',
    scale: 2.5,
    framesMax: 8,
    offset: {
        x: 215,
        y: 155
    },
    sprites: {
        idle: {
            imageSrc: './assets/samuraiMack/Idle.png',
            framesMax: 8,
        },
        run: {
            imageSrc: './assets/samuraiMack/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './assets/samuraiMack/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './assets/samuraiMack/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './assets/samuraiMack/Attack1.png',
            framesMax: 6,
        }
    }
});

const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: "blue",
    offset: {
        x: -50,
        y: 0
    },
});

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    arrowLeft: {
        pressed: false
    },
    arrowRight: {
        pressed: false
    }
};

decreaseTimer();

// Gravity
function animate() {
    window.requestAnimationFrame(animate); // Loop infinito para gerar frames, ou seja, o fps que por default é 60 fps

    // Atualizar o background e jogadores com seus frames, no caso entrando no loop de sempre descer no sentido y(gravidade) com o y somando 10px
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    player.update();
    //enemy.update();
    
    player.velocity.x = 0; // Resetar quando é pressionado algum botão e não ficar andando sozinho no próximo repain do requestAnimationFrame
    enemy.velocity.x = 0;

    // Player movement
    if(keys.a.pressed && player.lastKey === 'a') { // Previnir um bug que quando é acionado um dos botões de andar e depois é pressionado o outro botão, o personagem para de andar pois entra em conflito os listeners com os valores.
        player.velocity.x = -5;
        player.switchSprite('run');
    } else if(keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5;
        player.switchSprite('run');
    } else {
        player.switchSprite('idle');
    }

    // Jump Animation:
    if(player.velocity.y < 0) {
        player.switchSprite('jump');
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall');
    }

    // Enemy movement
    if(keys.arrowLeft.pressed && enemy.lastKey === 'ArrowLeft') { // Previnir um bug que quando é acionado um dos botões de andar e depois é pressionado o outro botão, o personagem para de andar pois entra em conflito os listeners com os valores.
        enemy.velocity.x = -5;
    } else if(keys.arrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5;
    }

    // Detect for collision:
    if(rectangularCollition({
        rectangle1: player,
        rectangle2: enemy
    }) && player.isAttacking) {
        player.isAttacking = false; // Dar 1 hit
        //console.log('Player is attacking');

        enemy.health -= 20;
        document.querySelector('#enemyHealth').style.width = enemy.health + '%';
    }

    if(rectangularCollition({
        rectangle1: enemy,
        rectangle2: player
    }) && enemy.isAttacking) {
        enemy.isAttacking = false; // Dar 1 hit
        //console.log('Enemy is attacking');

        player.health -= 20;
        document.querySelector('#playerHealth').style.width = player.health + '%';
    }

    // end game base on health:
    if(enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId });
    }
}
animate();

// Event Listeners:
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = true;
            player.lastKey = 'd';
            break;
        case 'a':
            keys.a.pressed = true;
            player.lastKey = 'a';
            break;
        case 'w':
            player.velocity.y = -20;
            break;
        case ' ':
            player.attack();
            break;

        // Enemy keys:
        case 'ArrowRight':
            keys.arrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight';
            //lastKey = 'd'; -- Isso vai reescrever o player, no caso vamos criar uma variável no this.lastKey para mexer com estado das teclas do inimigo
            break;
        case 'ArrowLeft':
            keys.arrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft';
            break;
        case 'ArrowUp':
            enemy.velocity.y = -20;
            enemy.lastKey = 'ArrowUp';
            break;
        case 'ArrowDown':
            enemy.attack();
            enemy.lastKey = 'ArrowDown';
            break;
    }
});

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
    }

    // Enemy keys:
    switch (event.key) {
        case 'ArrowRight':
            keys.arrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.arrowLeft.pressed = false;
            break;
    }
});