"use strict";

let canvas = document.querySelector('#canvas');
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;
let ctx = canvas.getContext('2d');

////////////////////////////// Setup
                            //
const LIMIT = 6;            // cant de figuras
const MIN_ZISE = 100;       // tamaño minimo de la fig
const MAX_ZISE = 150;       // tamaño maximo
const SELECTED_COLOR = 'rgba(37, 35, 44, 200)' // color figura seleccionada
let styleSelected;          // variable global que almacena el color del objeto seleccionado
let figuras = [];           // array de figuras


//////////////////////////// Main

function main() {

    // Crea las figuras y las guarda en un array
    createFigures()

    // Dibuja las figuras
    drawAllImages();

    // seleccion de figuras & funcion de drag & move
    selectFigure();

}

//////////////////////////// Crear figuras
function createFigures() {
    
    for (let index = 0; index < LIMIT; index++) {

        if((index % 2) == 0){
            let l1 = Math.floor(Math.random() * (MAX_ZISE - MIN_ZISE + 1) + MIN_ZISE);
            let l2 = Math.floor(Math.random() * (MAX_ZISE - MIN_ZISE + 1) + MIN_ZISE);

            let posX = Math.floor(Math.random() * (canvas.width  - l1 + 1)); // evita que parte de la figura este por fuera del canvas
            let posY = Math.floor(Math.random() * (canvas.height - l2 + 1));

            let rectangle = new Rectangulo(posX, posY, l1, l2, ctx);
            figuras.push(rectangle);

        }else{
            let r = Math.ceil((Math.floor(Math.random() * (MAX_ZISE - MIN_ZISE + 1) + MIN_ZISE))/2);

            let posX = Math.floor(Math.random() * (canvas.width  - 2 * r + 1) + r ); // evita que parte de la figura este por fuera del canvas
            let posY = Math.floor(Math.random() * (canvas.height - 2 * r + 1) + r );

            let circle = new Cicrulo(posX, posY, r, ctx);
            figuras.push(circle);
        }
    }
}

//////////////////////////// Dibujar figuras
function drawAllImages() {
    figuras.forEach(fig => {
        fig.draw();
 });
}

//////////////////////////// Select Figuras
function selectFigure(){
    canvas.addEventListener('mousedown', function (e) { // escucha clic down
        
        for (let index = 0; index < figuras.length; index++) { // si hay una figura seleccionada se desdelecciona
            if(figuras[index].isSelected())
                deselectFigura(index);
        }

        // check si el click se hizo sobre una figura
        let index = LIMIT-1;
        let selected = false;
        while(index >= 0 && !selected){ // recorre el array de figuras
            const figura = figuras[index];
            
            // verifica que el click se hizo dentro de la figura
            if (figura.estaElPunto((e).offsetX, (e).offsetY)){
                selectedFigura(index)
                               
                // agrega una escucha para el movimiento
                window.addEventListener('keydown', (e)=>{
                    moveFigure(e)
                });
                
                selected = true; // flag para cortar el while
            }
            index--;
        }
        drawAllImages();
    });
}

//////////////////////////// Des seleccionar figuras figuras
function deselectFigura(index){
    // aplica estilo original a la figura seleccionada
    figuras[index].setStyle(styleSelected);
    figuras[index].selected(false);
    // remueve el eventListener de la tecla
    window.removeEventListener('keydown', (e)=>{
        moveFigure(e)
    });
}

//////////////////////////// Operaciones sobre figura seleccinada
function selectedFigura(index){
    // la figura seleccionada pasa al frente (desde el punto de vista del array, al final)
    const aux = figuras[index];
    styleSelected = aux.getStyle();
    // aplica estilo oscuro a la figura y la marco como seleccionada
    aux.setStyle(SELECTED_COLOR);
    // indica como selected al objeto
    aux.selected(true);
    // lo ubica al final de array para que quede adelante al redibujar el canvas
    figuras.splice(index, 1);
    figuras.push(aux);
}

//////////////////////////// Mover figura con arrows keys
function moveFigure(e) {
    // limpiamos el lienzo
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    // asignamos las nuvas coordenadas a la fiugra seleccionada
    figuras.forEach(fig => {
        if(fig.isSelected()){
            let move = {x: 0, y: 0};
            // debugger;
            let figPos = fig.getPos();
            if (e.code === 'ArrowLeft') {
                move = { x: (figPos['x']-5), y: figPos['y']};    
                } else if (e.code === 'ArrowUp') {
                move = { x: figPos['x'], y: (figPos['y']-5)};                    
                } else if (e.code === 'ArrowRight') {
                move = { x: (figPos['x']+5), y: figPos['y']};                    
                } else if (e.code === 'ArrowDown') {
                move = { x: figPos['x'], y: (figPos['y']+5)};                    
                }

            fig.moveTo(move['x'], move['y']);
         }
    });
    // redibujamos el lienzo
    drawAllImages();
}
