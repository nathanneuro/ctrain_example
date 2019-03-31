//tree
'use strict';
var tree = [];
var leaves = [];
var stars = [];
var flock = [];
var count = 0;
var angleX = 0, angleY = 0, angleZ = 0;
var cycle1 = 0;
var cycle1Dir = '';
var maxCycle1 = 100;
var cycle2 = 0;
var maxTracers = 5;
var blender = 0.0;
// var startMilliseconds = now.getMilliseconds();
var cycleCount = 0;
var r,b,g,a;
var numSpheres = 4;
var setupComplete = false;
var rotXSlider, rotYSlider, rotZSlider, translateZSlider, numBoxesSlider;


function addStars(numStars){
    if (stars.length < 500) {
        for (let i = 0; i < numStars; i++) {
            stars.push(new Star(random(60,600)));
        }
    }   
}

function addBoids(numBoids){
    if (flock.length <= 100) {
        for (let i = 0; i < numBoids; i++) {
            flock.push( new Boid(random(width/2 -5, width/2 + 5), height/2) );
            //
        }
    } 
}


var canv;

function setup() {
    
    rotXSlider = document.getElementById("rotX");
    rotYSlider = document.getElementById("rotY");
    rotZSlider = document.getElementById("rotZ");
    translateZSlider = document.getElementById("translateZ");    
    numBoxesSlider = document.getElementById("numBoxes"); 
    // angleSlider = document.getElementById("angle"); 
    canv = createCanvas(600, 600, WEBGL);
    
    

    // addBoids(20);

    rotXSlider.oninput = function() {
        document.getElementById("rotXVal").innerHTML = rotXSlider.value;
    }
    rotYSlider.oninput = function() {
        document.getElementById("rotYVal").innerHTML = rotYSlider.value;
    }
    rotZSlider.oninput = function() {
        document.getElementById("rotZVal").innerHTML = rotZSlider.value;
    }
    translateZSlider.oninput = function() {
        document.getElementById("translateZVal").innerHTML = translateZSlider.value;
    }
    numBoxesSlider.oninput = function() {
        document.getElementById("numBoxesVal").innerHTML = numBoxesSlider.value;
    }
    // homingSlider.oninput = function() {
    //     document.getElementById("homingVal").innerHTML = homingSlider.value;
    // }
    // angleSlider.oninput = function() {
    //     document.getElementById("angleVal").innerHTML = angleSlider.value;
    //     angle = parseFloat(angleSlider.value);
    // }

    // canv.mousePressed(mouseResponse);
    setupComplete = true;
}




function mouseResponse() {
    
    if (setupComplete) {
        addStars(5);
        addBoids(3);

        if (count < 6) {
        for (var i = tree.length - 1; i >= 0; i--) {
            if (!tree[i].finished) {
                tree.push(tree[i].branchA());
                tree.push(tree[i].branchB());  
                
            }  
        } 
        }
        count++;
        if (count == 6) {
            for (var i = 0; i < tree.length; i++) {
                if(!tree[i].finished) {
                    var leaf = tree[i].end.copy();
                    leaves.push(leaf);
                }
            }
        }

        for (let i = 0; i < flock.length; i++) {
            let perceptionRadius = 100;
            let distance = dist(flock[i].position.x, flock[i].position.y, mouseX, mouseY);
            if (distance < perceptionRadius) {
                flock[i].fleeing = true;
                flock[i].target = createVector(mouseX, mouseY);
            }
        }
    }
}

function drawBoxes() {
    push();
    noFill();
    strokeWeight(1);
    stroke(255);
    
    translate(0, 0, translateZSlider.value);
    rotateX(angleX );
    rotateY(angleY );
    rotateZ(angleZ );
    box(200);
    

    // for (var i = 0; i < stars.length; i++) {
    //     push();
    //     stars[i].move();
    //     stars[i].show();
    //     pop();
    // }

    // for (var i = 0; i < flock.length; i++) {
    //     stroke(200);
    //     strokeWeight(2);
    //     fill(255, 1, 1);
    //     flock[i].makeDecision(flock, tree);
    //     flock[i].move();
    //     flock[i].edges();
    //     flock[i].show();
        
    // }


    // tracer boxes
    let offsetIncrement = 0.000001 + (cycle1 * 0.000001);
    let tracerOffset = 0.000001 + (cycle1 * 0.000001);
    // let tracerOffset = 0.0;
    
    for (let i = 0; i < numBoxesSlider.value; i++){
        
        strokeWeight(0.9);
        stroke(r, b, g);
        noFill();
        translate(0, 0, translateZSlider.value);
        rotateX(angleX - tracerOffset);
        rotateY(angleY - tracerOffset);
        rotateZ(angleZ - tracerOffset);
        box(200);
        tracerOffset += offsetIncrement;
        
    }
    pop();
}

