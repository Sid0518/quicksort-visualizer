class QuickSortVisualizer {
    constructor(array) {
        this.array = [...array];
        this.center = createVector(width/2, side);
        
        const n = array.length;
        const start = 0, end = n - 1;
        this.subarrays = [[start, end]];
        
        this.partition = null;
        this.performPartition();
    }

    getCenter(i) {
        const n = this.array.length;
        return createVector(
            this.center.x + (i - (n - 1)/2)*side, 
            this.center.y
        );
    }

    performPartition() {
        [this.start, this.end] = this.subarrays.pop();
        
        this.currentSubarray = [];
        for(let i = this.start;i <= this.end;i++)
            this.currentSubarray.push(this.array[i]);
        
        this.partition = new PartitionVisualizer(
            this.currentSubarray,
            this.getCenter((this.start + this.end)/2),
        );
        setTimeout(() => this.partition.runIteration(), ITERATION_DELAY);
    }

    update() {
        this.partition.update();
    }

    show() {
        this.partition.show();
    }
}