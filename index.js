const canvas = document.getElementById('canvas-game');
const context = canvas.getContext('2d'); // Inserir um contexto que provê vários métodos e funções para resolver problemas específicos, no nosso caso um game em 2d

canvas.width = 1024;
canvas.height = 567;

context.fillRect(0, 0, canvas.width, canvas.height); // Criar um retângulo(posição "x", posição "y", width, height do retângulo criado)

const gravity = 0.7;
// Players
class Sprite {
    constructor({ position, velocity, color = 'red', offset }) {
        this.position = position;
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.lastKey; // Previnir conflitos na hora de pressionar(kewdown) e pegar o último estado atual da tecla
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50,
        };
        this.color = color;
        this.isAttacking;
    }

    draw() {
        context.fillStyle = this.color;
        context.fillRect(this.position.x, this.position.y, this.width, this.height);
    
        // Attack box:
        if(this.isAttacking) {
            context.fillStyle = 'green';
            context.fillRect(
                this.attackBox.position.x,
                this.attackBox.position.y,
                this.attackBox.width,
                this.attackBox.height
            );
        }
    }

    update() { // Atualizar cada velocidade do frame de cada personagem ou outro obj
        this.draw();
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        const totalBottomPlayer =  this.position.y + this.height + this.velocity.y;
        const canvasHeight = canvas.height;
        if(totalBottomPlayer >= canvasHeight) // Se o valor total do bottom do player for igual a altura do canvas é pra parar de cair.
            this.velocity.y = 0; // Pare de cair
        else
            this.velocity.y += gravity; // Se não for a gravidade vai puxar para o chão que é o último pixel da altura do canvas.
    }

    attack() {
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 100);
    }
}

const player = new Sprite({
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
});

const enemy = new Sprite({
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

// Gravity
function animate() {
    window.requestAnimationFrame(animate); // Loop infinito para gerar frames, ou seja, o fps que por default é 60 fps

    // Atualizar o background e jogadores com seus frames, no caso entrando no loop de sempre descer no sentido y(gravidade) com o y somando 10px
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();

    player.velocity.x = 0; // Resetar quando é pressionado algum botão e não ficar andando sozinho no próximo repain do requestAnimationFrame
    enemy.velocity.x = 0;

    // Player movement
    if(keys.a.pressed && player.lastKey === 'a') { // Previnir um bug que quando é acionado um dos botões de andar e depois é pressionado o outro botão, o personagem para de andar pois entra em conflito os listeners com os valores.
        player.velocity.x = -5;
    } else if(keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5;
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
        console.log('Player is attacking');
    }

    if(rectangularCollition({
        rectangle1: enemy,
        rectangle2: player
    }) && enemy.isAttacking) {
        enemy.isAttacking = false; // Dar 1 hit
        console.log('Enemy is attacking');
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