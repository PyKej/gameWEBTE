import Phaser from 'phaser'
import gameBg from '../assets/game_bcg2.png';
import submarine from '../assets/submarine.png';
import seaMine from '../assets/sea_mine.png';
import star from '../assets/star.png';
import bgMusic from '../assets/bg_music.mp3';
import starSoundEffect from '../assets/star_sound_effect.mp3';
import match3 from '../assets/match3.json';

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });

        // Objects
        this.player;
        this.seaMine;
        this.stars;
        this.starCount = 0;

        // Music
        this.bgMusic;
        this.starSoundEffect;

        this.cursor;

        this.emitter;
 
        this.playerSpeed = 2;
        // this.maxPlayerSpeed = 10;

   
    }

    preload() {
        this.load.image('gameBg', gameBg);
        this.load.image('submarine', submarine);
        this.load.image('sea_mine', seaMine);
        this.load.image('star', star);

        this.load.audio('bgMusic', bgMusic);
        this.load.audio('starSoundEffect', starSoundEffect);

        this.load.atlas('match3', star, match3);
    }

    create() {
        // background
        this.addBackgroundImage();

        // music
        this.bgMusic = this.sound.add('bgMusic');
        this.bgMusic.play();
        this.bgMusic.loop = true;
        this.bgMusic.volume = 0.2;

        this.starSoundEffect = this.sound.add('starSoundEffect');
        

        // keyboard tracking
        this.cursor = this.input.keyboard.createCursorKeys();

        // player
        this.player = this.physics.add.image(50, 250, 'submarine').setOrigin(0, 0);
        // this.player.setImovable(true);
        this.player.body.setAllowGravity(false);
        this.player.setCollideWorldBounds(true);

        // sea mine
        this.seaMine = this.physics.add.image(400, 250, 'sea_mine').setOrigin(0, 0);
        this.seaMine.body.setAllowGravity(false);
        
        // stars
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 5,
            setXY: { x: 50, y: 80, stepX: 70 }
        });
        this.stars.children.iterate(function (child) {
            child.originalY = child.y;
            child.oscillationSpeed = Phaser.Math.FloatBetween(0.001, 0.008);
            child.oscillationRange = Phaser.Math.FloatBetween(1, 30);
            child.body.setAllowGravity(false);
        });

        // collect stars
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        this.starScore = this.add.text(16, 16, 'Stars: 0', { fontSize: '32px', fill: '#000' });

        // bomb explosion
        this.physics.add.overlap(this.player, this.seaMine, () => {
            this.bgMusic.stop();
            this.scene.start('GameOverScene');
        }, null, this);

        // // Variables to store the pointer coordinates
        // let pointerX = 400;
        // let pointerY = 300;

        //  // Event listener for pointer down event
        // this.input.on('pointerdown', pointer => {
        //     pointerX = pointer.worldX;
        //     pointerY = pointer.worldY;
        // });

        //  // Add particle system
        //  this.add.particles('match3', {
        //     x: () => pointerX,
        //     y: () => pointerY,
        //     frame: 'Match3_Icon_09',
        //     speed: 200,
        //     lifespan: 2000,
        //     gravityY: 200,
        //     scale: 0.5
        // });



        // TODO colliders for now just experimenting
        this.physics.add.collider(this.player, this.seaMine);
        this.physics.add.collider(this.stars, this.seaMine);
        this.physics.add.collider(this.stars, this.player);


    }
    
    update() {
        // for up down left right keys
        const { left, right, up, down } = this.cursor;

        // oscillating stars
        this.stars.children.iterate(function (child) {
            child.y = child.originalY + Math.sin(this.time.now * child.oscillationSpeed) * child.oscillationRange;
        }, this);

        // //moveing player
        // if (left.isDown) {
        //     this.player.x -= this.playerSpeed;
        // } else if (right.isDown) {
        //     this.player.x += this.playerSpeed;
        // } else if (up.isDown) {
        //     this.player.y -= this.playerSpeed;
        // } else if (down.isDown) {
        //     this.player.y += this.playerSpeed;
        // } else {
        //     this.player.setVelocityX(0);
        //     this.player.setVelocityY(0);
        // }


        // Moving player
        if (left.isDown) {
            this.player.x -= this.playerSpeed;
        }
        if (right.isDown) {
            this.player.x += this.playerSpeed;
        }
        if (up.isDown) {
            this.player.y -= this.playerSpeed;
        }
        if (down.isDown) {
            this.player.y += this.playerSpeed;
        }
        // If no keys are pressed, stop the player
        if (!left.isDown && !right.isDown) {
            this.player.setVelocityX(0);
        }
        if (!up.isDown && !down.isDown) {
            this.player.setVelocityY(0);
        }


        // // Moving player
        // if (left.isDown) {
        //     this.player.x -= this.playerSpeed;
        //     this.playerSpeed = this.maxPlayerSpeed;
        // } else if (right.isDown) {
        //     this.player.x += this.playerSpeed;
        //     this.playerSpeed = this.maxPlayerSpeed;
        // } else if (up.isDown) {
        //     this.player.y -= this.playerSpeed;
        //     this.playerSpeed = this.maxPlayerSpeed;
        // } else if (down.isDown) {
        //     this.player.y += this.playerSpeed;
        //     this.playerSpeed = this.maxPlayerSpeed;
        // } else {
        //     // Slowly stop player from any direction
        //     if (this.playerSpeed > 0) {
        //         this.playerSpeed -= 0.0000000000000000000000001; // Increase this value for faster deceleration
        //     } else {
        //         this.playerSpeed = 0;
        //     }
        // }



    }

    // ***** ADITIONAL FUNCTIONS *****

    // background image
    addBackgroundImage() {
        this.menuImage = this.add.image(0, 0, 'gameBg');
        var scaleX = this.cameras.main.width / this.menuImage.width;
        var scaleY = this.cameras.main.height / this.menuImage.height;
        var scale = Math.max(scaleX, scaleY);
        this.menuImage.setScale(scale).setOrigin(0, 0);
    }

    
    // star collected
    collectStar(player, star) {
        star.disableBody(true, true);
        this.starCount += 1;
        this.starSoundEffect.play();
        this.starScore.setText('Stars: ' + this.starCount);


         // Emit particles at the location of the collected star
        //  this.particles.createEmitter({
        //     frame: 'Match3_Icon_09', // Use a frame from the 'match3' atlas
        //     x: star.x,
        //     y: star.y,
        //     lifespan: 1000,
        //     speed: { min: -100, max: 100 },
        //     angle: { min: 0, max: 360 },
        //     scale: { start: 0.5, end: 0 },
        //     quantity: 10,
        //     blendMode: 'ADD'
        // });
    }



}

export default GameScene;