export class Line {
    constructor(x1, y1, x2, y2, fb) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;

        this.fb = fb; // should the object be in the foreground (1) or background (0)
    }
}

export class Object {
    constructor(lines) {
        this.lines = lines; // list of lines
    }

    setRenderInfo(x, y, w, h, sx, sy, sw, sh, file) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.sx = sx;
        this.sy = sy;
        this.sw = sw;
        this.sh = sh;
        this.file = file;
    }
}