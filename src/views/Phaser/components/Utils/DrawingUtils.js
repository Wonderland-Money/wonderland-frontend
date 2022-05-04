import Phaser from "phaser";
import { Buttons } from "phaser3-rex-plugins/templates/ui/ui-components";

const fillRoundedRect = (x, y, width, height, borderRadius, color, alpha, scene, centered) => {
    let center = (centered !== undefined) ? centered : true;
    var gfx = scene.add.graphics();
    gfx.fillStyle(color, alpha);
    center
        ? (gfx.fillRoundedRect(x - (width / 2), y - (height / 2), width, height, borderRadius))
        : (gfx.fillRoundedRect(x, y, width, height, borderRadius));
    return gfx;
}

const strokeRoundedRect = (x, y, width, height, borderRadius, color, alpha, scene, centered) => {
    let center = (centered !== undefined) ? centered : true;
    var gfx = scene.add.graphics();
    gfx.lineStyle(1, color, alpha);
    center
        ? (gfx.strokeRoundedRect(x - (width / 2), y - (height / 2), width, height, borderRadius))
        : (gfx.strokeRoundedRect(x, y, width, height, borderRadius));
    return gfx;
}

export const drawLine = (x1, y1, x2, y2, color, thickness, alpha, scene) => {
    var gfx = scene.add.graphics();
    gfx.lineStyle(thickness, color, alpha);
    return gfx.lineBetween(x1, y1, x2, y2);
}

export const strokePolygon = (polygon, color, thickness, alpha, scene) => {
    var gfx = scene.add.graphics();
    gfx.lineStyle(thickness, color, alpha);
    gfx.beginPath();
    gfx.moveTo(polygon.points[0].x, polygon.points[0].y);
    for (var i = 1; i < polygon.points.length; i++)
    {
        gfx.lineTo(polygon.points[i].x, polygon.points[i].y);
    }
    gfx.closePath();
    gfx.strokePath();
    return gfx;
}

