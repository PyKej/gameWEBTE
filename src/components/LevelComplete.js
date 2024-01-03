import Phaser from "phaser";
import backgroundImg from '../assets/bcg_3.png';
import star from '../assets/star.png';

class LevelCompleteScene extends Phaser.Scene {

    constructor() {
        super({ key: 'LevelCompleteScene' });
    }

    init() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    preload() {
        // Load assets here
        this.load.image('background', backgroundImg);
        this.load.image('starImg', star);
    }

    create() {
        this.rectWidth = this.scale.width * 0.225; 
        this.rectHeight = this.scale.height * 0.107; 
        this.borderRadius = 20;

        // Koordinaty na cetrovanie
        this.rectX = this.scale.width / 2; 
        this.rectY = this.scale.height / 2; 
        
        this.addBackgroundImage();

         // Grafika pre útvary
         var graphics = this.add.graphics();

         // Pridá nadpis hry
        this.addHeaderText(this.rectX, this.rectY - 70);
        
        this.addImages();

        this.drawButton(graphics, this.rectX, this.rectY + 160);
        this.addButtonNext(this.rectX, this.rectY + 160, 'Next');
    }

    addBackgroundImage() {
        this.menuImage = this.add.image(0, 0, 'background');
        var scaleX = this.cameras.main.width / this.menuImage.width;
        var scaleY = this.cameras.main.height / this.menuImage.height;
        var scale = Math.max(scaleX, scaleY);
        this.menuImage.setScale(scale).setOrigin(0, 0);
    }

    addHeaderText(x, y) {
        var headerText = 'Level Completed !';
        var headerStyle = { fill: '#ffffff', fontSize: '4em', fontFamily: 'Arial' };
        this.add.text(x, y, headerText, headerStyle).setOrigin(0.5, 0.5);
    }

    addImages() {
        let starCount = this.data.get('starCount');
        if(starCount === 3){
            this.addImage(this.scale.width/2 - 40, this.scale.height * 0.49, 'starImg'); 
            this.addImage(this.scale.width/2 - 120, this.scale.height * 0.45, 'starImg'); 
            this.addImage(this.scale.width/2 + 40, this.scale.height * 0.45, 'starImg');
        }else if(starCount === 2){
            this.addImage(this.scale.width/2 - 120, this.scale.height * 0.45, 'starImg'); 
            this.addImage(this.scale.width/2 + 40, this.scale.height * 0.45, 'starImg');
              
        }else{
            this.addImage(this.scale.width/2 - 40, this.scale.height * 0.49, 'starImg'); 
        } 
    }
    
    addImage(x, y, imageName) {
        let image = this.add.image(x, y, imageName);
    
        let scaleX = 80 / image.width;
        let scaleY = 80 / image.height;
    
        image.setScale(scaleX, scaleY).setOrigin(0, 0);
    }

    //Vseobecne na kreslenie obdlznikov
    drawButton(graphics, x, y) {
        // Toto nakresli obdĺznik
        graphics.fillStyle(0xFFFFFF); 
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

    addButtonNext(x, y, text) {
        var buttonStyle = { fill: '#1ac6ff', fontSize: '3em', fontWeight: '900', fontFamily: 'Arial' };
        var button = this.add.text(x, y, text, buttonStyle)
            .setOrigin(0.5, 0.5);
    
        var buttonBackground = this.add.rectangle(x, y, this.rectWidth, this.rectHeight)
            .setOrigin(0.5, 0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.scene.start('GameScene'));
    
        this.children.bringToTop(button);
    }

}

export default LevelCompleteScene;