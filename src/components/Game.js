import Phaser from 'phaser'
import gameBg from '../assets/game_bcg2.png';
import submarine from '../assets/submarine.png';
import seaMine from '../assets/sea_mine.png';
import star from '../assets/star.png';
import bgMusic from '../assets/bg_music.mp3';
import starSoundEffect from '../assets/star_sound_effect.mp3';
import explosionSound from '../assets/explosion.mp3';
import obsticles from '../json/obsticles.json';

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });

        // Objects
        this.player;
        this.seaMine;
        this.stars;

        // Music
        this.bgMusic;
        this.starSoundEffect;

        this.cursor;

        // this.emitter;
 
        this.playerSpeed = 150;
        // this.maxPlayerSpeed = 10;

   
    }

    preload() {
        this.load.image('gameBg', gameBg);
        this.load.image('submarine', submarine);
        this.load.image('sea_mine', seaMine);
        this.load.image('star', star);
        this.load.image('spark', star);

        this.load.audio('bgMusic', bgMusic);
        this.load.audio('starSoundEffect', starSoundEffect);
        this.load.audio('explosion', explosionSound);

        this.load.json('obsticles', obsticles);

    }

    create() {

        this.addBackgroundImageSetup(); // background
        this.allSoundSetup(); // sound
        this.cursor = this.input.keyboard.createCursorKeys(); // keyboard tracking
        this.playerSetup(); // player
        this.seaMineSetup(); // sea mine
        this.cameraSetup();  // Setup the camera
        this.starSetup(); // stars
        this.bombExplosionSetup(); // bomb explosion


        // // Create a static physics group
        // this.obstacles = this.physics.add.staticGroup();

        // // Add a rectangle to the group
        // // Parameters: x, y, width, height
        // let obstacle = this.add.rectangle(500, 300, 200, 150, 0xff0000); // Adjust position and size as needed
        // this.obstacles.add(obstacle);

        let worldWidth = this.game.config.width * 1.8; // Adjust as needed
        let worldHeight = this.game.config.height; // Adjust as needed

        this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

          // Load enemy data
        const obsticlesData = this.cache.json.get('obsticles');

        // Create enemies group
        this.obsticles = this.physics.add.group();

        // Create enemies
        obsticlesData.enemies.forEach(enemy => {
            let newObstacle = this.obsticles.create(enemy.x, enemy.y, enemy.type).setImmovable(true);
            newObstacle.setBounce(1, 1); // Set bounce for each obstacle
            newObstacle.setCollideWorldBounds(true); // Ensure it collides with world bounds
            // turn off gravity
            newObstacle.body.setAllowGravity(false);
            // newObstacle.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-200, 200)); // Set random velocity for each obstacle
            // set velociti just up and donw
            // newObstacle.setVelocity(0, Phaser.Math.Between(-150, 150)); // Set random velocity for each obstacle
            newObstacle.setVelocity(0, 60);
        });

        // Collider
        this.physics.add.collider(this.player, this.obsticles);
        

    }
    
    update() {
        this.oscillatorUpdate(); // Oscillator update
        this.movePlayerUpdate(); // Move the player
  
    }

    // ********** ADITIONAL FUNCTIONS **********

    // background image
    addBackgroundImageSetup() {
        this.menuImage = this.add.image(0, 0, 'gameBg');
        var scaleX = this.cameras.main.width / this.menuImage.width;
        var scaleY = this.cameras.main.height / this.menuImage.height;
        var scale = Math.max(scaleX, scaleY);
        this.menuImage.setScale(scale).setOrigin(0, 0);
        this.menuImage.setScrollFactor(0);
    }

    // TODO redoo stars
    starSetup() {
        //Musí byť sem, pretože pri GameOver sa to neresetne
        this.starCount = 0;

        // star --------------------------------
        this.star = this.addScaledImage(400, 250, 'star', 50, 50);
        this.star.originalY = this.star.y; // Set the originalY
        this.star.oscillationSpeed = Phaser.Math.FloatBetween(0.001, 0.008);
        this.star.oscillationRange = Phaser.Math.FloatBetween(1, 20);


        // this.star = this.addScaledImage(400, 250, 'star', 50, 50);
        // this.star.oscillationSpeed = Phaser.Math.FloatBetween(0.001, 0.008);
        // this.star.oscillationRange = Phaser.Math.FloatBetween(1, 30);
        this.star.body.setAllowGravity(false);

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
        this.physics.add.overlap(this.player, this.star, this.collectStar, null, this);


        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        this.starScore = this.add.text(16, 16, 'Stars: 0', { fontSize: '32px', fill: '#000' });
        this.starScore.setScrollFactor(0);

        // ----------------------- 

    }

    playerSetup(){
        // player
        // this.player = this.physics.add.image(50, 250, 'submarine').setOrigin(0, 0);
        this.player = this.addScaledImage(50, 250, 'submarine', 80, 80);
        this.player.body.setAllowGravity(false);
        this.player.setCollideWorldBounds(true);
    }

    seaMineSetup() {
        this.seaMine = this.addScaledImage(400, 250, 'sea_mine', 50, 50);
        this.seaMine.body.setAllowGravity(false);
    }
    
    collectStar(player, star) {
        // star collected
        star.disableBody(true, true);
        this.starCount += 1;
        this.starSoundEffect.play();
        this.starScore.setText('Stars: ' + this.starCount);
    }

    addScaledImage(x, y, imageKey, desiredWidth, desiredHeight) {
        // Create a physics image instead of a standard image
        let img = this.physics.add.image(x, y, imageKey);
    
        // Calculate scale factors to reach the desired width and height
        var scaleX = desiredWidth / img.width;
        var scaleY = desiredHeight / img.height;
    
        // Set the scale and origin of the image
        img.setScale(scaleX, scaleY).setOrigin(0, 0);
    
        return img;
    }

    movePlayerUpdate() {
        // for up down left right keys
        const { left, right, up, down } = this.cursor;
    
        // Reset player velocity
        this.player.setVelocity(0);
    
        // Horizontal movement
        if (left.isDown) {
            this.player.setVelocityX(-this.playerSpeed);
        } else if (right.isDown) {
            this.player.setVelocityX(this.playerSpeed);
        }
    
        // Vertical movement
        if (up.isDown) {
            this.player.setVelocityY(-this.playerSpeed);
        } else if (down.isDown) {
            this.player.setVelocityY(this.playerSpeed);
        }
    
        // Automatic downward movement when no keys are pressed
        if (!left.isDown && !right.isDown && !up.isDown && !down.isDown) {
            this.player.setVelocityY(50); // Adjust this value as needed
        }
    }
    

    oscillatorUpdate() {
        
        // oscillating stars
        this.stars.children.iterate(function (child) {
            child.y = child.originalY + Math.sin(this.time.now * child.oscillationSpeed) * child.oscillationRange;
        }, this);

        // oscillating individual star
        if (this.star.originalY !== undefined) {
            this.star.y = this.star.originalY + Math.sin(this.time.now * this.star.oscillationSpeed) * this.star.oscillationRange;
        }
    }

    allSoundSetup() {
        // music
        this.bgMusic = this.sound.add('bgMusic');
        this.bgMusic.play();
        this.bgMusic.loop = true;
        this.bgMusic.volume = 0.2;

        this.starSoundEffect = this.sound.add('starSoundEffect');

        this.explosion = this.sound.add('explosion');
        this.explosion.volume = 0.4;

        
    }

    cameraSetup() {
        // Set up the camera
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setFollowOffset(-200, 0); // Adjust if needed
        this.cameras.main.setBounds(0, 0, this.game.config.width * 10, this.game.config.height); // Adjust world bounds as needed
    }

    bombExplosionSetup() {
         // bomb explosion
         this.physics.add.overlap(this.player, this.seaMine, () => {
            this.explosion.play();
            // Delay na ostatne riadky pri výbuchu
            this.time.delayedCall(500, () => {
                this.bgMusic.stop();
                this.scene.start('GameOverScene');
            });

        }, null, this);
    }














}

export default GameScene;