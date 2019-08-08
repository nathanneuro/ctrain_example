'use strict';
var count = 0;
var angleX = 0, angleY = 0, angleZ = 0;

var setupComplete = false;
var rotXSlider, rotYSlider, rotZSlider, translateZSlider, noiseFactorSlider, runDrawBox, noiseStepSlider;

var w = 400;
var h = 400;
var scl = 4;
var cols = w / scl;
var rows = h / scl;

var runDraw = true;
var canv;
var drawStep = 0;
var terrain = [];

function setup() {
    
    runDrawBox = document.getElementById("runDraw");

    rotXSlider = document.getElementById("rotX");
    rotYSlider = document.getElementById("rotY");
    rotZSlider = document.getElementById("rotZ");
    translateZSlider = document.getElementById("translateZ");    
    noiseFactorSlider = document.getElementById("noiseFactor"); 
    noiseStepSlider = document.getElementById("noiseStep"); 

    canv = createCanvas(w - 20, h - 20, WEBGL);
    


    initTerrain(noiseFactorSlider.value);

    runDrawBox.oninput = function() {
        runDraw = runDrawBox.checked;
    }

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
    noiseFactorSlider.oninput = function() {
        document.getElementById("noiseFactorVal").innerHTML = noiseFactorSlider.value;
        initTerrain(noiseFactorSlider.value, noiseStepSlider.value);
    }
    noiseStepSlider.oninput = function() {
        document.getElementById("noiseStepVal").innerHTML = noiseStepSlider.value;
        initTerrain(noiseFactorSlider.value, noiseStepSlider.value);
    }
    
    setupComplete = true;
}

function initTerrain(noiseFactorVal, noiseStep, drawStep) {
    terrain = [];
    for (let x = 0; x < cols; x++) {
        terrain.push([]);
        for (let y = 0; y < cols; y++) {
            terrain[x].push(
                map(noise(x * noiseStep, (y + drawStep) * noiseStep), 0, 1, -1*noiseFactorVal, noiseFactorVal)
                );
        }
    }

}

function draw() {
    if (runDraw == true) {
        directionalLight(120, 120, 120, 0, 1, 0);
    
        background(51);
        angleX += rotXSlider.value * 0.005 ;
        angleY += rotYSlider.value * 0.005 ;
        angleZ += rotZSlider.value * 0.005 ;

        stroke(255);
        strokeWeight(0.25);
        noFill();

        translate(0, height/4);
        translate(-w/2, -h/2);
        rotateX(PI/3.5);
        // rotateX(angleX);
        // rotateY(angleY);
        // rotateZ(angleZ);

        drawStep -= 0.1;

        initTerrain(noiseFactorSlider.value, noiseStepSlider.value, drawStep);
        let minTerrain = 10000;
        let maxTerrain = -10000;

        for  (let y = 0; y < rows-1; y++) {
            beginShape(TRIANGLE_STRIP);
            for (let x = 0; x < cols; x++){
                vertex(x*scl, y*scl, terrain[x][y]);
                minTerrain = min(minTerrain, terrain[x][y]);
                maxTerrain = max(maxTerrain, terrain[x][y]);
                stroke(0,map(terrain[x][y], maxTerrain, minTerrain, 30, 255),1);
                vertex(x*scl, (y+1)*scl, terrain[x][y+1]);

                // rect(x*scl, y*scl, scl, scl);
            }
            endShape();
        }

    }
}

