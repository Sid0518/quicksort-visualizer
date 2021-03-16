class QuickSortVisualizer {
    constructor(array) {
        this.center = createVector(width/2, side);
        this.array = [...array];

        const n = array.length;
        const start = 0, end = n - 1;
        this.subarrays = [[start, end]];
        
        this.start = null;
        this.end = null;

        this.partition = null;
        this.performPartition();

        this.finished = false;
    }

    getCenter(i) {
        const n = this.array.length;
        return createVector(
            this.center.x + (i - (n - 1)/2)*side, 
            this.center.y
        );
    }

    async performPartition() {
        while(this.subarrays.length > 0) {
            [this.start, this.end] = this.subarrays.pop();
            if(this.start < this.end)
                break;
        }

        if(this.start >= this.end) {
            this.finalArray = new AnimatedArray(
                this.array,
                this.center,
            );
            this.partition = null;
            
            const messageDiv = document.querySelector(".message");
            messageDiv.innerHTML = "QuickSort finished";
            
            this.finished = true;
            return;
        }

        this.partition = new PartitionVisualizer(
            this.array,
            this.start, this.end,
            this.center,
        );
        this.partition.startDelayed();
    }

    async update() {
        if(this.finished || this.start === null)
            return;

        this.partition.update();
        if(this.partition.finished) {
            for(let i = this.start;i <= this.end;i++)
                this.array[i] = this.partition.animArray.get(i);
            
            const p = this.partition.i;
            this.subarrays.push([p + 1, this.end]);
            this.subarrays.push([this.start, p - 1]);

            this.start = null;
            this.end = null;

            await sleep(2000/SPEED);
            this.performPartition();
        }
    }

    show() {
        (this.finished) ?
            this.finalArray.show(): 
            this.partition.show();
    }
}