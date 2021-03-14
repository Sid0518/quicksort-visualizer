let visualizer;
function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    canvas.style('z-index', '-1');

    const array = [6, 4, 6, 3, 9, 8, 13, 10, 5, 6, 7];
    visualizer = new PartitionVisualizer(array, width, height);
    setTimeout(() => visualizer.runIteration(), ITERATION_DELAY);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    visualizer.setWindow(width, height);
}

function draw() {
    background(51);

    visualizer.update();
    visualizer.show();
}
