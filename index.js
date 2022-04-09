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
        },
        takeHit: {
            imageSrc: './assets/samuraiMack/Take Hit - white silhouette.png',
            framesMax: 4
        },
        death: {
            imageSrc: './assets/samuraiMack/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 158,
        height: 50
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
    imageSrc: './assets/kenji/Idle.png',
    scale: 2.5,
    framesMax: 4,
    offset: {
        x: 215,
        y: 170
    },
    sprites: {
        idle: {
            imageSrc: './assets/kenji/Idle.png',
            framesMax: 4,
        },
        run: {
            imageSrc: './assets/kenji/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './assets/kenji/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './assets/kenji/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './assets/kenji/Attack1.png',
            framesMax: 4,
        },
        takeHit: {
            imageSrc: './assets/kenji/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './assets/kenji/Death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50
        },
        width: 170,
        height: 50
    }
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
    context.fillStyle = 'rgba(255, 255, 255, 0.15)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();
    
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
        enemy.switchSprite('run');
    } else if(keys.arrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5;
        enemy.switchSprite('run');
    } else {
        enemy.switchSprite('idle');
    }

    // Jump Enemy:
    if(enemy.velocity.y < 0) {
        enemy.switchSprite('jump');
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall');
    }

    // Detect for collision:
    if(rectangularCollition({
        rectangle1: player,
        rectangle2: enemy
    }) && player.isAttacking
    && player.framesCurrent === 4) {
        enemy.takeHit();
        player.isAttacking = false; // Dar 1 hit
        //console.log('Player is attacking');

        document.querySelector('#enemyHealth').style.width = enemy.health + '%';
    }

    if(player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false;
    }

    if(rectangularCollition({
        rectangle1: enemy,
        rectangle2: player
    }) && enemy.isAttacking
    && enemy.framesCurrent === 2) {
        player.takeHit();
        enemy.isAttacking = false; // Dar 1 hit
        //console.log('Enemy is attacking');

        document.querySelector('#playerHealth').style.width = player.health + '%';
    }


    if(enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false;
    }

    // end game base on health:
    if(enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId });
    }
}
animate();

// Event Listeners:
window.addEventListener('keydown', (event) => {
    if(!player.dead) {
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
        }
    }

    if(!enemy.dead) {
        // Enemy keys:
        switch(event.key) {
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
            break;
            case 'ArrowDown':
                enemy.attack();
                enemy.lastKey = 'ArrowDown';
            break;
        }
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