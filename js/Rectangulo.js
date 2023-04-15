//
//  Rectangulo.js
//

class Rectangulo extends Figura
{
    constructor(posX, posY, l1, l2, ctx, clic)
    {
        super(posX, posY, ctx, clic);
        this.l1 = l1;
        this.l2 = l2;
    }

    draw()
    {
        this.ctx.beginPath();
        this.ctx.rect(this.posX, this.posY, this.l1, this.l2);
        this.fill();
    }

    estaElPunto(mX, mY){
        let lado1 = this.posX + this.l1;
        let lado2 = this.posY + this.l2;

        if (mX >= this.posX && mX <= lado1 && mY >= this.posY && mY <= lado2){
                return true
        }
        return false; 
    }

}