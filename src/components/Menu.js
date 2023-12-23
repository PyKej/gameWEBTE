import Phaser from 'phaser'
import menuImg from '../assets/menu_img.png';

var MainMenuScene = new Phaser.Class({

    //MainMenuScene je subClassa Phaser.Scene
    Extends: Phaser.Scene,

    initialize:
    //Konštruktor
    function MainMenuScene ()
    {
        Phaser.Scene.call(this, { key: 'main-menu' });
        this.showInfo = false;
    },

    //Toto je zavolane na začiatku iba jeden-krát, väčšinou sa tam dava to aby si mohol hybať pomocou
    //Klavesnice / myšky
    init: function ()
    {
        this.cursors = this.input.keyboard.createCursorKeys();
    },

    //Toto Loaduje assety (fotky atd.) do Scene predtym ako sa celá načíta
    preload: function ()
    {
        this.load.image('menu_img', menuImg);
        
    },

    // TODO: Na vytvorenie Menu
    create: function ()
    {
        this.rectX = this.cameras.main.centerX;
        this.rectY = this.cameras.main.centerY;


        //Pridanie menu obrázku/pozadia
        this.menuImage = this.add.image(0, 0, 'menu_img');
        //Prepočty aby to fitlo do okna -> čiže je to responsive :O šalena matematika odo mna
        var scaleX = this.cameras.main.width / this.menuImage.width;
        var scaleY = this.cameras.main.height / this.menuImage.height;
        var scale = Math.max(scaleX, scaleY);
        this.menuImage.setScale(scale).setOrigin(0, 0);

        var graphics = this.add.graphics();

        // Na tvorbu obdlzniku
        var rectX = this.cameras.main.centerX;
        var rectY = this.cameras.main.centerY;
        var rectWidth = 200;
        var rectHeight = 100;
        var borderRadius = 20; 
    
        // Kreslit obdlznik
        graphics.fillStyle(0xffffff); 
        graphics.fillRoundedRect(rectX - rectWidth / 2, rectY - rectHeight / 2, rectWidth, rectHeight, borderRadius);
    
        // Pridany Start Button
        var buttonText = 'Start Game';
        var buttonStyle = { fill: '#1ac6ff', fontSize: '32px', fontWeight: 'bold', fontFamily: 'Arial' };
        var startButton = this.add.text(rectX, rectY, buttonText, buttonStyle)
            .setOrigin(0.5, 0.5)
            .setInteractive()
        //.on('pointerdown', () => this.startGame()); //-> Toto nahradíme našou funkciu na štart hry

        //Pridaný About button
        var buttonText = 'About';
        var buttonStyle = { fill: '#ffffff', fontSize: '32px', fontWeight: 'bold' };
        var aboutButton = this.add.text(rectX, rectY + 100, buttonText, buttonStyle)
        .setOrigin(0.5, 0.5)
        .setInteractive({ useHandCursor: true })  
        .on('pointerdown', () => { this.showInfo = !this.showInfo; this.showAboutInfo(); });
    },

    update: function ()
    {
        // TODO: Funkcie na update Menu
        
        if (!this.showInfo && this.infoText) {
            this.infoText.setVisible(false);
        } else if (this.showInfo && this.infoText) {
            this.infoText.setVisible(true);
        }
    },

    //Funkcia na ukazanie info o hre --> Work IN progress
   showAboutInfo: function() {
    if (!this.infoText) {
        var infoText = 'This is a game created with Phaser.js and Vue.js.'; // Replace this with your own information
        var infoStyle = { fill: '#000000', fontSize: '16px', fontWeight: 'bold', wordWrap: { width: 200 } }; // Adjust the style as needed
        this.infoText = this.add.text(this.rectX, this.rectY + 200, infoText, infoStyle).setOrigin(0.8, 0.8);
    }
    this.infoText.setVisible(this.showInfo);
}

});

export default MainMenuScene;

