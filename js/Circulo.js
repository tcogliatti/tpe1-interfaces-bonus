//
// Cicrulo.js
//

class Cicrulo extends Figura
{
    constructor(posX, posY, rad, ctx, clic)
    {
        super(posX, posY, ctx, clic);
        this.r = rad;
    }

    draw() {

        ctx.beginPath();
        ctx.arc(this.posX, this.posY, this.r,0,(Math.PI/180)*360);
        this.fill();
    }

    estaElPunto(mX, mY){
        let c1 = Math.abs( mX - this.posX );
        let c2 = Math.abs( mY - this.posY );
        let gap = Math.sqrt( Math.pow(c1, 2) + Math.pow(c2, 2) );
        if(gap <= this.r)
            return true
        return false; 
    }

}