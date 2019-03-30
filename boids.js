// boids

class Boid {

    constructor(startX, startY) {
        this.position = createVector(startX, height - startY);
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(-1, 1));
        this.acceleration = createVector();
        this.maxForce = 0.1;
        this.maxSpeed = 1.5;
        this.minSpeed = 0.2;
        this.perched = false;
        this.landing = false;
        this.fleeing = false;
        this.undisturbedFlightTime = 0;
        this.fleeingTime = 0;
        this.target = createVector(0, 0);
        this.destination = createVector(0, 0);
    }

    align(boids){
        let perceptionRadius = 60;
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (other != this && d < perceptionRadius) {
                steering.add(other.velocity);
                total++;
            }
        }
        if (total > 0) {
            steering.div(boids.length);

            // desired - velocity

            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    homing(){
        let homeRadius = (width/2) * 0.75;
        let homeXY = createVector(width/2, height/2);
        let steering = createVector();
        let distXY = dist(this.position.x, this.position.y, homeXY.x, homeXY.y);

        steering.add(homeXY);
        steering.sub(this.position);
        steering.setMag(this.maxSpeed * (max(distXY - homeRadius, 0 ) /(2 * homeRadius) ) );
        steering.limit(this.maxForce);
        return steering;
    }

    cohesion(boids){
        let perceptionRadius = 80;
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
            let d = dist(this.position.x, this.position.y,
                         other.position.x, other.position.y);
            if (other != this && d < perceptionRadius) {
                steering.add(other.position);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            
            steering.sub(this.position);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    seperation(boids){
        let perceptionRadius = 20;
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
            let d = dist(
                this.position.x, this.position.y, 
                other.position.x, other.position.y
                );
            if (other != this && d < perceptionRadius) {
                let difference = p5.Vector.sub(this.position, other.position);
                
                difference.div( 1 - ( d/perceptionRadius) );
                steering.add(difference);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    flock(boids) {
        let alignment = this.align(boids);
        // let alignment = p5.Vector.random2D();
        
        let cohesion = this.cohesion(boids);
        // let cohesion = p5.Vector.random2D();

        let seperation = this.seperation(boids);
        // let seperation = p5.Vector.random2D();

        let homing = this.homing();
        // let homing = p5.Vector.random2D();


        seperation.mult(parseFloat(seperationSlider.value));
        alignment.mult(parseFloat(alignSlider.value));
        cohesion.mult(parseFloat(cohesionSlider.value));
        homing.mult(parseFloat(homingSlider.value));

        this.maxForce = parseFloat(maxForceSlider.value) * 0.5;
        

        this.acceleration.add(alignment);
        // this.acceleration.limit(this.maxForce);

        this.acceleration.add(cohesion);
        // this.acceleration.limit(this.maxForce);

        this.acceleration.add(homing);
        // this.acceleration.limit(this.maxForce);

        this.acceleration.add(seperation);

        this.acceleration.limit(this.maxForce);

        if (this.undisturbedFlightTime < 10) {
            console.log('align', alignment.mag(),
                'cohesion', cohesion.mag(),
                'seperation', seperation.mag(),
                'homing', homing.mag());

        }

    }
    
    move() {
        
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);

        if (this.velocity < this.minSpeed && this.perched == false && this.landing == false) {
            this.velocity.setMag(this.minSpeed);
            
        }

        this.acceleration.mult(0);
        
    }

    edges() {
        if(this.position.x > width){
            this.position.x = 0;
        }
        if(this.position.x < 0){
            this.position.x = width;
        }
        if(this.position.y < 0){
            //this.position.x = 1;
            //this.position.y = 0;
        }
        if(this.position.y >= height){
            //this.position.x = width - 1;
            this.position.y = height - 1;
        }
    }


    show() {

        ellipse(this.position.x, this.position.y, 4,2);
 
    }

    makeDecision(boids, branches){
        var landingBoids = 0;
        var fleeingBoids = 0;
        for (let i = 0; i < boids.length; i++) {
            if (boids[i].landing == true) {
                landingBoids += 1;
            }
            if (boids[i].fleeing == true) {
                fleeingBoids += 1;
            }
        }
        if ( landingBoids > random(4, 50) || this.undisturbedFlightTime > random(1200,6000) ) {
            if (this.perched == false && this.fleeing == false) {
                this.landing = true;
            }
        }
        if (fleeingBoids > random(boids.length/4.0, boids.length - 2)) {
            this.perched = false;
            this.landing = false;
            this.fleeing = true;
        }


        if (this.perched) {
            //console.log('perching')
            this.undisturbedFlightTime = 0;
            this.acceleration.mult(0);
            this.velocity.mult(0);

        } else if (this.landing && branches != null && branches.length > 0) {
            //console.log('landing')
            this.undisturbedFlightTime = 0;
            // console.log(branches);
            if (this.destination.x == 0 && this.destination.y == 0) {
                this.destination = this.selectDestination(branches);
            }
            // console.log('destination', destination);
            this.acceleration.add(this.arrive(this.destination));
        } else if (this.fleeing) {
            // console.log('fleeing');
            this.undisturbedFlightTime = 0;
            this.fleeingTime++;
            this.acceleration.add(this.flee(this.target));
            if (this.fleeingTime > 50) {
                this.fleeing = false;
                this.fleeingTime = 0;
            }
        } else {
            this.flock(boids);
            this.undisturbedFlightTime++;
            // console.log(this.undisturbedFlightTime);
        }

    }

    selectDestination(branches) {
        let selection = floor(random(0, (branches.length - 1)));
        // console.log('number', selection);
        selection = branches[selection];
        // console.log('selection', selection);
        return selection['end'];
    }

    arrive(destination) {
        var desired = p5.Vector.sub(destination, this.position);
        var distance = desired.mag();
        var speed = this.maxSpeed;
        if (distance < 100) {
            speed = map(distance, 0, 100, 0, this.maxSpeed);
        }
        
        if (distance < 2) {
            this.perched = true;
            this.landing = false;
            return desired.mult(0);
        }
        desired.setMag(speed);
        var steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxForce);
        return steer;
    }

    flee(target) {
        // on mouseclick flee mouseposition?
        this.perched = false;
        this.landing = false;
        var desired = p5.Vector.sub(target, this.position);
        var distance = desired.mag();
        var speed = this.maxSpeed;
        if (distance < 200) {
            speed = map(distance, 0, 200, this.maxSpeed, this.maxSpeed * 0.5);
        } else {
            this.fleeing = false;
        }
        desired.setMag(speed);
        desired.mult(-1);
        var steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxForce);
        return steer;
    }


}