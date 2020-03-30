console.log('hello world');

var setupComplete = false;
var runDrawBox, diffASlider, diffBSlider, diffCSlider, feedSlider, removeBSlider, removeCSlider;
var canv;
var grid;
var next_grid;
var runDraw = true;
var counter = 0;


function setup() {
    runDrawBox = document.getElementById("runDraw");
    diffASlider = document.getElementById("diffA");
    diffBSlider = document.getElementById("diffB");
    diffCSlider = document.getElementById("diffC");
    feedSlider = document.getElementById("feed");
    removeBSlider = document.getElementById("removeB");
    removeCSlider = document.getElementById("removeC");
    canv = createCanvas(200, 200);
    pixelDensity(1);

    runDrawBox.oninput = function() {
        runDraw = runDrawBox.checked;
    }
    diffASlider.oninput = function() {
        document.getElementById("diffAVal").innerHTML = diffASlider.value;
    }
    diffBSlider.oninput = function() {
        document.getElementById("diffBVal").innerHTML = diffBSlider.value;
    }
    diffCSlider.oninput = function() {
        document.getElementById("diffCVal").innerHTML = diffCSlider.value;
    }
    feedSlider.oninput = function() {
        document.getElementById("feedVal").innerHTML = feedSlider.value;
    }
    removeBSlider.oninput = function() {
        document.getElementById("removeBval").innerHTML = removeBSlider.value;
    }
    removeCSlider.oninput = function() {
        document.getElementById("removeCval").innerHTML = removeCSlider.value;
    }


    grid = [];
    next_grid = [];
    let sumA = 0;
    let sumB = 0;

    for (let x = 0; x < width; x++) {
        grid[x] = [];
        next_grid[x] = [];
        for (let y = 0; y < height; y++) {
            grid[x][y] = {'a':1, 'b':0, 'c':0}
            next_grid[x][y] = {'a':1, 'b':0, 'c':0}
            sumA += next_grid[x][y].a;
            sumB += next_grid[x][y].b;
        }

    }
    console.log('sumA', sumA, 'sumB', sumB);

    let startSize = 10;
    let startWidth = floor(width/2) - floor(startSize/2);
    let startHeight = floor(height/2) - floor(startSize/2);
    for(let j = 0; j < startSize; j++) {
        for(let k = 0; k < startSize; k++) {
            grid[j + startWidth][k + startHeight].b = 1.0;
        }
    }

    // canv.mousePressed(mouseResponse);
    setupComplete = true;
}


function mouseResponse() {

// add some component A to this spot?

}



function draw() {
    if (runDraw == false) {
        noLoop();
    }
    counter += 1;
    if (counter % 1 == 0) {
        background(51);
        loadPixels();

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                var pix = (x + y * width) * 4;
                let a = grid[x][y].a;
                let b = grid[x][y].b;
                let c = grid[x][y].c;
                let color1 = floor((a - b) * 255);
                let color2 = floor((b - c) * 255);
                color1 = constrain(color1, 0, 255);
                color2 = constrain(color2, 0, 255);
                pixels[pix + 0] =  color1;
                pixels[pix + 1] = color2;
                pixels[pix + 2] = color1;
                pixels[pix + 3] = 255;
            }
        }

        let dA = float(diffASlider.value);
        let dB = float(diffBSlider.value);
        let dC = float(diffCSlider.value);
        let feed = float(feedSlider.value);
        let kB = float(removeBSlider.value);
        let kC = float(removeCSlider.value);
        let sumA = 0;
        let sumB = 0;
        for (let x = 1; x < width - 1; x++) {
            for (let y = 1; y < height - 1; y++) {
                let a = grid[x][y].a
                let b = grid[x][y].b
                let c = grid[x][y].c

                next_grid[x][y].a = constrain(
                        a +
                        dA * laplace(grid, x, y, 'a') -
                        a * b * b +
                        feed * (1 - a),
                    0, 1
                );

                next_grid[x][y].b = constrain(
                        b +
                        dB * laplace(grid, x, y, 'b') +
                        a * b * b -
                        (kB + feed) * b,
                    0, 1
                );

                // console.log('nan in b', next_grid[x][y].b);
                // console.log('b', b, 'kB', kB, 'feed', feed);
                // console.log('a*b*b', (a * b * b));
                // console.log('dB', dB, "laplace(grid, x, y, 'b')", laplace(grid, x, y, 'b'));
                // console.log('a', a, 'next a', next_grid[x][y].a);
                // console.log('part 1', (b + dB * laplace(grid, x, y, 'b')));
                // console.log('part 2', (a * b * b - (kB + feed) * b));
                // runDraw = false;


                next_grid[x][y].c = (
                    c +
                    dC * laplace(grid, x, y, 'c') * c +
                    b * c * c -
                    (kC - feed) * c
                );
                sumA += next_grid[x][y].a;
                sumB += next_grid[x][y].b;
            }
        }
        // console.log('sumA', sumA, 'sumB', sumB);
        grid = next_grid;

        updatePixels();
    }
}

function laplace(grid, x, y, name) {
    let sum = 0;
    sum += grid[x][y][name] * -1;
    sum += grid[x-1][y][name] * 0.2;
    sum += grid[x+1][y][name] * 0.2;
    sum += grid[x][y-1][name] * 0.2;
    sum += grid[x][y+1][name] * 0.2;
    sum += grid[x-1][y-1][name] * 0.05;
    sum += grid[x+1][y+1][name] * 0.05;
    sum += grid[x-1][y+1][name] * 0.05;
    sum += grid[x+1][y-1][name] * 0.05;

    return sum
}