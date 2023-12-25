import Phaser from 'phaser'
import menuImg from '../assets/bcg_3.png';

var MainMenuScene = new Phaser.Class({

    //MainMenuScene je subClassa Phaser.Scene
    Extends: Phaser.Scene,

    initialize: function MainMenuScene () {
        Phaser.Scene.call(this, { key: 'main-menu' });
        this.showInfo = false;
    },

    init: function () {
        this.cursors = this.input.keyboard.createCursorKeys();
    },

    preload: function () {
        this.load.image('menu_img', menuImg);
    },

    create: function () {
        // Constanty ktore su properties sceny
        this.rectWidth = 200;
        this.rectHeight = 100;
        this.borderRadius = 20; 

        // Koordinaty na cetrovanie
        this.rectX = this.cameras.main.centerX;
        this.rectY = this.cameras.main.centerY;

        // Pridá menu obrázok
        this.addMenuImage();

        // Grafika pre útvary
        var graphics = this.add.graphics();

        // Pridá nadpis hry
        this.addHeaderText(this.rectX, this.rectY - 200);

        // Vykreslenie Start Game buttonu
        this.drawButton(graphics, this.rectX, this.rectY - 80);
        this.addButtonStart(this.rectX, this.rectY - 80, 'Start Game');

        // Vykreslenie About Game buttonu
        this.drawButton(graphics, this.rectX, this.rectY + 50);
        this.addButtonAbout(this.rectX, this.rectY + 50, 'About Game');

        // Pridané credits
        this.addCredits(this.rectX, this.rectY + 290);
    },

    //METODY PRE VYTVARANIE
    addMenuImage() {
        this.menuImage = this.add.image(0, 0, 'menu_img');
        var scaleX = this.cameras.main.width / this.menuImage.width;
        var scaleY = this.cameras.main.height / this.menuImage.height;
        var scale = Math.max(scaleX, scaleY);
        this.menuImage.setScale(scale).setOrigin(0, 0);
    },

    addHeaderText(x, y) {
        var headerText = 'Happy Submarine';
        var headerStyle = { fill: '#ffffff', fontSize: '48px', fontFamily: 'Arial' };
        this.add.text(x, y, headerText, headerStyle).setOrigin(0.5, 0.5);
    },

    drawButton(graphics, x, y) {
        graphics.fillStyle(0xffffff); 
        graphics.fillRoundedRect(x - this.rectWidth / 2 , y - this.rectHeight / 2, this.rectWidth, this.rectHeight, this.borderRadius);
    },

    addButtonStart(x, y, text) {
        var buttonStyle = { fill: '#1ac6ff', fontSize: '32px', fontWeight: '900', fontFamily: 'Arial' };
        var button = this.add.text(x, y, text, buttonStyle)
            .setOrigin(0.5, 0.5)
            .setInteractive({ useHandCursor: true })  
            .on('pointerdown', () => this.scene.start('GameScene'));
    },

    addButtonAbout(x, y, text) {
        var buttonStyle = { fill: '#1ac6ff', fontSize: '32px', fontWeight: '900', fontFamily: 'Arial' };
        var button = this.add.text(x, y, text, buttonStyle)
            .setOrigin(0.5, 0.5)
            .setInteractive({ useHandCursor: true })  
            .on('pointerdown', () => { this.showInfo = !this.showInfo; this.showAboutInfo(); });
    },

    addCredits(x, y) {
        var creditsText = 'Created by Patrik Kester & Samuel Kubala';
        var creditsStyle = { fill: '#ffffff', fontSize: '16px', fontFamily: 'Arial' };
        this.add.text(x, y, creditsText, creditsStyle).setOrigin(0.5, 0.5);
    },

    update: function () {
        if (!this.showInfo && this.infoText) {
            this.infoText.setVisible(false);
            this.graphics.setVisible(false);
        } else if (this.showInfo && this.infoText) {
            this.infoText.setVisible(true);
            this.graphics.setVisible(true);
        }
    },

    //METODA PRE UPDATE
    showAboutInfo() {
        if (!this.infoText) {
            var infoText = 'Včera som sa opil a skuril :)'; 
            var infoStyle = { fill: '#000000', fontSize: '16px', fontWeight: 'bold', wordWrap: { width: 200 } }; 

            this.graphics = this.add.graphics();
            this.graphics.fillStyle(0xffffff); 
            this.graphics.fillRoundedRect(this.rectX - this.rectWidth / 2, this.rectY + 180 - this.rectHeight / 2, this.rectWidth, this.rectHeight, this.borderRadius);

            this.infoText = this.add.text(this.rectX, this.rectY + 180, infoText, infoStyle).setOrigin(0.5, 0.5);
        }
        this.infoText.setVisible(this.showInfo);
        this.graphics.setVisible(this.showInfo);
    },
});

   
export default MainMenuScene;

