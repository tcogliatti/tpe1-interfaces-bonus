//
// Figura.js
//

class Figura 
{
    constructor(posX, posY, ctx) {
        this.posX = posX;
        this.posY = posY;
        this.ctx = ctx;
        this.clicked = false;
        this.style = this.randomRGBA();
    }

    draw() {
        // nothing to do - abstract method
    }

    moveTo(posX, posY) {
        this.posX = posX;
        this.posY = posY;
    }

    getPos() {
        return {x: this.posX, y: this.posY};
    }

    selected(clic) {
        this.clicked = clic;
    }

    isSelected() {
        return this.clicked;
    }

    estaElPunto(mX, mY) {

        // nothing to do - abstract method

        return null; 
    }

    fill() {
        ctx.fillStyle = this.style;
        ctx.fill();
    }

    randomRGBA() {
        let r = Math.round(Math.random() * 255);
        let g = Math.round(Math.random() * 255);
        let b = Math.round(Math.random() * 255);
        let a = 255;
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }
    
}