export const createBlackButton = (x1, y1, width, text, callback, setScene) => {
    let scene = setScene || this.scene;
    const DEFAULT_HEIGHT = 50;
    const CORNER_SIZE = 6;
    //Corners should be 4px away from corner
    var hitbox = scene.add.rectangle(x1, y1, width, DEFAULT_HEIGHT, 0x000000, 0).setOrigin(0).setInteractive();

    // Button Polygon Shape
    // Rectangle + Cut out corners
    var polygon = new Phaser.Geom.Polygon([
        x1, y1 + CORNER_SIZE,
        x1 + CORNER_SIZE, y1 + CORNER_SIZE,
        x1 + CORNER_SIZE, y1,
        x1 + width - (CORNER_SIZE), y1,
        x1 + width - (CORNER_SIZE), y1 + CORNER_SIZE,
        x1 + width, y1 + CORNER_SIZE,
        x1 + width, y1 + DEFAULT_HEIGHT - (CORNER_SIZE),
        x1 + width - (CORNER_SIZE), y1 + DEFAULT_HEIGHT - (CORNER_SIZE),
        x1 + width - (CORNER_SIZE), y1 + DEFAULT_HEIGHT,
        x1 + CORNER_SIZE, y1 + DEFAULT_HEIGHT,
        x1 + CORNER_SIZE, y1 + DEFAULT_HEIGHT - (CORNER_SIZE),
        x1, y1 + DEFAULT_HEIGHT - (CORNER_SIZE),
    ])

    var rect1 = fillRoundedRect(x1, y1 + CORNER_SIZE, width, DEFAULT_HEIGHT - (2 * CORNER_SIZE), 0, 0x000000, 1, scene, false);
    var rect2 = fillRoundedRect(x1 + CORNER_SIZE, y1, width - (2 * CORNER_SIZE), DEFAULT_HEIGHT, 0, 0x000000, 1, scene, false);
    var polygonRender = strokePolygon(polygon, 0x242424, 2, 1, scene);
    //drawLine(x1 + CORNER_SIZE, y1,  )
    var txt = scene.add.text(x1 + (width / 2), y1 + (DEFAULT_HEIGHT / 2), text, {
        fontSize: 28,
        color: "#efefef",
        fontFamily: "Cormorant Garamond",
        fontStyle: "normal",
    }).setOrigin(0.5);

    // hitbox.on('pointerover', () => {
    //     rect1.clear();
    //     rect2.clear();
    //     rect1 = fillRoundedRect(x1, y1 + CORNER_SIZE, width, DEFAULT_HEIGHT - (2 * CORNER_SIZE), 0, 0x1a1a1a, 1, scene, false);
    //     rect2 = fillRoundedRect(x1 + CORNER_SIZE, y1, width - (2 * CORNER_SIZE), DEFAULT_HEIGHT, 0, 0x1a1a1a, 1, scene, false);
    //     polygonRender.clear();
    //     polygonRender = strokePolygon(polygon, 0xffffff, 2, 1, scene);
    //     txt.setDepth(rect2.depth + 1);
    // });
    // hitbox.on('pointerout', () => {
    //     rect1.clear();
    //     rect2.clear();
    //     rect1 = fillRoundedRect(x1, y1 + CORNER_SIZE, width, DEFAULT_HEIGHT - (2 * CORNER_SIZE), 0, 0x000000, 1, scene, false);
    //     rect2 = fillRoundedRect(x1 + CORNER_SIZE, y1, width - (2 * CORNER_SIZE), DEFAULT_HEIGHT, 0, 0x000000, 1, scene, false);
    //     polygonRender.clear();
    //     polygonRender = strokePolygon(polygon, 0x242424, 2, 1, scene);
    //     txt.setDepth(rect2.depth + 1);
    // });
    // hitbox.on('pointerdown', callback);

    const button = {
        objects: {
            rect1: rect1,
            rect2: rect2,
            hitbox: hitbox,
            txt: txt,
            polygonRender: polygonRender
        },
        registerEvents: () => {
            hitbox.on('pointerover', () => {
                rect1.clear();
                rect2.clear();
                rect1 = fillRoundedRect(x1, y1 + CORNER_SIZE, width, DEFAULT_HEIGHT - (2 * CORNER_SIZE), 0, 0x1a1a1a, 1, scene, false);
                rect2 = fillRoundedRect(x1 + CORNER_SIZE, y1, width - (2 * CORNER_SIZE), DEFAULT_HEIGHT, 0, 0x1a1a1a, 1, scene, false);
                polygonRender.clear();
                polygonRender = strokePolygon(polygon, 0xffffff, 2, 1, scene);
                txt.setDepth(rect2.depth + 1);
            });
            hitbox.on('pointerout', () => {
                rect1.clear();
                rect2.clear();
                rect1 = fillRoundedRect(x1, y1 + CORNER_SIZE, width, DEFAULT_HEIGHT - (2 * CORNER_SIZE), 0, 0x000000, 1, scene, false);
                rect2 = fillRoundedRect(x1 + CORNER_SIZE, y1, width - (2 * CORNER_SIZE), DEFAULT_HEIGHT, 0, 0x000000, 1, scene, false);
                polygonRender.clear();
                polygonRender = strokePolygon(polygon, 0x242424, 2, 1, scene);
                txt.setDepth(rect2.depth + 1);
            });
            hitbox.on('pointerdown', callback);
        },
        deregisterEvents: () => {
            hitbox.removeAllListeners();
        },
        destroy: () => {
            hitbox.disableInteractive();
            hitbox.destroy();
            txt.destroy();
            rect1.clear();
            rect2.clear();
            polygonRender.destroy();
        },
        hide: () => {
            hitbox.disableInteractive();
            button.deregisterEvents();
            txt.setVisible(false);
            txt.alpha = 0;
            rect1.clear();
            rect2.clear();
            polygonRender.clear();
        },
        show: () => {
            hitbox.setInteractive();
            button.registerEvents();
            txt.setVisible(true);
            txt.alpha = 1;
            txt.setDepth(rect2.depth + 1);
            rect1 = fillRoundedRect(x1, y1 + CORNER_SIZE, width, DEFAULT_HEIGHT - (2 * CORNER_SIZE), 0, 0x000000, 1, scene, false);
            rect2 = fillRoundedRect(x1 + CORNER_SIZE, y1, width - (2 * CORNER_SIZE), DEFAULT_HEIGHT, 0, 0x000000, 1, scene, false);
            polygonRender = strokePolygon(polygon, 0x242424, 2, 1, scene);
        },
    }
    button.registerEvents();

    return button;
}

