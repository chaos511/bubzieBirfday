const art = require("ascii-art")
var figlet = require('figlet');
const fs = require("fs")

var str = "To: Bubzie <3 \n\nFrom: Dabid"
var count = 0
var insideText = ["Oh hi,", "Oh hi,\n it's me,", "Oh hi,\n it's me, \nDabid", "and...", "and...\nIt's Your\nBirfday!!!", "Have\nsome \ncake!!", "HAPPY BIRFDAY!!", ""]


async function main() {
    var text = await new Promise(async(resolve) => {
        var data = ""
        for (var i = 1; i < str.length + 1; i++) {
            data = await new Promise(resolve => {
                figlet(str.substring(0, i), function(err, data) {
                    if (err) {
                        console.log('Something went wrong...');
                        console.dir(err);
                        return;
                    }
                    console.clear()
                    console.log(data)
                    resolve(data)

                });
            })
            await sleep(100)

        }
        resolve(data)
    })



    text = getGrid(text)


    //mush grid
    var found = true
    while (found) {
        found = false
        for (var line in text) {
            for (var col in text[line]) {
                if (text[line][col] != " ") {
                    found = true
                    var allowed = true
                    for (var checkLine = parseInt(line) + 1; checkLine < text.length; checkLine++) {
                        if (text[checkLine][col] != " ") {
                            allowed = false
                        }
                    }
                    if (allowed) {
                        for (var moveLine = parseInt(line); moveLine < text.length; moveLine++) {
                            await displayGrid(text, count)
                            count++
                            if (moveLine < text.length - 1) {
                                text[parseInt(moveLine) + 1][col] = text[moveLine][col]
                                text[moveLine][col] = " "
                            } else {
                                text[moveLine][col] = " "
                            }

                        }
                    }
                }
            }
        }
    }
    displayGrid(text)
    cardImages = fs.readdirSync("cardAnimation")

    var cardGrids = [getGrid((await fs.readFileSync("cardAnimation/" + cardImages[0])).toString()), getGrid((await fs.readFileSync("cardAnimation/" + cardImages[1])).toString()), getGrid((await fs.readFileSync("cardAnimation/" + cardImages[2])).toString())]

    var buff = new Array(cardGrids[0].length);

    for (var i = 0; i < buff.length; i++) {
        buff[i] = new Array(cardGrids[0][i].length);

        for (var j = 0; j < buff[i].length; j++) {
            buff[i][j] = " "
        }
    }

    var flame = 0
    var cardDone = false
    var thisLoop = 1
    while (!cardDone) {
        cardDone = true
        for (var x in cardGrids[0]) {
            for (var y in cardGrids[0][x]) {
                if (cardGrids[0][x][y] == cardGrids[1][x][y] && cardGrids[0][x][y] == cardGrids[2][x][y]) {
                    if (buff[x][y] != cardGrids[flame][x][y]) {
                        cardDone = false
                        if (Math.random() * 1000 < thisLoop) {
                            thisLoop++
                            buff[x][y] = cardGrids[flame][x][y]
                        }
                    }
                } else {
                    buff[x][y] = cardGrids[flame][x][y]
                }
            }
        }
        flame++
        if (flame > 2) {
            flame = 0
        }
        displayGrid(buff)
        await sleep(100)
    }

    var order = [0, 1, 2, 1, 0, 1, 2, 0, 1, 2, 0, 1, 0, 2, 1, 2, 0, 1, 2, 1, 2, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    var finalCardGrid
    for (var num of order) {
        var img = await fs.readFileSync("cardAnimation/" + cardImages[num])

        console.clear()
        console.log(img.toString())
        finalCardGrid = getGrid(img.toString())
        await sleep(100)
    }



    heartImages = await fs.readdirSync("heartAnimation")
    lastImg = heartImages[heartImages.length - 1]
    for (var x = 0; x < 20; x++) {
        heartImages.push(lastImg)
    }

    heartImages = heartImages.concat(await fs.readdirSync("cakeAnimation"))


    for (var num in heartImages) {
        var heartGrid = getGrid((await heartOrCake(heartImages[num])).toString())
        var textGrid = getGrid(await new Promise(resolve => {
            figlet(insideText[parseInt(num / 10)] + " ", function(err, data) {
                if (err) {
                    console.log('Something went wrong...');
                    console.dir(err);
                    return;
                }
                console.clear()
                console.log(data)
                resolve(data)

            });
        }))
        buff = new Array(finalCardGrid.length);
        for (var x = 0; x < buff.length; x++) {
            buff[x] = new Array(finalCardGrid[x].length);

            for (var y = 0; y < buff[x].length; y++) {
                buff[x][y] = finalCardGrid[x][y]

                var heartOffsets = { x: 15, y: 54 }
                var textOffsets = { x: 2, y: 5 }



                if (x > heartOffsets.x && y > heartOffsets.y) {

                    if (x - heartOffsets.x < heartGrid.length + 1 && y - heartOffsets.y < heartGrid[x - (heartOffsets.x + 1)].length) {
                        if (heartGrid[x - (heartOffsets.x + 1)][y - (heartOffsets.y + 1)] == " " && buff[x][y] != " ") {} else {
                            buff[x][y] = heartGrid[x - (heartOffsets.x + 1)][y - (heartOffsets.y + 1)]
                        }
                    }

                }

                if (x > textOffsets.x && y > textOffsets.y) {

                    if (x - textOffsets.x < textGrid.length + 1 && y - textOffsets.y < textGrid[x - (textOffsets.x + 1)].length) {
                        if (textGrid[x - (textOffsets.x + 1)][y - (textOffsets.y + 1)] == " " && buff[x][y] != " " && parseInt(num / 10) != 6) {

                        } else {
                            buff[x][y] = textGrid[x - (textOffsets.x + 1)][y - (textOffsets.y + 1)]
                        }
                    }

                }

            }
        }
        displayGrid(buff)
        await sleep(200)
    }

}

main()

async function heartOrCake(inStr) {
    if (await fs.existsSync("heartAnimation/" + inStr)) {
        return await fs.readFileSync("heartAnimation/" + inStr)
    } else {
        return await fs.readFileSync("cakeAnimation/" + inStr)
    }
}

function getGrid(text) {
    text = text.split("\n")
    for (var line in text) {
        var l = []
        for (var x = 0; x < text[line].length; x++) {
            l.push(text[line][x])
        }
        text[line] = l
    }
    return text
}
async function displayGrid(ingrid, count) {
    if (count > 20) {
        if ((count - 100) % 5 != 0) {
            return
        }
    } else if (count > 50) {
        if ((count - 100) % 3 != 0) {
            return
        }
    }
    var tmp = ""
    for (var line in ingrid) {
        tmp += ingrid[line].join("") + "\n"
    }
    console.clear()
    console.log(tmp)
    await sleep(10)
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

setInterval(() => {}, 1000)