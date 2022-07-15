export function drawAccessory(ctx, x, y, file, accNum, dir, large) {
    // dir can be 0 (right) or 1 (left)

    var dx, dy, dw, dh, rcx, lcx, cy, w, h;

    switch (accNum) {
        // no accessory
        case 0: {
            break;
        }

        // khoury hat
        case 1: {
            if (large) {
                // src values
                dx = 687;
                dy = 165;
                dw = 71;
                dh = 43;

                // right change x
                rcx = 6;

                // change y
                cy = -12;

                // width & height
                w = 160;
                h = dh * (w / dw);
            } else {
                // src values
                dx = 687;
                dy = 165;
                dw = 71;
                dh = 43;

                // right change x
                rcx = 6;
                // left change x
                lcx = -2;

                // change y
                cy = -12;

                // width & height
                w = 40;
                h = dh * (w / dw);
            }

            break;
        }

        // party hat
        case 2: {
            if (large) {
                // src values
                dx = 896;
                dy = 169;
                dw = 43;
                dh = 64;

                // right change x
                rcx = 40;

                // change y
                cy = -60;

                // width & height
                w = 80;
                h = dh * (w / dw);
            } else {
                // src values
                dx = 896;
                dy = 169;
                dw = 43;
                dh = 64;

                // right change x
                rcx = 12;
                // left change x
                lcx = 10;

                // change y
                cy = -23;

                // width & height
                w = 20;
                h = dh * (w / dw);
            }
            
            break;
        }

        default: {
            break;
        }
    }

    if (accNum > 0) {
        // flip image based on direction
        if (dir) {
            ctx.drawImage(file, (2016 - dx) - dw, dy, dw, dh, 339 + x + lcx, 212 + y + cy, w, h);
        } else {
            ctx.drawImage(file, dx, dy, dw, dh, 339 + x + rcx, 212 + y + cy, w, h);
        }
    }
}

export function drawPlayer(ctx, x, y, file, frame, dir) {
    // dir can be 0 (right) or 1 (left)

    var dx, dy, dw, dh, w, h;

    switch (Math.floor(frame / 2)) {
        // idle
        case 0: {
            dx = 2;
            dy = 1;
            dw = 152;
            dh = 202;
            w = 42;
            h = 56;
//            ctx.drawImage(file, 2, 1, 152, 202, x, y, 42, 56);
            break;
        }
        // run
        case 1: {
            dx = 408;
            dy = 1494;
            dw = 72;
            dh = 91;
            w = 42;
            h = 56;
//            ctx.drawImage(file, 408, 1494, 72, 91, x, y, 42, 56);
            break;
        }
        case 2: {
            dx = 408;
            dy = 1494;
            dw = 72;
            dh = 91;
            w = 42;
            h = 56;
//            ctx.drawImage(file, 408, 1494, 72, 91, x, y, 42, 56);
//            ctx.drawImage(file, 390, 1718, 72, 91, x, y, 42, 56);
            break;
        }
        case 3: {
            dx = 10;
            dy = 1489;
            dw = 80;
            dh = 111;
            w = 42;
            h = 56;
//            ctx.drawImage(file, 10, 1489, 80, 111, x, y, 42, 56);
            break;
        }
        case 4: {
            dx = 10;
            dy = 1489;
            dw = 80;
            dh = 111;
            w = 42;
            h = 56;
//            ctx.drawImage(file, 10, 1489, 80, 111, x, y, 42, 56);
//            ctx.drawImage(file, 10, 868, 80, 103, x, y, 42, 56);
            break;
        }
        case 5: {
            dx = 10;
            dy = 1489;
            dw = 80;
            dh = 111;
            w = 42;
            h = 56;
//            ctx.drawImage(file, 10, 1489, 80, 111, x, y, 42, 56);
//            ctx.drawImage(file, 10, 1105, 80, 108, x, y, 42, 56);
            break;
        }
        case 6: {
            dx = 10;
            dy = 1489;
            dw = 80;
            dh = 111;
            w = 42;
            h = 56;
//            ctx.drawImage(file, 10, 1489, 80, 111, x, y, 42, 56);
//            ctx.drawImage(file, 10, 1363, 80, 109, x, y, 42, 56);
            break;
        }
        case 7: {
            dx = 306;
            dy = 1396;
            dw = 72;
            dh = 94;
            w = 42;
            h = 56;
//            ctx.drawImage(file, 306, 1396, 72, 94, x, y, 42, 56);
            break;
        }
        case 8: {
            dx = 306;
            dy = 1396;
            dw = 72;
            dh = 94;
            w = 42;
            h = 56;
//            ctx.drawImage(file, 306, 1396, 72, 94, x, y, 42, 56);
//            ctx.drawImage(file, 300, 1610, 72, 93, x, y, 42, 56);
            break;
        }
        case 9: {
            dx = 11;
            dy = 1228;
            dw = 74;
            dh = 116;
            w = 42;
            h = 56;
//            ctx.drawImage(file, 11, 1228, 74, 116, x, y, 42, 56);
            break;
        }
        case 10: {
            dx = 11;
            dy = 1228;
            dw = 74;
            dh = 116;
            w = 42;
            h = 56;
//            ctx.drawImage(file, 11, 1228, 74, 116, x, y, 42, 56);
//            ctx.drawImage(file, 10, 1617, 74, 114, x, y, 42, 56);
            break;
        }
        case 11: {
            dx = 11;
            dy = 1228;
            dw = 74;
            dh = 116;
            w = 42;
            h = 56;
//            ctx.drawImage(file, 11, 1228, 74, 116, x, y, 42, 56);
//            ctx.drawImage(file, 10, 1748, 74, 113, x, y, 42, 56);
            break;
        }
        case 12: {
            dx = 11;
            dy = 1228;
            dw = 74;
            dh = 116;
            w = 42;
            h = 56;
//            ctx.drawImage(file, 11, 1228, 74, 116, x, y, 42, 56);
        }
        default: {
            break;
        }
    }

    // flip image based on direction
    if (dir) {
        ctx.drawImage(file, (1320 - dx) - dw, dy, dw, dh, 339 + x, 212 + y, w, h);
    } else {
        ctx.drawImage(file, dx, dy, dw, dh, 339 + x, 212 + y, w, h);
    }
}