function changeColors() {
    let tracerOffset = 0.000001 + (cycle1 * 0.000001);
    let offsetIncrement = 0.000001 + (cycle1 * 0.000001);
    blender = random() * 80;
    r = 30;
    b = 30;
    g = 30;
    r = map(tracerOffset, offsetIncrement * 2, offsetIncrement * maxTracers * 3, 255, 20);
    g = map(tracerOffset, offsetIncrement * 2, offsetIncrement * maxTracers * 3, blender, 20);

    // if (cycle2 % 3 == 0) {
    //     r = map(tracerOffset, offsetIncrement * 2, offsetIncrement * maxTracers * 3, 255, 20);
    //     g = map(tracerOffset, offsetIncrement * 2, offsetIncrement * maxTracers * 3, blender, 20);
    // } else if ( cycle2 % 3 == 1) {
    //     b = map(tracerOffset, offsetIncrement * 2, offsetIncrement * maxTracers * 3, 255, 20);
    //     r = map(tracerOffset, offsetIncrement * 2, offsetIncrement * maxTracers * 3, blender, 20);
    // } else if ( cycle2 % 3 == 2){
    //     g = map(tracerOffset, offsetIncrement * 2, offsetIncrement * maxTracers * 3, 255, 20);
    //     b = map(tracerOffset, offsetIncrement * 2, offsetIncrement * maxTracers * 3, blender, 20);
    // }
}

function drawSpheres() {
    push();
    noStroke();
    ambientMaterial(240);
    // for (let i = 0; i < numSpheres; i++) {
    // let xPos = width * 0.25;
    // let yPos = height * -0.25;
    let xPos = 0;
    let yPos = 0;
    if (cycle1 == 0) {
        console.log(xPos, yPos);
    }
    push();
    translate(xPos, yPos, 0);
    sphere(20);
    pop();

    xPos = width * 0.25;
    yPos = height * -0.25;
    // xPos = 0;
    // yPos = 0;
    if (cycle1 == 0) {
        console.log(xPos, yPos);
    }
    push();
    translate(xPos, yPos, 0);
    sphere(10);
    pop();

    xPos = width * -0.25;
    yPos = height * 0.25;
    if (cycle1 == 0) {
        console.log(xPos, yPos);
    }
    push();
    translate(xPos, yPos, 0);
    sphere(10);
    pop();
    // }
    pop();
}

function draw() {

    // if (angleX == 0 & angleY == 0 & angleZ == 0) {
    //     console.log('0 angle', (now.getMilliseconds() - startMilliseconds)/1000.0);
    // }
    directionalLight(120,120,120, 0,1,0);
    
    
    background(51);
    
    angleX += rotXSlider.value * 0.005 ;
    angleY += rotYSlider.value * 0.005 ;
    angleZ += rotZSlider.value * 0.005 ;

    drawSpheres();
    

    // if (cycle1Dir == 'up') {

    // } else {
    //     angleX -= rotXSlider.value * 0.01 ;
    //     angleY -= rotYSlider.value * 0.01 ;
    //     angleZ -= rotZSlider.value * 0.01 ;
    // }

//     * (cycle1 * 0.1)
// * (cycle1 * 0.1)
// * (cycle1 * 0.1)
// * (cycle1 * 0.1)
// * (cycle1 * 0.1)
// * (cycle1 * 0.1)

    if (cycle1 <= 0 ) {
        cycle1Dir = 'up';
        cycleCount += 1;
        changeColors();
        if (cycleCount % 2 == 1) {
            cycle2 += 1;
        }
    } else if (cycle1 >= maxCycle1) {
        cycle1Dir = 'down';
    }


    if (cycle1Dir == 'up') {
        cycle1 = cycle1 + 1;
        
    } 

    if (cycle1Dir == 'down') {
        cycle1 = cycle1 - 1;
    }

    
    drawBoxes();
    
    
}

