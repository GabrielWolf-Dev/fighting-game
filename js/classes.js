// Players
class Sprite {
    constructor({
        position,
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = { x: 0, y: 0 }
    }) {
        this.position = position;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.framesMax = framesMax;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;
        this.offset = offset;
    }

    draw() {
        context.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale
        );
    }

    animateFrame() {
        this.framesElapsed++;

        if(this.framesElapsed % this.framesHold === 0){
            if(this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++;
            } else {
                this.framesCurrent = 0;
            }
        }
    }

    update() { // Atualizar cada velocidade do frame de cada personagem ou outro obj
        this.draw();
        this.animateFrame();
    }
}

class Fighter extends Sprite {
    constructor({
        position,
        velocity,
        color = 'red',
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = { x: 0, y: 0 },
        sprites
    }) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        });
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
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;
        this.sprites = sprites;
        
        for(const sprite in this.sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc;
        }
    }

    update() { // Atualizar cada velocidade do frame de cada personagem ou outro obj
        this.draw();
        this.animateFrame();
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