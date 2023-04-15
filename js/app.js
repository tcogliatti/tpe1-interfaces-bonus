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
/* 
    este procedimiento instancia las figuras y las almacena en un array
    los indices pares crearan Rectangulo
    los impares instanciarán Circulos
*/ 
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
/*
    procedimiento que itera el arrray de figuras e
    invoca el método draw() en cada una para que se
    pinten en el canvas
*/
function drawAllImages() {
    figuras.forEach(fig => {
        fig.draw();
 });
}

//////////////////////////// Select Figuras
/*
    este procedimiento es el encargado de añadir un evento de tipo 
    "mousedown" al canvas. Cada vez que sea clic este evento va a:
        1. Desdeleccionar las figuras seleccionadas
        2. Verificar si el clic fue hecho sobre una figura invocando el método estaElPunto()
        3. El array se itera con un while, de atras hacia adelante para que tome como prioridad del click
           la figura que esta más arriba
        4. si existe una figura seleccionada llama al procedimiento slectedFigura() y le pasa el indicie
        5. luego añade el evento "keydown" para poder mover la figura con las teclas cursos
        6. Redibujar el canvas
*/ 
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
/*
    recibe parametro de tipo entero que es el indice del array de la figura seleccioada:
        1. deselecciona
        2. aplica estilo original
        3. remueve evento de escucha "keydown"
*/
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
/*
    recibe parametro de tipo entero que es el indice del array de la figura seleccioada, 
    enviado desde selectFigure():
        1. marca al figura como seleccionada invocando al metodo selected(true)
        2. ordena la fura seleccionada al final del array para que al redibujar el canvas
           esta quede sobre las demas
        3. giuarda su estilo original
        4. le aplia un estilo particula de figura seleccionada
*/
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
/*
    recibe como parametro el evento "keydown":
        1. borra el canvas
        2. verifica que el evento sea una arrow key
        3. calcula coordenadas segun la tcla presionada
        4. aplica coordenadas a la figura seleccionada
        5. redibuja el canvas
*/
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
