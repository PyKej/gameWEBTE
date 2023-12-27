import Phaser from 'phaser'
import bgImg from '../assets/bcg_3.png';
import keys from '../assets/arrow_keys5.png';
import star from '../assets/star.png';
import submarine from '../assets/submarine.png';
import mine from '../assets/sea_mine.png';

class ManualScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Manual' });
    }

    init() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    preload() {
        // Load assets here
        this.load.image('background', bgImg);
        this.load.image('arrKeys', keys);
        this.load.image('starImg', star);
        this.load.image('submarineImg' , submarine);
        this.load.image('seaMine', mine);
    }

    create() {
        // Create objects here
        // Constanty ktore su properties sceny
        this.rectWidth = 600;
        this.rectHeight = 400;
        this.borderRadius = 20; 

        //Button
        this.buttonWidth = 200;
        this.buttonHeight = 100;

        // Koordinaty na cetrovanie
        this.rectX = this.cameras.main.centerX;
        this.rectY = this.cameras.main.centerY;

        this.addBackgroundImage();
        // Grafika pre útvary
        var graphics = this.add.graphics();
 
        //Pridaný nadpis
        this.addHeaderText1(this.rectX, this.rectY - 260);
        this.addHeaderText2(this.rectX, this.rectY - 200);

        //Pridaný rám obdĺžniku
        this.drawButton(graphics, this.rectX, this.rectY + 40);

        //Pridaný text 
        this.addTextField(this.rectX - 105, this.rectY - 120, 'Use arrow keys to');
        this.addTextField(this.rectX - 50, this.rectY - 80, 'move with the submarine!');
        this.addTextField(this.rectX - 80, this.rectY - 10, 'Collect as many stars!');
        this.addTextField(this.rectX - 80, this.rectY + 70, 'Avoid bad obstacles!');
        
        //Pridané obrázky
        this.addImages();

        this.drawButtonPlay(graphics, this.buttonWidth + 200, this.buttonHeight + 370);
        this.addButtonPlay(this.buttonWidth + 200, this.buttonHeight + 370, 'Lets Play!');


    }
    
    addBackgroundImage() {
        this.backgroundImage = this.add.image(0, 0, 'background');
        var scaleX = this.cameras.main.width / this.backgroundImage.width;
        var scaleY = this.cameras.main.height / this.backgroundImage.height;
        var scale = Math.max(scaleX, scaleY);
        this.backgroundImage.setScale(scale).setOrigin(0, 0);
    }

    addImages() {
        this.addImage(550, 160, 'arrKeys');
        this.addStarImage(555, 250, 'starImg');
        this.addImage(30,30, 'submarineImg');
        this.addImage(670,30, 'submarineImg');
        this.addImage(550, 340, 'seaMine');
    }


    addImage(x, y, imageName) {
        let image = this.add.image(x, y, imageName);
    
        let scaleX = 90 / image.width;
        let scaleY = 90 / image.height;
    
        image.setScale(scaleX, scaleY).setOrigin(0, 0);
    }

    addStarImage(x, y, imageName) {
        let image = this.add.image(x, y, imageName);
    
        let scaleX = 80 / image.width;
        let scaleY = 80 / image.height;
    
        image.setScale(scaleX, scaleY).setOrigin(0, 0);
    }

    //Header 1
    addHeaderText1(x, y) {
        var headerText = 'Welcome to';
        var headerStyle = { fill: '#ffffff', fontSize: '60px', fontFamily: 'Arial' };
        this.add.text(x, y, headerText, headerStyle).setOrigin(0.5, 0.5);
    }
    //Header 2 
    addHeaderText2(x, y) {
        var headerText = 'HAPPY SUBMARINE';
        var headerStyle = { fill: '#ffffff', fontSize: '48px', fontFamily: 'Arial' };
        this.add.text(x, y, headerText, headerStyle).setOrigin(0.5, 0.5);
    }

    //Vseobecne na kreslenie obdlznikov
    drawButton(graphics, x, y) {
        
        graphics.lineStyle(2, 0xFFFFFF);
        graphics.strokeRoundedRect(x - this.rectWidth / 2 , y - this.rectHeight / 2, this.rectWidth, this.rectHeight, this.borderRadius);
    }

    drawButtonPlay(graphics, x, y) {
        graphics.fillStyle(0xffffff);
        graphics.fillRoundedRect(x - this.buttonWidth / 2 , y - this.buttonHeight / 2, this.buttonWidth, this.buttonHeight, this.borderRadius);

        graphics.lineStyle(4, 0xFFFFFF);
        graphics.strokeRoundedRect(x - this.buttonWidth / 2 , y - this.buttonHeight / 2, this.buttonWidth, this.buttonHeight, this.borderRadius);
    }

    addTextField(x, y, text) {

        let textFieldBackground = this.add.rectangle(x, y, 350, 100);
        textFieldBackground.setOrigin(0.5, 0.5);
    
        var textFieldStyle = { fill: '#FFFFFF', fontSize: '32px', fontWeight: '900', fontFamily: 'Arial' };
        var textFieldText = this.add.text(0, 0, text, textFieldStyle);
    
        Phaser.Display.Align.In.Center(textFieldText, textFieldBackground);  
    }
    
    addButtonPlay(x, y, text) {
        var buttonStyle = { fill: '#1ac6ff', fontSize: '37px', fontWeight: '900', fontFamily: 'Arial' };
        var button = this.add.text(x, y, text, buttonStyle)
            .setOrigin(0.5, 0.5)
            .setInteractive({ useHandCursor: true })  
            .on('pointerdown', () => this.scene.start('GameScene'));
    }


    update() {
        // Update game state here
    }
}

export default ManualScene;