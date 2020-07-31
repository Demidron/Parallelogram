var stack = [];
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var S;
var center;
var selectedPointIndex=null;
//param
var radiusCircle=11;

(function() {

    window.addEventListener('resize', resizeCanvas, false);
    
    function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            drawFigures(stack);
    }
    resizeCanvas();
    
})();

canvas.addEventListener('mousemove', function(evt){
    if(selectedPointIndex!=null){
        let pos=getMousePos(canvas,evt);
        stack[selectedPointIndex]=pos;
        drawFigures(stack);
    }
    updateInfo(evt)
}, false);
function updateInfo(evt){
    var mousePos = getMousePos(canvas, evt);
    var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
    writeMessage(canvas, message);
}
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
function writeMessage(canvas, message) {
    
    let str =message;
    for (let i = 0; i < stack.length; i++) {
      
        str += '<br>' + String.fromCharCode(65+i)+": "+ stack[i].x+" "+ stack[i].y;
    }
    stack.forEach(element => {
        
        
    });
    str += S? "<br>S: "+S :" ";
    document.getElementById('info').innerHTML=str;
   
    // context.font = '10pt Calibri';
    // context.fillStyle = 'black';
    // context.fillText(message, 10, 25);
}
canvas.addEventListener('mousedown', function(evt) {
    let pos=getMousePos(canvas,evt)
    for (let index = 0; index < stack.length; index++) {
        if(Math.pow(pos.x-stack[index].x,2)+Math.pow(pos.y-stack[index].y,2) <= Math.pow(radiusCircle,2)){
            selectedPointIndex=index;
        }
    }
});
canvas.addEventListener('mouseup', function(evt) {
    let pos=getMousePos(canvas,evt)

    if(selectedPointIndex!=null){
        stack[selectedPointIndex]=pos;
        calcOppositePoint(selectedPointIndex);
        drawFigures(stack);
        selectedPointIndex=null;
    } else{
        if(stack.length<4){stack.push(pos);}
        if(stack.length==3){ calcOppositePoint(1);}
            
        drawFigures(stack);
        updateInfo(pos);
    }  
 
});

function drawFigures(stack) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    stack.forEach(element => {
        drawCircle(element);
    });
  
    if(stack.length<3){
        return;
    }

    let ab={x:(stack[1].x-stack[0].x), y:(stack[1].y-stack[0].y)};
    let ac={x:(stack[2].x-stack[0].x), y:(stack[2].y-stack[0].y)};
    S= Math.abs((ab.x*ac.y)-(ac.x*ab.y));//Math.PI
    context.beginPath();
    context.strokeStyle = "blue";
    context.moveTo(stack[0].x,stack[0].y);
    context.lineTo(stack[1].x,stack[1].y);
    context.lineTo(stack[2].x,stack[2].y);
    context.lineTo(stack[3].x,stack[3].y);
    context.closePath();
    context.stroke();
    context.beginPath();
    context.strokeStyle = "yellow";
    let sCircle=Math.sqrt(S/Math.PI);
    context.arc(center.x,center.y,sCircle,0,Math.PI*2,true);
    context.closePath();
    context.stroke();
  }

function drawCircle(position){
    context.beginPath();
    context.strokeStyle = "red";
    context.arc(position.x,position.y,radiusCircle,0,Math.PI*2,true);
    context.stroke();
}


function calcOppositePoint(pointIndex){
    if(stack.length<3||pointIndex>3){
        return;
    }

    let point;
    if(!stack[(pointIndex+3)%4]||!stack[(pointIndex+1)%4]){return;}
    center={x:(stack[(pointIndex+3)%4].x+stack[(pointIndex+1)%4].x)/2,
         y:(stack[(pointIndex+3)%4].y+stack[(pointIndex+1)%4].y)/2};
    point={x:( center.x*2)-stack[pointIndex].x, y:(center.y*2)-stack[pointIndex].y};
    stack[(pointIndex+2)%4]=point;
}
function onReset(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    stack=[];
    S=null;
}
function onAbout(){
    result = confirm( `Оберіть точки на екрані.\nПісля третьої точки побудуется паралелограм та коло.
Точки довільно можна пересувати. \nreset для сбросу.\nРоботу виконав Демидюк Андрій Юрійович`);
}