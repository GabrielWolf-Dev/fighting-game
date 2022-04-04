const canvas = document.getElementById('canvas-game');
const context = canvas.getContext('2d'); // Inserir um contexto que provê vários métodos e funções para resolver problemas específicos, no nosso caso um game em 2d

canvas.width = 1024;
canvas.height = 567;

context.fillRect(0, 0, canvas.width, canvas.height); // Criar um retângulo(posição "x", posição "y", width, height do retângulo criado)

const gravity = 0.7;
// Players
class Sprite {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.height = 150;
        this.lastKey; // Previnir conflitos na hora de pressionar(kewdown) e pegar o último estado atual da tecla
    }

    draw() {
        context.fillStyle = 'red';
        context.fillRect(this.position.x, this.position.y, 50, this.height);
    }

    update() { // Atualizar cada velocidade do frame de cada personagem ou outro obj
        this.draw();

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        const totalBottomPlayer =  this.position.y + this.height + this.velocity.y;
        const canvasHeight = canvas.height;
        if(totalBottomPlayer >= canvasHeight) // Se o valor total do bottom do player for igual a altura do canvas é pra parar de cair.
            this.velocity.y = 0; // Pare de cair
        else
            this.velocity.y += gravity; // Se não for a gravidade vai puxar para o chão que é o último pixel da altura do canvas.
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
    }
});

const enemy = new Sprite({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
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

// Gravity
function animate() {
    window.requestAnimationFrame(animate); // Loop infinito para gerar frames, ou seja, o fps que por default é 60 fps

    // Atualizar o backgorund e jogadores com seus frames, no caso entrando no loop de sempre descer no sentido y(gravidade) com o y somando 10px
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    console.log(player.velocity);
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