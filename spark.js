// spark

class Spark {

    constructor(startX, startY) {
        this.position = createVector(startX, height - startY);
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(0.5, 1.5));
        this.acceleration = createVector();
    }

    
    move() {
        
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        
        
    }


    show() {

        
        fill(255, 255, 0);
        ellipse(this.position.x, this.position.y, 1,1);
 
    }


}