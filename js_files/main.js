//when the R pressed game restart
document.addEventListener('keyup', function(e){
  if(e.keyCode == 82){
    window.location.reload();}
})
//when Q pressed game quite
document.addEventListener('keyup', function(e){
  if(e.keyCode == 81){
    if (confirm("do you want to quit the game?")){
    window.close();}}
})
window.addEventListener("keydown", getKey, false);
window.addEventListener("click",clickMouse,false);
var canvas;
var gl;
var vColor;
var vBuffer;
var cBuffer;
var green = vec4(0.51, 0.68, 0.60, 0.9);
var red = vec4(0.99, 0.26, 0.39, 0.9);
var vPosition;
//  
var dx=0.002
var dy = 0.0015
var dir = [[1,-1,1,-1],[-1,1,-1,1]];
//
var alien = [
    [vec2 (-0.90, 0.95),vec2 (-0.80, 0.95), vec2 (-0.80, 0.80), vec2 (-0.90, 0.95), vec2 (-0.80, 0.80), vec2 (-0.90, 0.80),
    vec2 (-0.40, 0.95),vec2 (-0.30, 0.95), vec2 (-0.30, 0.80), vec2 (-0.40, 0.95), vec2 (-0.30, 0.80), vec2 (-0.40, 0.80),
    vec2 (0.00, 0.95),vec2 (0.10, 0.95), vec2 (0.10, 0.80), vec2 (0.00, 0.95), vec2 (0.10, 0.80), vec2 (0.00, 0.80),
    vec2 (0.50, 0.95),vec2 (0.60, 0.95), vec2 (0.60, 0.80), vec2 (0.50, 0.95), vec2 (0.60, 0.80), vec2 (0.50, 0.80)],
    [vec2 (-0.90, 0.75),vec2 (-0.80, 0.75), vec2 (-0.80, 0.60), vec2 (-0.90, 0.75), vec2 (-0.80, 0.60), vec2 (-0.90, 0.60),
    vec2 (-0.40, 0.75),vec2 (-0.30, 0.75), vec2 (-0.30, 0.60), vec2 (-0.40, 0.75), vec2 (-0.30, 0.60), vec2 (-0.40, 0.60),
    vec2 (0.00, 0.75),vec2 (0.10, 0.75), vec2 (0.10, 0.60), vec2 (0.00, 0.75), vec2 (0.10, 0.60), vec2 (0.00, 0.60),
    vec2 (0.50, 0.75),vec2 (0.60, 0.75), vec2 (0.60, 0.60), vec2 (0.50, 0.75), vec2 (0.60, 0.60), vec2 (0.50, 0.60)]
];
var alienColor=[ [
        red, red, red, red, red, red,
        red, red, red, red, red, red,
        red, red, red, red, red, red,
        red, red, red, red, red, red
    ],
    [
        red, red, red, red, red, red,
        red, red, red, red, red, red,
        red, red, red, red, red, red,
        red, red, red, red, red, red
    ]]