export const createCloseButton = (x, y, callback, setScene) => {
    let scene = setScene || this.scene;

    var hitbox = scene.add.rectangle(x, y, 44, 44, 0x444444, 0).setInteractive();
    // var gfx = scene.add.graphics();
    // gfx.fillStyle(0x444444, 0.5);
    // var background = gfx.fillRoundedRect(x - 24, y - 24, 48, 48, 8).setInteractive({
    //     hitArea: new Phaser.Geom.Rectangle(x - 24, y - 24, 48, 48),
    //     hitAreaCallback: Phaser.Geom.Rectangle.Contains,
    // });
    var background = fillRoundedRect(x, y, 44, 44, 4, 0x444444, 0, scene);
    var border = strokeRoundedRect(x, y, 44, 44, 4, 0x222222, 1, scene);

    var p1 = scene.add.line(x, y, 0, 0, 26, 26, 0xffffff);
    var p2 = scene.add.line(x, y, 0, 26, 26, 0, 0xffffff);
    hitbox.on('pointerover', () => {
        background.clear();
        background = fillRoundedRect(x, y, 44, 44, 4, 0xffffff, 0.04, scene);
        scene.tweens.add({
            targets: p1,
            angle: -45,
            duration: 100,
            ease: "Sine.easeIn"
        })
        scene.tweens.add({
            targets: p2,
            angle: 45,
            duration: 100,
            ease: "Sine.easeIn"
        })
        scene.tweens.add({
            targets: [p1, p2],
            scale: 0.78,
            duration: 100,
            ease: "Sine.easeIn"
        })
        
        p1.strokeColor = 0xeeeeee;
        p2.strokeColor = 0xeeeeee;
    });
    hitbox.on('pointerout', () => {
        background.clear();
        background = fillRoundedRect(x, y, 44, 44, 4, 0x444444, 0, scene);
        scene.tweens.add({
            targets: p1,
            angle: 0,
            duration: 100,
            ease: "Sine.easeIn"
        })
        scene.tweens.add({
            targets: p2,
            angle: 0,
            duration: 100,
            ease: "Sine.easeIn"
        })
        scene.tweens.add({
            targets: [p1, p2],
            scale: 1,
            duration: 100,
            ease: "Sine.easeIn"
        })
        p1.strokeColor = 0xffffff;
        p2.strokeColor = 0xffffff;
    });
    hitbox.on('pointerdown', callback);
}

export const createHamburger = (x, y, callback, setScene) => {
    var hamburger = this.add.rectangle(300, 200, 46, 46, 0x444444, 0.2).setInteractive();
    var toggled = false;
    var b1 = this.add.line(300, 190, 0, 0, 30, 0, 0xffffff);
    var b2 = this.add.line(300, 200, 0, 0, 30, 0, 0xffffff);
    var b3 = this.add.line(300, 210, 0, 0, 30, 0, 0xffffff);
    hamburger.on('pointerover', () => {
        hamburger.fillColor = 0x000000;
        b1.strokeColor = 0xeeeeee;
        b2.strokeColor = 0xeeeeee;
        b3.strokeColor = 0xeeeeee;
    });
    hamburger.on('pointerout', () => {
        hamburger.fillColor = 0x444444;
        b1.strokeColor = 0xffffff;
        b2.strokeColor = 0xffffff;
        b3.strokeColor = 0xffffff;
    });
    hamburger.on('pointerdown', () => {
        if(!toggled) {
            toggled = true;
            this.tweens.add({
                targets: b1, 
                y: b1.y + 10,
                duration: 100,
                ease: "Sine.easeIn",
                onComplete: () => {
                    this.tweens.add({
                        targets: [b1, b2],
                        angle: 45,
                        duration: 100,
                        ease: "Sine.easeIn",
                    })
                }
            })
            this.tweens.add({
                targets: b3, 
                y: b3.y - 10,
                duration: 100,
                ease: "Sine.easeIn",
                onComplete: () => {
                    this.tweens.add({
                        targets: b3,
                        angle: -45,
                        duration: 100,
                        ease: "Sine.easeIn",
                    })
                }
            })
        } else {
            toggled = false;
            this.tweens.add({
                targets: [b1, b2],
                angle: 0,
                duration: 100,
                ease: "Sine.easeIn",
                onComplete: () => {
                    this.tweens.add({
                        targets: b1, 
                        y: b1.y - 10,
                        duration: 100,
                        ease: "Sine.easeIn"
                    })
                }
            })
            this.tweens.add({
                targets: b3,
                angle: 0,
                duration: 100,
                ease: "Sine.easeIn",
                onComplete: () => {
                    this.tweens.add({
                        targets: b3, 
                        y: b3.y + 10,
                        duration: 100,
                        ease: "Sine.easeIn"
                    })
                }
            })
        }
    })
}

