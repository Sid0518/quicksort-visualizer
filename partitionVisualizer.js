const ITERATION_DELAY = 800;
class PartitionVisualizer {
    constructor(array, start, end, center) {
        this.animArray = new AnimatedArray(array, center);
        this.start = start;
        this.end = end;

        /*-----------------------------------------------------------*/
            // 'Fade out' the elements outside the range (start, end)
        for(let i = 0;i < start;i++)
            this.animArray.setColor(i, color(64));

        for(let i = end + 1;i < array.length;i++)
            this.animArray.setColor(i, color(64));
        /*-----------------------------------------------------------*/

        const createElement = (value, index, stroke) => {
            const target = this.animArray.getCenter(index);
            const element = new AnimatedElement(
                value,
                createVector(-side, target.y),
                {
                    stroke: stroke,
                    strokeWeight: 4,
                }
            );
            return element;
        };

        this.i = start - 1;
        this.indicator = createElement('', this.i, color(250));

        this.j = start;
        this.currentElement = createElement('', this.i, color(242, 203, 108));
        
        this.pivot = createElement(array[this.end], this.end, color(127, 0, 255));
        
        this.swap = null;
        this.messageDiv = document.querySelector(".message");
        this.messageDiv.innerHTML = `Partitioning the subarray from<br>${this.start} to ${this.end}`;

        this.finished = false;
    }

    async startDelayed() {
        await sleep(ITERATION_DELAY);
        this.runIteration();
    }

    async runIteration() {
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
            this.messageDiv.innerHTML = `
                ${x} is <= the pivot ${this.pivot.value}
                <br>
                It needs to be added to the left partition
            `;
            
            if(this.swap === null && (this.i + 1) !== this.j) {
                this.swap = new SwapVisualizer(this.animArray, this.i + 1, this.j);
                this.swap.startDelayed();
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
                if(this.j > this.end) {
                    this.messageDiv.innerHTML = `
                        Partitioning has finished<br>Partition index is ${this.i}
                    `;
                    this.animArray.setColor(this.i, color(127, 0, 255));
                    this.finished = true;
                }

                else {
                    this.messageDiv.innerHTML = "Moving to the next element";
                    await sleep(ITERATION_DELAY);

                    this.indicator.target.set(this.animArray.getCenter(this.i));
                    this.currentElement.target.set(this.animArray.getCenter(this.j));
                    await sleep(ITERATION_DELAY);

                    this.runIteration();
                }   
            }
        }

        else {
            this.messageDiv.innerHTML = `
                ${x} is larger than the pivot<br>Moving to the next element
            `;
            this.animArray.setColor(this.j, color(162, 213, 198));
            
            this.j++;
            await sleep(ITERATION_DELAY);
            
            this.currentElement.target.set(this.animArray.getCenter(this.j));
            await sleep(ITERATION_DELAY);
            
            this.runIteration();
        }
    }

    update() {
        this.animArray.setCenter(width/2, side);
        this.animArray.update();

        this.indicator.target.set(this.animArray.getCenter(this.i));
        this.indicator.update();

        this.currentElement.target.set(this.animArray.getCenter(this.j));
        this.currentElement.update();

        this.pivot.target.set(this.animArray.getCenter(this.end));
        this.pivot.update();

        if(this.swap !== null) {
            this.swap.update();

            if(this.j === this.end && this.swap.phase === 3)
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
            if(this.i >= this.start)
                this.indicator.show();

            this.pivot.show();
            this.currentElement.show();
        }
    }
}