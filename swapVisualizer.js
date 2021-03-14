class SwapVisualizer {
    constructor(animArray, i, j) {
        const first = animArray.array[i];
        this.first = new AnimatedElement(
            first.value,
            animArray.getCenter(i),
            {
                fill: first.fill,
                textFill: first.textFill,
            }
        );
        this.first.target.set(
            this.first.center.x, 
            this.first.center.y + 1.5*side
        );

        const second = animArray.array[j];
        this.second = new AnimatedElement(
            second.value,
            animArray.getCenter(j),
            {
                fill: second.fill,
                textFill: second.textFill,
            }
        );
        this.second.target.set(
            this.second.center.x, 
            this.second.center.y + 1.5*side
        );

        this.phase = 1;

        this.started = false;
        setTimeout(() => this.started = true, ITERATION_DELAY/2);
        this.done = false;
    }

    update() {
        if(!this.started)
            return;

        this.first.update();
        this.second.update();

        if(this.first.center.dist(this.first.target) < 1) {
            switch(this.phase) {
                case 1:                
                    this.first.target.set(this.second.center);
                    this.second.target.set(this.first.center);

                    this.phase = 2;
                    break;

                case 2:
                    this.first.target.set(this.first.center.x, this.first.center.y - 1.5*side);
                    this.second.target.set(this.second.center.x, this.second.center.y - 1.5*side);
                    
                    this.first.fill = color(162, 213, 198);
                    this.second.fill = color(7, 123, 138);

                    this.phase = 3;
                    break;

                case 3:
                    this.done = true;
                    break;
            }
        }
    }

    show() {
        this.first.show();
        this.second.show();
    }
}