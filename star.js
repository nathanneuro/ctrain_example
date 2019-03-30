// stars

function Star(loft) {
    this.begin = createVector(width/2.0 + 20, height - 20);
    this.end = createVector(random(0,width), height - loft);
    
    
    this.move = function() {
        
        translate(this.begin.x, this.begin.y);
        this.end.rotate(0.002);
        
        
    }


    this.show = function() {
        strokeWeight(random(1,10)/9.0);
        fill(255, 255, 0);
        ellipse(this.end.x, this.end.y, 1,1);
    }


}