var bulletsColor=[];
var canonBulletsColor=[];
var canon=[
vec2( -0.05, -0.80),vec2( 0.05, -0.80), vec2( 0.05, -0.95 ), vec2( -0.05, -0.80), vec2( 0.05, -0.95 ), vec2( -0.05, -0.95)
];
var canonColor=[green,green,green,green,green,green]
var bullets=[]
var canonBullets=[]


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.97, 0.80, 0.67, 1.0 );

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    
    vBuffer = gl.createBuffer();
    cBuffer=gl.createBuffer();
    
    // Associate out shader variables with our data buffer
    vPosition = gl.getAttribLocation( program, "vPosition" );
    vColor = gl.getAttribLocation( program, "vColor");

    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition ); 
    changeDir();   
    render();
};
var pressed = 0; 
function getKey(key) {
    if (key.key == "ArrowLeft") {
        pressed = 1;
    }
    if (key.key == "ArrowRight") {
        pressed = 2;
    }
}
var clicked = 0; 
function clickMouse(key) {
    clicked = 1;
}
function updateAlien(){
    for(var row=0; row<alien.length;row++){
    for(var i = 0; i<alien[row].length/6; i++){
        for(var j = 0; j<6;j++){
            alien[row][6*i+j]=vec2(alien[row][i*6+j][0]+dir[row][i]*dx, alien[row][i*6+j][1]-dy);
        }
        if (alien[row][i*6][0]<=-1 || alien[row][i*6+1][0]>=1){
            dir[row][i]=-1*dir[row][i];
        }
        if (i>0){
            if (alien[row][i*6][0]<=alien[row][(i-1)*6+1][0]){
                dir[row][i]=-1*dir[row][i]
                dir[row][i-1]=-1*dir[row][i-1]
            }
        }
        if(alien[row][i+5][1]<=-1){
            if(confirm('You lose! during the game you can restart any time by press"R". click "ok" to restart. "cancel" to quit. ')){
            window.location.reload(); }
            else{
                window.close();
            } 
            
        }
    }
}
    if(alien[0].length==0 && alien[1].length==0){
        if(confirm('You win! during the game you can restart any time by press"R". click "ok" to restart. "cancel" to quit. ')){
            window.location.reload(); }
            else{
                window.close();
            } 
    }
}
function hitAlien(){
    loop1:
    for (var each=0; each<canonBullets.length/3;each++){
    loop2:
        for(var row=0; row<alien.length;row++){
    loop3:
            for(var i=0;i<alien[row].length/6;i++){
                edgeLeft=alien[row][i*6+5][0]
                edgeRight=alien[row][i*6+4][0]
                edgeTop=alien[row][i*6][1]
                edgeBottom=alien[row][i*6+5][1]
                if(canonBullets[each*3+2][0]<edgeRight && 
                    canonBullets[each*3+2][0]>edgeLeft && 
                    canonBullets[each*3+2][1]>edgeBottom&&
                    canonBullets[each*3+2][1]<edgeTop){
                    alien[row].splice(i*6,6)
                    dir[row].splice(i,1)
                    alienColor[row].splice(i*6,6)
                    canonBullets.splice(each*3,3)
                    canonBulletsColor.splice(each*3,3)
                    break loop1
                }
            }
        }
    }
}
function updateCanonShoot(){
    canonShoot()
   for(var i=0;i<canonBullets.length/3;i++){
        for(var j=0;j<3; j++) {
            canonBullets[3*i+j]=vec2(canonBullets[3*i+j][0],canonBullets[3*i+j][1]+0.05);
        }
        if(canonBullets[3*i][1]>= 1){
                canonBullets.splice(3*i,3)
                canonBulletsColor.splice(3*i,3)
            } 
}
}
//this is the bullet shoot out by allien
function updateBullet(){
    if(bullets.length==0){
        shoot()
    }
    for(var i=0;i<bullets.length/3;i++){
        for(var j=0;j<3; j++) {
            bullets[3*i+j]=vec2(bullets[3*i+j][0],bullets[3*i+j][1]-0.005);
        }
        edgeRight=canon[1][0]+0.005
        edgeLeft=canon[0][0]-0.005
        if(bullets[i*3+2][0]< edgeRight && bullets[i*3+2][0]>edgeLeft && bullets[i*3+2][1]<canon[0][1]){
           if(confirm('You lose! during the game you can restart any time by press"R". click "ok" to restart. "cancel" to quit. ')){
            window.location.reload(); }
            else{
                window.close();
            } 
        }
        if(bullets[2][1]<=-1){
            bullets=[]
            bulletsColor=[]
    }
}}
function shoot(){
    for(var i=0; i<alien[1].length/6;i++){
        bullets.push(vec2(alien[1][6*i+5][0]+0.040,alien[1][6*i+5][1]))
        bullets.push(vec2(alien[1][6*i+4][0]-0.040,alien[1][6*i+4][1]))
        bullets.push(vec2(alien[1][6*i+5][0]+0.050,alien[1][6*i+5][1]-0.05))
        bulletsColor.push(red)
        bulletsColor.push(red)
        bulletsColor.push(red)
    }
    if (alien[1].length==0){
        for(var i=0; i<alien[0].length/6;i++){
        bullets.push(vec2(alien[0][6*i+5][0]+0.040,alien[0][6*i+5][1]))
        bullets.push(vec2(alien[0][6*i+4][0]-0.040,alien[0][6*i+4][1]))
        bullets.push(vec2(alien[0][6*i+5][0]+0.050,alien[0][6*i+5][1]-0.05))
        bulletsColor.push(red)
        bulletsColor.push(red)
        bulletsColor.push(red)
    }}
}
function updateCanon(){
    if (pressed===1){
        if(canon[0][0]>-1){
        for(var i=0; i<6;i++){
            canon[i]=vec2(canon[i][0]-0.05,canon[i][1])
        }
    }
        pressed=0;

    }
    if (pressed===2){
        if(canon[1][0]<1){
        for(var i=0; i<6;i++){
            canon[i]=vec2(canon[i][0]+0.05,canon[i][1])
        }
        }
        pressed=0;
    }
}
function canonShoot(){
    if(clicked==1){
        canonBullets.push(vec2(canon[0][0]+0.040,canon[0][1]))
        canonBullets.push(vec2(canon[1][0]-0.040,canon[0][1]))
        canonBullets.push(vec2(canon[0][0]+0.050,canon[0][1]+0.05))
        canonBulletsColor.push(green)
        canonBulletsColor.push(green)
        canonBulletsColor.push(green)
    }
    clicked=0
}
function changeDir(){
    setTimeout(function(){
        for(var i=0; i<dir.length; i++){
            for(var j=0;j<dir[i].length;j++){
            if(Math.random()<0.5){
                dir[i][j]=1;
            }else{
                dir[i][j]=-1;
            }
        }
        }
        changeDir();
    },600)
}
//this function will make the allien move faster and faster.
function speed(){
    setTimeout(function(){
        dx=dx+0.00001
    },600)
}
function display(vertexlst,colorlst){
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexlst), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorlst), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);
    gl.drawArrays(gl.TRIANGLES, 0, vertexlst.length,6); 
}
function render() {
    hitAlien()
    updateCanon()
    updateAlien()
    updateBullet()
    updateCanonShoot()
    speed()
    gl.clear( gl.COLOR_BUFFER_BIT ); 
    for(var i=0;i<alien.length;i++){
        display(alien[i],alienColor[i])
    }
    display(canon,canonColor)
    display(bullets,bulletsColor)
    display(canonBullets,canonBulletsColor)
    window.requestAnimFrame(render);
}
