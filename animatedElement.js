let side;
class AnimatedElement {
    constructor(value, center, displayArgs) {
        this.value = value;
        this.center = center;
        this.target = this.center.copy();

        this.fill = displayArgs.fill;
        this.stroke = displayArgs.stroke;
        this.textFill = displayArgs.textFill;
        this.strokeWeight = displayArgs.strokeWeight;
    }

    get moving() {
        return this.center.dist(this.target) > 1;
    }

    update() {
        this.center.lerp(this.target, 0.15);
    }

    show() {
        (this.fill !== undefined) ?
            fill(this.fill) :
            noFill();
        (this.stroke !== undefined) ?
            stroke(this.stroke) :
            noStroke();
        (this.strokeWeight !== undefined) ?
            strokeWeight(this.strokeWeight) :
            strokeWeight(0);
        
        rectMode(CENTER);
        rect(this.center.x, this.center.y, side, side);


        if(this.textFill !== undefined)
            fill(this.textFill);
        noStroke();

        textSize(0.7 * side);
        textAlign(CENTER, CENTER);
        textFont("Segoe UI");
        text(this.value, this.center.x, this.center.y);
    }
}