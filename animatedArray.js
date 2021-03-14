class AnimatedArray {
    constructor(array, x, y) {
        this.length = array.length;
        this.center = createVector(x, y);

        this.array = array.map((elem, idx) =>
            new AnimatedElement(
                elem,
                this.getCenter(idx),
                {
                    fill: 127,
                    stroke: 255,
                    strokeWeight: 0.5,
                    textFill: 51,
                }
            )
        );
    }

    setCenter(x, y) {
        this.center.set(x, y);
        this.array.forEach((elem, idx) => {
            elem.center.set(this.getCenter(idx));
            elem.target.set(elem.center);
        })
    }

    get(i) {
        return this.array[i].value;
    }

    set(i, x) {
        this.array[i].value = x;
    }

    setColor(i, color) {
        this.array[i].fill = color;
    }

    getCenter(i) {
        const n = this.length;
        return createVector(
            this.center.x + (i - (n - 1)/2)*side, 
            this.center.y
        );
    }

    update() {
        this.array.forEach(elem => elem.update());
    }

    show() {
        this.array.forEach(elem => elem.show());
    }
}