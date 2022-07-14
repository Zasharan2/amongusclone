from PIL import Image

img = Image.open("spritesheet.png")
pix = img.load()

mC = (116, 232, 147)
sC = (69, 140, 88)

for x in range(img.width):
    for y in range(img.height):
        r = pix[x, y][0]
        g = pix[x, y][1]
        b = pix[x, y][2]
        a = pix[x, y][3]
        # main
        if (r >= 50 and g <= 10 and b <= 100 and a >= 250):
            pix[x, y] = (mC[0], mC[1], mC[2], 255)
        # secondary
        elif (r <= 100 and g <= 10 and b >= 50 and a >= 250):
            pix[x, y] = (sC[0], sC[1], sC[2], 255)
        # visor main
        elif (r <= 10 and g >= 200 and b <= 10 and a >= 250):
            pix[x, y] = (148, 201, 219, 255)
        # visor secondary
        elif (r <= 10 and g >= 50 and b <= 10 and a >= 250):
            pix[x, y] = (73, 100, 109, 255)
        # ghost main
        elif (r >= 50 and g <= 10 and b <= 100):
            pix[x, y] = (mC[0], mC[1], mC[2], 127)
        # ghost secondary
        elif (r <= 100 and g <= 10 and b >= 50):
            pix[x, y] = (sC[0], sC[1], sC[2], 127)
        # ghost visor main
        elif (r <= 10 and g >= 200 and b <= 10):
            pix[x, y] = (148, 201, 219, 127)
        # ghost visor secondary
        elif (r <= 10 and g >= 50 and b <= 10):
            pix[x, y] = (73, 100, 109, 127)
img.show()
img.save("spritesheet_mint.png")