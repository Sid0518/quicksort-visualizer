const SPEED = 1;

const array = Array.from({
    length: 12
}, (elem, idx) => Math.floor(1 + 99*Math.random()));

const sketch = document.querySelector("#p5-sketch");
let visualizer;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function setup() {
    const canvas = createCanvas(sketch.offsetWidth, sketch.offsetHeight);
    canvas.position(0, 0);
    canvas.parent("p5-sketch");

    side = min(width/(array.length + 2.5), height/3);
    visualizer = new QuickSortVisualizer(array);
}

function windowResized() {
    resizeCanvas(sketch.offsetWidth, sketch.offsetHeight);
    side = min(width/(array.length + 2.5), height/3);
}

function draw() {
    background(51);

    visualizer.update();
    visualizer.show();
}
