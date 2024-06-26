import Phaser from 'phaser'
import skullImg from '../assets/skull.png';

class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    preload() {
        // Load assets here
        this.load.image('skull', skullImg);
    }

    create() {
        // Constanty ktore su properties sceny
        this.rectWidth = this.scale.width * 0.35; 
        this.rectHeight = this.scale.height * 0.167; 
        this.borderRadius = 20; 

        // Koordinaty na cetrovanie
        this.rectX = this.scale.width / 2; 
        this.rectY = this.scale.height / 2; 

        // Grafika pre útvary
        var graphics = this.add.graphics();

        //Pozadie
        this.cameras.main.setBackgroundColor('#000000');

        //Obrázok kostry
        this.addSkullImages();

        //Pridaný nadpis
        this.addHeaderText1(this.rectX, this.rectY - 160);
        this.addHeaderText2(this.rectX, this.rectY - 110);

        //Pridané Restart button
        this.drawButton(graphics, this.rectX, this.rectY + 160);
        this.addButtonRestart(this.rectX, this.rectY + 160, 'Restart');
    }
    
    addSkullImages() {
        var imgWidth = 90;
        var imgHeight = 120;
    
        // Lavo-Hore 
        this.addSkullImage(0, 0);
        // Pravo-Hore
        this.addSkullImage(this.scale.width - imgWidth, 0);
        // Lavo-dole
        this.addSkullImage(0, this.scale.height - imgHeight - 30);
        // Pravo-dole 
        this.addSkullImage(this.scale.width - imgWidth, this.scale.height - imgHeight - 30);
        // Do textu
        this.addSkullImage(this.scale.width / 2 - imgWidth / 2, this.scale.height / 2 - imgHeight / 2);
    }

    addSkullImage(x, y) {
        this.skullImg = this.add.image(x, y, 'skull');
    
        // Kalkulácia na škálovanie obrázka
        var scaleX = 90 / this.skullImg.width;
        var scaleY = 120 / this.skullImg.height;
    
        this.skullImg.setScale(scaleX, scaleY).setOrigin(0, 0);
    }

    //Header GAME
    addHeaderText1(x, y) {
        var headerText = 'GAME';
        var headerStyle = { fill: '#ffffff', fontSize: '60px', fontFamily: 'Arial' };
        this.add.text(x, y, headerText, headerStyle).setOrigin(0.5, 0.5);
    }

    //Header OVER 
    addHeaderText2(x, y) {
        var headerText = 'OVER';
        var headerStyle = { fill: '#ffffff', fontSize: '48px', fontFamily: 'Arial' };
        this.add.text(x, y, headerText, headerStyle).setOrigin(0.5, 0.5);
    }

    //Vseobecne na kreslenie obdlznikov
    drawButton(graphics, x, y) {
        // Toto nakresli obdĺznik
        graphics.fillStyle(0x000000); 
        graphics.fillRoundedRect(x - this.rectWidth / 2 , y - this.rectHeight / 2, this.rectWidth, this.rectHeight, this.borderRadius);
        // Setne line style border
        graphics.lineStyle(2, 0xFFFFFF);
        // Kresli border
        graphics.strokeRoundedRect(x - this.rectWidth / 2 , y - this.rectHeight / 2, this.rectWidth, this.rectHeight, this.borderRadius);

        graphics.setInteractive(new Phaser.Geom.Rectangle(x - this.rectWidth / 2, y - this.rectHeight / 2, this.rectWidth, this.rectHeight), Phaser.Geom.Rectangle.Contains)
        .setInteractive({ useHandCursor: true })

        graphics.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }

    //Pridaný button RESTART
    addButtonRestart(x, y, text) {
        var buttonStyle = { fill: '#ffffff', fontSize: '32px', fontWeight: '900', fontFamily: 'Arial' };
        var button = this.add.text(x, y, text, buttonStyle)
            .setOrigin(0.5, 0.5);
    
        var buttonBackground = this.add.rectangle(x, y, this.rectWidth, this.rectHeight)
            .setOrigin(0.5, 0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.scene.start('GameScene'));
    
        this.children.bringToTop(button);
    }

    update() {
        // Update game state here
    }
}

export default GameOverScene;