/**
 * Returns an array of arrays. Ome for each row created. 
 * Each array has the:
 *  1) Left most position
 *  2) Right most position
 *  3) Left most position + Padding
 *  4) Right most position - padding
 * 
 * Visual Depiction:
 *                              distance
 *  ,==============================''===============================,
 *                   [1]                        [2]
 *  +---------+----------------+---------+----------------+---------+
 *  |         |                |         |                |         |
 *  |         |                |         |                |         |
 *  |         |                |         |                |         |
 *  |         |                |         |                |         |
 * [Lo]      [Li]             [Ri]      [Ro]
 *                            [Lo]      [Li]             [Ri]       [Ro]
 * 
 * Lo = Left Outer
 * Li = Left Inner
 * Ro = Right Outer
 * Ri = Right Inner
 * 
 * @param {int} distance Total distance of space.
 * @param {int} numOfRows Number of divisions to split distance into
 * @param {int} padding Padding to use in between rows
 */
export const generateRows = (distance, numOfRows, padding) => {
    var rows = [];
    var items = {};
    var unit = (distance - ((numOfRows + 1) * padding)) / numOfRows;
    
    for(let i = 0; i < numOfRows; ++i) {
        items["leftOuter"]  = (unit * i) + (padding * i);
        items["rightOuter"] = (unit * (i + 1)) + (padding * (i + 2));
        items["leftInner"]  = (unit * i) + (padding * (i + 1));
        items["rightInner"] = (unit * (i + 1)) + (padding * (i + 1));
        rows[i] = items;
        items = {};
    }
    return rows;
}

/**
 * Generates a custom "grid" object from a given rectangle offset at a certain position. You can specify the desired number of columns, rows, and padding.
 * 
 * @param {int} xOffset Offset from 0 on the x-axis (left)
 * @param {int} yOffset Offset from 0 on the y-axis (top)
 * @param {int} width 
 * @param {int} height 
 * @param {int} numOfCols 
 * @param {int} numOfRows 
 * @param {int} padding 
 * @returns {Grid Object}
 */
export const generateGrid = (xOffset, yOffset, width, height, numOfCols, numOfRows, padding) => {
    var grid = {
        cols: generateRows(width, numOfCols, padding),
        rows: generateRows(height, numOfRows, padding),
        xOffset: xOffset,
        yOffset: yOffset,
    };
    return grid;
}

/**
 * Visualizes a given grid object using lines. 
 * @param {Grid Object} grid 
 * @param {hex} color Takes a hex color code (e.g. 0xff0000 for bright red)
 * @param {Scene} scene 
 */
export const visualizeGrid = (grid, color, scene) => {
    let { xOffset, yOffset, cols, rows } = grid;
    cols.forEach((obj) => {
        let x = xOffset;
        drawLine(obj.leftOuter + x, 0, obj.leftOuter + x, 10000, color, 1, 1, scene);
        drawLine(obj.leftInner + x, 0, obj.leftInner + x, 10000, color, 1, 1, scene);
        drawLine(obj.rightOuter + x, 0, obj.rightOuter + x, 10000, color, 1, 1, scene);
        drawLine(obj.rightInner + x, 0, obj.rightInner + x, 10000, color, 1, 1, scene);
    });
    rows.forEach((obj) => {
        let x = yOffset;
        drawLine(0, obj.leftOuter + x, 10000, obj.leftOuter + x, color, 1, 1, scene);
        drawLine(0, obj.leftInner + x, 10000, obj.leftInner + x, color, 1, 1, scene);
        drawLine(0, obj.rightOuter + x,  10000, obj.rightOuter + x, color, 1, 1, scene);
        drawLine(0, obj.rightInner + x,  10000, obj.rightInner + x, color, 1, 1, scene);
    });
}


