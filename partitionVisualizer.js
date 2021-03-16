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
        await sleep(1500/SPEED);
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
                ${x} is <i>not greater</i> than the pivot
                <br>
                It needs to be added to the <i>left</i> partition
            `;
            const i = this.i + 1; // delayed increment
    
            if(this.swap === null && i !== this.j) {
                this.swap = new SwapVisualizer(this.animArray, i, this.j);
                await this.swap.startDelayed();

                this.animArray.array[i].textFill = undefined;
                this.animArray.array[this.j].textFill = undefined;
            }
            
            else {
                if(i === this.j) {
                    await sleep(2000/SPEED);
                    this.messageDiv.innerHTML = `
                        Nothing to swap with,
                        <br>
                        since the right partition is empty
                    `;
                    await sleep(1000/SPEED);
                    this.animArray.setColor(i, color(7, 123, 138));
                    await sleep(1500/SPEED);
                }

                // this.i++;
                this.animArray.set(this.j, this.animArray.get(i));
                this.animArray.set(i, x);

                this.animArray.setColor(this.j, color(162, 213, 198));
                this.animArray.setColor(i, color(7, 123, 138));

                this.animArray.array[i].textFill = 51;
                this.animArray.array[this.j].textFill = 51;

                this.swap = null;

                if(this.j === this.end) {
                    this.i++;
                    this.messageDiv.innerHTML = `
                        Partitioning has finished
                        <br>
                        Partition index is ${this.i}
                    `;
                    this.animArray.setColor(i, color(127, 0, 255));
                    this.finished = true;
                }

                else {
                    this.messageDiv.innerHTML = `
                        Moving to the next element
                    `;
                    await sleep(1500/SPEED);
                    this.i++;
                    this.j++;
                    
                    await sleep(1500/SPEED);
                    this.runIteration();
                }   
            }
        }

        else {
            this.messageDiv.innerHTML = `
                ${x} is <i>greater</i> than the pivot
                <br>
                It needs to be added to the <i>right</i> partition
            `;
            await sleep(1500/SPEED);

            this.animArray.setColor(this.j, color(162, 213, 198));
            await sleep(1500/SPEED);
            
            this.messageDiv.innerHTML = `
                Moving to the next element
            `;
            await sleep(1500/SPEED);
            this.j++;

            await sleep(1500/SPEED);
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