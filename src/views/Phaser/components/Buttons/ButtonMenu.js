import Phaser from "phaser";
import { isThisTypeNode } from "typescript";
import { createBlackButton } from "../Utils/DrawingUtils";

class ButtonMenu {
    constructor(scene, buttons, hideButton, menu) {
        this.scene = scene;
        this.buttons = buttons;
        this.hidden = false;
        this.hideButton = hideButton;

        // If this is a sub menu of a parent menu, store the parent menu.
        this.menu = menu || null;

        // Defines padding based on button spacing (first and second buttons), or defaults to '10'.
        this.padding = buttons.length > 1 ? buttons[1].getTopLeft().y - buttons[0].getBottomLeft().y : 16;

        // Define bounds of menu
        this.startX = buttons[0].getTopLeft().x;
        this.startY = buttons[0].getTopLeft().y;
        this.endX = buttons[buttons.length - 1].getBottomRight().x;
        this.endY = buttons[buttons.length - 1].getBottomRight().y;

        this.buttonHeight = buttons[0].getBottomLeft().y - buttons[0].getTopLeft().y;
        this.width = this.endX - this.startX;

        if (hideButton) {
            this.addHideButton();
            this.endY += this.buttonHeight; // + this.padding;
        }

        // Set height from menu bounds (depends on if there's an exit button)
        this.height = this.endY - this.startY;

        if (this.menu) this.hide();
    }


    // Shifts all associated buttons, and the exit button, on the x-axis
    setStartX(x) {
        // Update buttons with new startX position
        this.buttons.forEach(button => {
            button.setPosition(x, button.y);
        });
        // Set startX
        this.startX = x;

        // If the exit button exists, move it to new startX
        this.exitButton && this.exitButton.setPosition(this.startX, this.exitButton.y1);
    }

    addButton(button) {
        this.buttons.push(button);
    }

    show() {
        if (this.menu) {
            this.menu.hide();
            if (this.hideButton) {
                this.exitButton.show();
            }
        }
        this.buttons.forEach(button => {
            button.show(true);
        });
    }

    hide() {
        if (this.menu) {
            this.menu.show();
            if (this.hideButton) {
                this.exitButton.hide();
            }
        }
        this.buttons.forEach(button => {
            button.show(false);
        });
    }

    addHideButton() {
        this.exitButton = new createBlackButton(
            this.startX,
            this.buttons[this.buttons.length - 1].getBottomLeft().y + this.padding, // Place button using bottom of last button
            this.width,
            "Back",
            () => {
                this.hide();
            },
            this.scene,
        );
    }
}

export default ButtonMenu;