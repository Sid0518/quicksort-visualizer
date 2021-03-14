const ITERATION_DELAY = 1800;
class PartitionVisualizer {
    constructor(array, width, height) {
        this.animArray = new AnimatedArray(array, width/2, height/2);
        
        this.i = -1;
        this.indicator = new AnimatedElement(
            '',
            this.animArray.getCenter(this.i),
            {
                stroke: 250,
                strokeWeight: 4,
            }
        );

        this.j = 0;
        this.currentElement = new AnimatedElement(
            '',
            this.animArray.getCenter(this.j),
            {
                stroke: color(242, 203, 108),
                strokeWeight: 4,
            }
        );

        this.pivot = new AnimatedElement(
            array[array.length - 1],
            this.animArray.getCenter(array.length - 1),
            {
                stroke: color(127, 0, 255),
                strokeWeight: 4,
            }
        );
        
        this.swap = null;
        this.messageDiv = document.querySelector(".message");
        this.messageDiv.innerHTML = "Starting the partition algorithm";

        this.movedIndicator = false;
        this.finished = false;
    }

    setWindow() {
        this.animArray.setCenter(width/2, height/2);
        this.indicator.target.set(this.animArray.getCenter(this.i));
        this.currentElement.target.set(this.animArray.getCenter(this.j));
        this.pivot.target.set(this.animArray.getCenter(this.animArray.length - 1));
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
            if(!this.movedIndicator) {
                this.messageDiv.innerHTML = `${x} is <= the pivot ${this.pivot.value}<br>It needs to be added to the left partition`;

                this.i++;
                setTimeout(() => {
                    this.indicator.target.set(this.animArray.getCenter(this.i));
                    this.movedIndicator = true;
                }, ITERATION_DELAY/2);
            }

            else if(!this.indicator.moving) {
                if(this.swap === null) {
                    this.swap = new SwapVisualizer(this.animArray, this.i, this.j);
                    this.animArray.array[this.i].textFill = undefined;
                    this.animArray.array[this.j].textFill = undefined;
                }
                
                else {
                    this.animArray.set(this.j, this.animArray.get(this.i));
                    this.animArray.set(this.i, x);

                    this.animArray.setColor(this.i, color(7, 123, 138));
                    this.animArray.setColor(this.j, color(162, 213, 198));

                    this.animArray.array[this.i].textFill = 51;
                    this.animArray.array[this.j].textFill = 51;

                    this.swap = null;
                    this.movedIndicator = false;

                    this.j++;

                    if(this.j == this.animArray.length) {
                        this.messageDiv.innerHTML = `Algorithm has finished<br>Partition index is ${this.i}`;
                        this.finished = true;
                    }

                    else {
                        this.messageDiv.innerHTML = "Moving to the next element";
                        setTimeout(() => {
                            this.currentElement.target.set(this.animArray.getCenter(this.j));
                            setTimeout(() => this.runIteration(), ITERATION_DELAY/2);
                        }, ITERATION_DELAY/2);
                    }   
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
        this.animArray.update();
        this.indicator.update();
        this.currentElement.update();
        this.pivot.update();

        if(this.swap !== null) {
            this.swap.update();
            
            if(this.swap.done)
                this.runIteration();
        }

        else if(this.movedIndicator && !this.indicator.moving)
            this.runIteration();
    }

    show() {
        this.animArray.show();
        
        if(this.swap !== null)
            this.swap.show();

        this.indicator.show();

        if(!this.finished) {
            this.pivot.show();
            this.currentElement.show();
        }
    }
}