//branch

function Branch(begin, end, generation=0) {
    this.begin = begin;
    this.end = end;
    this.finished = false;
    this.position = end;
    this.velocity = createVector();
    this.generation = generation;

    this.jitter = function() {
        if (!this.finished) {
            this.end.x += random(-1,1);
            this.end.y += random(-1,1);
        }
    }

    this.show = function() {
        stroke(255);
        strokeWeight(max(0.8, 4.0 - (0.6 * this.generation ** 1.6)));
        line(this.begin.x, this.begin.y, this.end.x, this.end.y);
    }

    this.branchA = function() {
        
        var dir = p5.Vector.sub(this.end, this.begin);
        dir.rotate(PI * (angle + random(-5, 30))/360);
        dir.mult(0.67);
        var newEnd = p5.Vector.add(this.end, dir);
        var right = new Branch(this.end, newEnd, (this.generation + 1));
        return right;
    }

    this.branchB = function() {
        this.finished = true;
        var dir = p5.Vector.sub(this.end, this.begin);
        dir.rotate(-PI * (angle + random(-5, 30))/360);
        dir.mult(0.67);
        var newEnd = p5.Vector.add(this.end, dir);
        var left = new Branch(this.end, newEnd, (this.generation + 1));
        return left;
    }
}