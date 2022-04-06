// Players
class Sprite {
    constructor({ position, imageSrc}) {
        this.position = position;
        this.image = new Image();
        this.image.src = imageSrc;
    }

    draw() {
        context.drawImage(this.image, this.position.x, this.position.y);
    }

    update() { // Atualizar cada velocidade do frame de cada personagem ou outro obj
        this.draw();
    }
}

class Fighter {
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
        this.health = 100;
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
        if(totalBottomPlayer >= canvasHeight - 87) // Se o valor total do bottom do player for igual a altura do canvas é pra parar de cair.
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