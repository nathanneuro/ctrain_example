//tree
'use strict';
var tree = [];
var leaves = [];
var stars = [];
var flock = [];
var count = 0;
var angle = 35;

var setupComplete = false;
var alignSlider, cohesionSlider, seperationSlider, maxForceSlider, angleSlider, homingSlider;

  


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
    alignSlider = document.getElementById("alignment");
    cohesionSlider = document.getElementById("cohesion");
    seperationSlider = document.getElementById("seperation");
    maxForceSlider = document.getElementById("maxForce");    
    homingSlider = document.getElementById("homing"); 
    angleSlider = document.getElementById("angle"); 
    canv = createCanvas(600, 600);

    var a = createVector(width/2, height);
    var b = createVector(width/2, height - 100);
    let root = new Branch(a,b);
    
    tree[0] = root;
    

    addBoids(20);

    alignSlider.oninput = function() {
        document.getElementById("alignmentVal").innerHTML = alignSlider.value;
    }
    cohesionSlider.oninput = function() {
        document.getElementById("cohesionVal").innerHTML = cohesionSlider.value;
    }
    seperationSlider.oninput = function() {
        document.getElementById("seperationVal").innerHTML = seperationSlider.value;
    }
    maxForceSlider.oninput = function() {
        document.getElementById("maxForceVal").innerHTML = maxForceSlider.value;
    }
    homingSlider.oninput = function() {
        document.getElementById("homingVal").innerHTML = homingSlider.value;
    }
    angleSlider.oninput = function() {
        document.getElementById("angleVal").innerHTML = angleSlider.value;
        angle = parseFloat(angleSlider.value);
    }

    canv.mousePressed(mouseResponse);
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

function draw() {
    background(51);
    strokeWeight(0.8);
    stroke(255);

    for (var i = 0; i <tree.length; i++) {
        tree[i].show();
        // tree[i].jitter(); 

    }
    
    for (var i = 0; i <leaves.length; i++) {
        fill(0,0,0);
        ellipse(leaves[i].x, leaves[i].y, 2, 8);
        //tree[i].jitter();
        
    }

    for (var i = 0; i < stars.length; i++) {
        push();
        stars[i].move();
        stars[i].show();
        pop();
    }

    for (var i = 0; i < flock.length; i++) {
        stroke(200);
        strokeWeight(2);
        fill(255, 1, 1);
        flock[i].makeDecision(flock, tree);
        flock[i].move();
        flock[i].edges();
        flock[i].show();
        
    }

}

