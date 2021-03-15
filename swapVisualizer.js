class SwapVisualizer {
    constructor(animArray, i, j) {
        this.animArray = animArray;
        this.i = i;
        this.j = j;
        
        const first = animArray.array[i];
        this.first = new AnimatedElement(
            first.value,
            animArray.getCenter(i),
            {
                fill: color(first.fill),
                strokeWeight: first.strokeWeight,
                textFill: color(first.textFill),
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
                fill: color(second.fill),
                strokeWeight: second.strokeWeight,
                textFill: color(second.textFill),
            }
        );
        this.second.target.set(
            this.second.center.x, 
            this.second.center.y + 1.5*side
        );

        this.phase = 1;
        this.done = false;

        this.messageDiv = document.querySelector(".message");

        this.started = false;
    }

    async startDelayed() {
        await sleep(1500/SPEED);

        this.messageDiv.innerHTML = `
            Swapping first element of the right partition
            <br>
            with the current element
        `;
        this.started = true;
    }

    update() {
        if(!this.started)
            return;

        this.first.update();
        this.second.update();

        const firstTarget = this.animArray.getCenter(this.i);
        const secondTarget = this.animArray.getCenter(this.j);

        if(this.first.center.dist(this.first.target) < 1)
            this.phase++;

        switch(this.phase) {
            case 1:                
                this.first.target.set(firstTarget.x, firstTarget.y + 1.5*side);
                this.second.target.set(secondTarget.x, secondTarget.y + 1.5*side);
                break;

            case 2:
                this.first.target.set(secondTarget.x, secondTarget.y + 1.5*side);
                this.second.target.set(firstTarget.x, firstTarget.y + 1.5*side);
                break;

            case 3:
                this.first.target.set(secondTarget.x, secondTarget.y);
                this.second.target.set(firstTarget.x, firstTarget.y);

                this.first.fill = color(162, 213, 198);
                this.second.fill = color(7, 123, 138);
                break;
                

            case 4:
                this.messageDiv.innerHTML = "";
                this.done = true;
                break;
        }
    }

    show() {
        this.first.show();
        this.second.show();
    }
}