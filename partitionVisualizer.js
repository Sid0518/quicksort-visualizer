const ITERATION_DELAY = 1800;
class PartitionVisualizer {
    constructor(array, center) {
        this.animArray = new AnimatedArray(array, center);
        let target;

        this.i = -1;
        target = this.animArray.getCenter(this.i);
        this.indicator = new AnimatedElement(
            '',
            createVector(-side, target.y),
            {
                stroke: 250,
                strokeWeight: 4,
            }
        );
        this.indicator.target.set(target);

        this.j = 0;
        target = this.animArray.getCenter(this.j);
        this.currentElement = new AnimatedElement(
            '',
            createVector(-side, target.y),
            {
                stroke: color(242, 203, 108),
                strokeWeight: 4,
            }
        );
        this.currentElement.target.set(target);

        target = this.animArray.getCenter(array.length - 1);
        this.pivot = new AnimatedElement(
            array[array.length - 1],
            createVector(-side, target.y),
            {
                stroke: color(127, 0, 255),
                strokeWeight: 4,
            }
        );
        this.pivot.target.set(target);
        
        this.swap = null;
        this.messageDiv = document.querySelector(".message");
        this.messageDiv.innerHTML = "Starting the partition algorithm";

        this.finished = false;
    }

    runIteration() {
        /*
            One iteration looks like this:

            if(arr[j] <= pivot) {
                i++;
                swap(arr[i], arr[j]);
            }
            j++;

            This repeats from j = 0 to j = arr.length - 1
        */
        if(this.finished)
            return;

        const x = this.animArray.get(this.j);
        if(x <= this.pivot.value) {
            this.messageDiv.innerHTML = `${x} is <= the pivot ${this.pivot.value}<br>It needs to be added to the left partition`;
            
            if(this.swap === null && (this.i + 1) !== this.j) {
                this.swap = new SwapVisualizer(this.animArray, this.i + 1, this.j);
                this.animArray.array[this.i + 1].textFill = undefined;
                this.animArray.array[this.j].textFill = undefined;
            }
            
            else {
                this.i++;
                this.animArray.set(this.j, this.animArray.get(this.i));
                this.animArray.set(this.i, x);

                this.animArray.setColor(this.j, color(162, 213, 198));
                this.animArray.setColor(this.i, color(7, 123, 138));

                this.animArray.array[this.i].textFill = 51;
                this.animArray.array[this.j].textFill = 51;

                this.swap = null;

                this.j++;

                if(this.j === this.animArray.length) {
                    this.messageDiv.innerHTML = `Algorithm has finished<br>Partition index is ${this.i}`;
                    this.animArray.setColor(this.i, color(127, 0, 255));
                    this.finished = true;
                }

                else {
                    this.messageDiv.innerHTML = "Moving to the next element";
                    setTimeout(() => {
                        this.indicator.target.set(this.animArray.getCenter(this.i));
                        this.currentElement.target.set(this.animArray.getCenter(this.j));

                        setTimeout(() => this.runIteration(), ITERATION_DELAY/2);
                    }, ITERATION_DELAY/2);
                }   
            }
        }

        else {
            this.messageDiv.innerHTML = `${x} is larger than the pivot<br>Moving to the next element`;
            this.animArray.setColor(this.j, color(162, 213, 198));
            this.j++;
            setTimeout(() => {
                this.currentElement.target.set(this.animArray.getCenter(this.j));
                setTimeout(() => this.runIteration(), ITERATION_DELAY/2);
            }, ITERATION_DELAY/2);
        }
    }

    update() {
        this.animArray.setCenter(width/2, side);
        this.indicator.target.set(this.animArray.getCenter(this.i));
        this.currentElement.target.set(this.animArray.getCenter(this.j));
        this.pivot.target.set(this.animArray.getCenter(this.animArray.length - 1));

        this.animArray.update();
        this.indicator.update();
        this.currentElement.update();
        this.pivot.update();

        if(this.swap !== null) {
            this.swap.update();
            if(this.j === this.animArray.length - 1 && this.swap.phase === 3)
                this.swap.second.fill = color(127, 0, 255);
            
            if(this.swap.done)
                this.runIteration();
        }
    }

    show() {
        this.animArray.show();
        
        if(this.swap !== null)
            this.swap.show();

        if(!this.finished) {
            
            this.indicator.show();
            this.pivot.show();
            this.currentElement.show();
        }
    }
}