export var accCount = 11;

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
            // src values
            dx = 687;
            dy = 165;
            dw = 71;
            dh = 43;
            if (large) {
                // right change x
                rcx = 6;

                // change y
                cy = -12;

                // width & height
                w = 160;
                h = dh * (w / dw);
            } else {
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
            // src values
            dx = 896;
            dy = 169;
            dw = 43;
            dh = 64;
            if (large) {
                // right change x
                rcx = 40;

                // change y
                cy = -60;

                // width & height
                w = 80;
                h = dh * (w / dw);
            } else {
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

        // top hat
        case 3: {
            // src values
            dx = 356;
            dy = 199;
            dw = 71;
            dh = 50;
            if (large) {
                // right change x
                rcx = -5;

                // change y
                cy = -65;

                // width & height
                w = 160;
                h = dh * (w / dw);
            } else {
                // right change x
                rcx = 0;
                // left change x
                lcx = 5;

                // change y
                cy = -23;

                // width & height
                w = 40;
                h = dh * (w / dw);
            }
            
            break;
        }

        // ski mask
        case 4: {
            // src values
            dx = 530;
            dy = 338;
            dw = 59;
            dh = 55;
            if (large) {
                // right change x
                rcx = 15;

                // change y
                cy = 20;

                // width & height
                w = 140;
                h = dh * (w / dw);
            } else {
                // right change x
                rcx = 7;
                // left change x
                lcx = 0;

                // change y
                cy = -3;

                // width & height
                w = 35;
                h = dh * (w / dw);
            }
            
            break;
        }

        // cat ears
        case 5: {
            // src values
            dx = 347;
            dy = 150;
            dw = 67;
            dh = 47;
            if (large) {
                // right change x
                rcx = 15;

                // change y
                cy = -15;

                // width & height
                w = 120;
                h = dh * (w / dw);
            } else {
                // right change x
                rcx = 7;
                // left change x
                lcx = 5;

                // change y
                cy = -8;

                // width & height
                w = 30;
                h = dh * (w / dw);
            }
            
            break;
        }

        // crown
        case 6: {
            // src values
            dx = 2;
            dy = 180;
            dw = 42;
            dh = 40;
            if (large) {
                // right change x
                rcx = 30;

                // change y
                cy = -25;

                // width & height
                w = 80;
                h = dh * (w / dw);
            } else {
                // right change x
                rcx = 11;
                // left change x
                lcx = 11;

                // change y
                cy = -13;

                // width & height
                w = 20;
                h = dh * (w / dw);
            }
            
            break;
        }

        // andrew helmet
        case 7: {
            // src values
            dx = 40;
            dy = 90;
            dw = 71;
            dh = 85;
            if (large) {
                // right change x
                rcx = 20;

                // change y
                cy = -40;

                // width & height
                w = 160;
                h = dh * (w / dw);
            } else {
                // right change x
                rcx = 7;
                // left change x
                lcx = -4;

                // change y
                cy = -18;

                // width & height
                w = 40;
                h = dh * (w / dw);
            }
            
            break;
        }

        // gd cube
        case 8: {
            // src values
            dx = 962;
            dy = 335;
            dw = 45;
            dh = 46;
            if (large) {
                // right change x
                rcx = 40;

                // change y
                cy = -40;

                // width & height
                w = 80;
                h = dh * (w / dw);
            } else {
                // right change x
                rcx = 13;
                // left change x
                lcx = 9;

                // change y
                cy = -18;

                // width & height
                w = 20;
                h = dh * (w / dw);
            }
            
            break;
        }

        // chef hat
        case 9: {
            // src values
            dx = 657;
            dy = 528;
            dw = 53;
            dh = 56;
            if (large) {
                // right change x
                rcx = -40;

                // change y
                cy = -80;

                // width & height
                w = 160;
                h = dh * (w / dw);
            } else {
                // right change x
                rcx = -7;
                // left change x
                lcx = 10;

                // change y
                cy = -25;

                // width & height
                w = 40;
                h = dh * (w / dw);
            }
            
            break;
        }

        // dum sticker
        case 10: {
            // src values
            dx = 951;
            dy = 4;
            dw = 44;
            dh = 33;
            if (large) {
                // right change x
                rcx = 60;

                // change y
                cy = 40;

                // width & height
                w = 120;
                h = dh * (w / dw);
            } else {
                // right change x
                rcx = 15;
                // left change x
                lcx = -3;

                // change y
                cy = 0;

                // width & height
                w = 30;
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
