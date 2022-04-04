const canvas = document.getElementById('canvas-game');
const context = canvas.getContext('2d'); // Inserir um contexto que provê vários métodos e funções para resolver problemas específicos, no nosso caso um game em 2d

canvas.width = 1024;
canvas.height = 567;

context.fillRect(0, 0, canvas.width, canvas.height); // Criar um retângulo(posição "x", posição "y", width, height do retângulo criado)

const gravity = 0.2;
// Players
class Sprite {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.height = 150;
    }

    draw() {
        context.fillStyle = 'red';
        context.fillRect(this.position.x, this.position.y, 50, this.height);
    }

    update() { // Atualizar cada velocidade do frame de cada personagem ou outro obj
        this.draw();
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

// Gravity
function animate() {
    window.requestAnimationFrame(animate); // Loop infinito para gerar frames

    // Atualizar o backgorund e jogadores com seus frames, no caso entrando no loop de sempre descer no sentido y(gravidade) com o y somando 10px
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    console.log(player.velocity);
    player.update();
    enemy.update();
}
animate();