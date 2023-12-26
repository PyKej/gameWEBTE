import Phaser from 'phaser'
import gameImg from '../assets/game_bcg2.png';

class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    preload() {
        // Load assets here
        this.load.image('game_img', gameImg);
    }

    create() {
        // Create objects here
        this.addBackgroundImage();
    }
    
    addBackgroundImage() {
        this.menuImage = this.add.image(0, 0, 'game_img');
        var scaleX = this.cameras.main.width / this.menuImage.width;
        var scaleY = this.cameras.main.height / this.menuImage.height;
        var scale = Math.max(scaleX, scaleY);
        this.menuImage.setScale(scale).setOrigin(0, 0);
    }


    update() {
        // Update game state here
    }
}

export default GameOverScene;