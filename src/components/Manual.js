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
        this.rectWidth = this.scale.width * 0.75; 
        this.rectHeight = this.scale.height * 0.667; 
        this.borderRadius = 20; 
    
        //Button
        this.buttonWidth = this.scale.width * 0.25; 
        this.buttonHeight = this.scale.height * 0.167; 
    
        // Koordinaty na cetrovanie
        this.rectX = this.scale.width / 2; 
        this.rectY = this.scale.height / 2; 
    
        this.addBackgroundImage();
        // Grafika pre útvary
        var graphics = this.add.graphics();
    
        //Pridaný nadpis
        this.addHeaderText1(this.rectX, this.rectY - this.scale.height * 0.433); 
        this.addHeaderText2(this.rectX, this.rectY - this.scale.height * 0.333); 
    
        //Pridaný rám obdĺžniku
        this.drawButton(graphics, this.rectX, this.rectY + this.scale.height * 0.087); 
    
        //Pridaný text 
        this.addTextField(this.scale.width / 2, this.rectY - this.scale.height * 0.23, 'Use arrow keys to'); 
        this.addTextField(this.scale.width / 2, this.rectY - this.scale.height * 0.18, 'move with the submarine!'); 
        this.addTextField(this.scale.width / 2, this.rectY - this.scale.height * 0.017, 'Collect as many stars!'); 
        this.addTextField(this.scale.width / 2, this.rectY + this.scale.height * 0.157, 'Avoid bad obstacles!'); 
    
        //Pridané obrázky
        this.addImages();
    
        this.drawButtonPlay(graphics, this.buttonWidth + this.scale.width * 0.25, this.buttonHeight + this.scale.height * 0.707); 
        this.addButtonPlay(this.buttonWidth + this.scale.width *0.05 , this.buttonHeight + this.scale.height * 0.767, 'Lets Play!'); 
    }
    
    
    addBackgroundImage() {
        this.backgroundImage = this.add.image(0, 0, 'background');
        var scaleX = this.cameras.main.width / this.backgroundImage.width;
        var scaleY = this.cameras.main.height / this.backgroundImage.height;
        var scale = Math.max(scaleX, scaleY);
        this.backgroundImage.setScale(scale).setOrigin(0, 0);
    }

    addImages() {
        
        var imgWidth = 80;
        var imgHeight = 80;
        var starImgWidth = 70;
        var starImgHeight = 70;
    
        this.addImage(this.scale.width/2 - 40 , this.scale.height * 0.3367, 'arrKeys'); 
        this.addStarImage(this.scale.width/2 - 35, this.scale.height * 0.51, 'starImg'); 
        this.addImage(this.scale.width * 0.0375, this.scale.height * 0.05, 'submarineImg'); 
        this.addImage(this.scale.width * 0.8375, this.scale.height * 0.05, 'submarineImg'); 
        this.addImage(this.scale.width/2 - 40, this.scale.height * 0.6867, 'seaMine'); 
    }
    


    addImage(x, y, imageName) {
        let image = this.add.image(x, y, imageName);
    
        let scaleX = 80 / image.width;
        let scaleY = 80 / image.height;
    
        image.setScale(scaleX, scaleY).setOrigin(0, 0);
    }

    addStarImage(x, y, imageName) {
        let image = this.add.image(x, y, imageName);
    
        let scaleX = 70 / image.width;
        let scaleY = 70 / image.height;
    
        image.setScale(scaleX, scaleY).setOrigin(0, 0);
    }

    //Header 1
    addHeaderText1(x, y) {
        var headerText = 'Welcome to';
        var headerStyle = { fill: '#ffffff', fontSize: '4em', fontFamily: 'Arial' };
        this.add.text(x, y, headerText, headerStyle).setOrigin(0.5, 0.5);
    }
    //Header 2 
    addHeaderText2(x, y) {
        var headerText = 'HAPPY SUBMARINE';
        var headerStyle = { fill: '#ffffff', fontSize: '4em', fontFamily: 'Arial' };
        this.add.text(x, y, headerText, headerStyle).setOrigin(0.5, 0.5);
    }

    //Vseobecne na kreslenie obdlznikov
    drawButton(graphics, x, y) {
        this.rectWidth = this.scale.width * 0.9; 
        this.rectHeight = this.scale.height * 0.75; 
    
        graphics.lineStyle(2, 0xFFFFFF);
        graphics.strokeRoundedRect(x - this.rectWidth / 2 , y - this.rectHeight / 2, this.rectWidth, this.rectHeight, this.borderRadius);
    }

    drawButtonPlay(graphics, x, y) {
        this.buttonWidth = this.scale.width * 0.45; 
        this.buttonHeight = this.scale.height * 0.107; 
    
        graphics.fillStyle(0xffffff);
        graphics.fillRoundedRect(x - this.buttonWidth / 2 , y - this.buttonHeight / 2, this.buttonWidth, this.buttonHeight, this.borderRadius);
    
        graphics.lineStyle(4, 0xFFFFFF);
        graphics.strokeRoundedRect(x - this.buttonWidth / 2 , y - this.buttonHeight / 2, this.buttonWidth, this.buttonHeight, this.borderRadius);
    }
    

    addTextField(x, y, text) {

        let textFieldBackground = this.add.rectangle(x, y, 350, 100);
        textFieldBackground.setOrigin(0.5, 0.5);
    
        var textFieldStyle = { fill: '#FFFFFF', fontSize: '2.5em', fontWeight: '900', fontFamily: 'Arial' };
        var textFieldText = this.add.text(0, 0, text, textFieldStyle);
    
        Phaser.Display.Align.In.Center(textFieldText, textFieldBackground);  
    }
    
    addButtonPlay(x, y, text) {
        var buttonStyle = { fill: '#1ac6ff', fontSize: '2.5em', fontWeight: '900', fontFamily: 'Arial' };
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