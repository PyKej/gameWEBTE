import Phaser from 'phaser'

import gameBg1 from '../assets/game_bcg1.png';
import gameBg2 from '../assets/game_bcg2.png';
import gameBg3 from '../assets/game_bcg3.png';
import gameBg4 from '../assets/game_bcg4.png';
import gameBg5 from '../assets/game_bcg5.png';

import submarine from '../assets/submarine.png';

import seaMine from '../assets/sea_mine.png';
import star from '../assets/star.png';
import woodenObstacleSmall from '../assets/wooden_obstacle_small.png';
import woodenObstacleMedium from '../assets/wooden_obstacle_medium.png';
import woodenObstacleLarge from '../assets/wooden_obstacle_large.png';
import jellyfish from '../assets/jellyfish.png';

import finish from '../assets/finish.png';


import bgMusic from '../assets/bg_music.mp3';
import starSoundEffect from '../assets/star_sound_effect.mp3';
import explosionSound from '../assets/explosion.mp3';
import jellyfishSoundEffect from '../assets/jellyfish_sound_effect.mp3';
import finishSoundEffect from '../assets/finish_sound_effect.mp3';


import data from '../json/data.json';


class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        
        // Objects
        this.player;
        this.seaMine;
        this.stars;
        this.gameIsPaused = false;

        // this.woodenObstacleSmall;
        // this.woodenObstacleMedium;
        // this.woodenObstacleLarge;


        // Music
        this.bgMusic;
        this.starSoundEffect;

        this.cursor;

        // this.emitter;
        
        
       

        
   
    }

    preload() {
        // background
        this.load.image('gameBg1', gameBg1);
        this.load.image('gameBg2', gameBg2);
        this.load.image('gameBg3', gameBg3);
        this.load.image('gameBg4', gameBg4);
        this.load.image('gameBg5', gameBg5);

        // objects
        this.load.image('submarine', submarine);
        this.load.image('sea_mine', seaMine);
        this.load.image('star', star);
        this.load.image('spark', star);
        this.load.image('wooden_obstacle_small', woodenObstacleSmall);
        this.load.image('wooden_obstacle_medium', woodenObstacleMedium);
        this.load.image('wooden_obstacle_large', woodenObstacleLarge);
        this.load.image('finish', finish);
        this.load.image('jellyfish', jellyfish);

        // sound
        this.load.audio('bgMusic', bgMusic);
        this.load.audio('starSoundEffect', starSoundEffect);
        this.load.audio('explosion', explosionSound);
        this.load.audio('jellyfishSoundEffect', jellyfishSoundEffect);
        this.load.audio('finishSoundEffect', finishSoundEffect);

        // json
        this.load.json('data', data);
    }

    create() {
        this.levelData = data.woodenLevel; // Load the level data
        this.boundsSetup(); // bounds
        this.addBackgroundImageSetup(); // background
        this.allSoundSetup(); // sound
        this.cursor = this.input.keyboard.createCursorKeys(); // keyboard tracking
        this.playerSetup(); // player
        this.cameraSetup();  // Setup the camera
        this.starScoreSetup(); // stars
        this.finishSetup(); // finish
        this.processLevelData();
        this.bombExplosionSetup(); // bomb explosion
        this.jellyfishSetup(); // jellyfish
        this.createBorderSetup(); // border
        this.pauseGameSetup();// pause the game
    }
    
    update() {
        this.oscillatorUpdate(); // Oscillator update
        this.checkBoundaryCollisionUpdate(); // New function to check boundary collision
        this.movePlayerUpdate(); // Move the player
    }


    processLevelData() {
        // Create groups for items
        this.groupWoodenObstacleSmall = this.physics.add.group({
            bounceX: 1,
            bounceY: 1,
            collideWorldBounds: true
        });
        this.groupWoodenObstacleMedium = this.physics.add.group({
            immovable: true,
            collideWorldBounds: true
        });
        this.groupWoodenObstacleLarge = this.physics.add.group({
            immovable: true,
            collideWorldBounds: true

        });
        this.groupStars = this.physics.add.group({});
        this.groupBomb = this.physics.add.group({});
        this.groupJellyfish = this.physics.add.group({});
    
        // create obstacles with data from json
        this.levelData.obstacles.forEach(obstacle => {
            let newObstacle;
            if (obstacle.type === 167) { // small wooden obstacle motion via bouncing
                newObstacle = this.groupWoodenObstacleSmall.create(obstacle.posX, obstacle.posY, obstacle.imageKey);
            }
            else if (obstacle.type === 177) { // medium wooden obstacle motion via bouncing
                newObstacle = this.groupWoodenObstacleMedium.create(obstacle.posX, obstacle.posY, obstacle.imageKey);
            }
            else if (obstacle.type === 187) { // large wooden obstacle motion via bouncing
                newObstacle = this.groupWoodenObstacleLarge.create(obstacle.posX, obstacle.posY, obstacle.imageKey);
            }
            else if (obstacle.type === 169) { // small wooden obstacle motion via oscillation
                newObstacle = this.groupWoodenObstacleSmall.create(obstacle.posX, obstacle.posY, obstacle.imageKey);
                this.processLevelOscilation(newObstacle, obstacle);
            }
            else if (obstacle.type === 179) { // medium wooden obstacle motion via oscillation
                newObstacle = this.groupWoodenObstacleMedium.create(obstacle.posX, obstacle.posY, obstacle.imageKey);
                this.processLevelOscilation(newObstacle, obstacle);
            }
            else if (obstacle.type === 189) { // large wooden obstacle motion via oscillation
                newObstacle = this.groupWoodenObstacleLarge.create(obstacle.posX, obstacle.posY, obstacle.imageKey);
                this.processLevelOscilation(newObstacle, obstacle);
            }
            else if (obstacle.type === 269) { // star motion via oscillation
                newObstacle = this.groupStars.create(obstacle.posX, obstacle.posY, obstacle.imageKey);
                this.processLevelOscilation(newObstacle, obstacle);
                
            }
            else if (obstacle.type === 369) { // bomb motion via oscillation
                newObstacle = this.groupBomb.create(obstacle.posX, obstacle.posY, obstacle.imageKey);
                this.processLevelOscilation(newObstacle, obstacle);
                // newObstacle.setBounds(0, 0, this.worldWidth, this.worldHeight);
            }
            else if (obstacle.type === 469) { // jellyfish motion via oscillation
                newObstacle = this.groupJellyfish.create(obstacle.posX, obstacle.posY, obstacle.imageKey);
                this.processLevelOscilation(newObstacle, obstacle);
            }

            else{ // undefined type
                return; // Acts like 'continue' in a forEach loop
            }
            // Common properties for all obstacles
            newObstacle.setDisplaySize(obstacle.sizeX, obstacle.sizeY);
            newObstacle.body.setAllowGravity(obstacle.gravity);
            newObstacle.setImmovable(obstacle.imovable);
            newObstacle.setVelocity(obstacle.velX, obstacle.velY);

        });
    
    
    
    
    
    
        // Add colliders
        this.physics.add.collider(this.player, this.groupWoodenObstacleSmall);
        this.physics.add.collider(this.player, this.groupWoodenObstacleMedium);
        this.physics.add.collider(this.player, this.groupWoodenObstacleLarge);

        //collect stars
        this.physics.add.overlap(this.player, this.groupStars, this.collectStar, null, this);
        
    }

    // ********** ADITIONAL FUNCTIONS **********
    processLevelOscilation(newObstacle, obstacle) {
        newObstacle.originalY = obstacle.posY; // Set the originalY
        newObstacle.originalX = obstacle.posX; // Set the originalX
        newObstacle.oscilationVertical = obstacle.oscilationVertical;
        newObstacle.oscillationSpeed = obstacle.oscillationSpeed;
        newObstacle.oscillationRange =obstacle.oscillationRange;
    }

    oscillatorUpdate() {
        this.applyOscillation(this.groupStars);
        this.applyOscillation(this.groupBomb);
        this.applyOscillation(this.groupJellyfish);
        this.applyOscillation(this.groupWoodenObstacleSmall);
        this.applyOscillation(this.groupWoodenObstacleMedium);
        this.applyOscillation(this.groupWoodenObstacleLarge);
    }
    
    applyOscillation(group) {
        group.getChildren().forEach(item => {
            if (item.oscilationVertical === true && item.originalY !== undefined) {
                item.y = item.originalY + Math.sin(this.time.now * item.oscillationSpeed) * item.oscillationRange;
            } else if (item.oscilationVertical === false && item.originalX !== undefined) {
                item.x = item.originalX + Math.sin(this.time.now * item.oscillationSpeed) * item.oscillationRange;
            }
        });
    }


    finishSetup() {
        this.finish = this.addScaledImage(this.levelData.finish.x, this.levelData.finish.y, 'finish', 80, 80);
        this.finish.body.setAllowGravity(false);

        this.physics.add.overlap(this.player, this.finish, () => {
            this.bgMusic.stop();
            this.finishSoundEffect.play();
            this.scene.start('LevelCompleteScene');
        }, null, this);
    }

    boundsSetup() {
        this.worldWidth = this.levelData.worldWidth; 
        this.worldHeight = this.levelData.worldHeight; 

        this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight);
    }

    checkBoundaryCollisionUpdate() {
        const bounds = this.physics.world.bounds;
        if (this.player.x <= bounds.left || 
            this.player.x >= bounds.right - this.player.displayWidth ||
            this.player.y <= bounds.top ||
            this.player.y >= bounds.bottom - this.player.displayHeight) {
            this.triggerGameOver();
        }
    }
    
    triggerGameOver() {
        this.bgMusic.stop();
        this.scene.start('GameOverScene');
    }
    
    addBackgroundImageSetup() {
        // background image
        this.menuImage = this.add.image(0, 0, this.levelData.backgroundImageKey);
        var scaleX = this.cameras.main.width / this.menuImage.width;
        var scaleY = this.cameras.main.height / this.menuImage.height;
        var scale = Math.max(scaleX, scaleY);
        this.menuImage.setScale(scale).setOrigin(0, 0);
        this.menuImage.setScrollFactor(0);
    }

    starScoreSetup() {
        this.starCount = 0;
        this.starScore = this.add.text(16, 16, 'Stars: 0', { fontSize: '32px', fill: '#000' });
        this.starScore.setScrollFactor(0);
    }

    playerSetup(){
        this.playerSpeed = this.levelData.playerSpeed; // Parameter for player speed
        this.player = this.addScaledImage(this.levelData.start.x, this.levelData.start.y, 'submarine', 80, 80);
        this.player.body.setAllowGravity(false);
        this.player.setCollideWorldBounds(true);
    }

    createBorderSetup() {
        const borderThickness = 10; // Thickness of the border
        const border = this.add.graphics();
        border.lineStyle(borderThickness, 0xff0000, 1);
        border.strokeRect(0, 0, this.worldWidth, this.worldHeight);
    }
    
    collectStar(player, star) {
        // star collected
        star.disableBody(true, true);
        this.starCount += 1;
        this.starSoundEffect.play();
        this.starScore.setText('Stars: ' + this.starCount);
        this.scene.get('LevelCompleteScene').data.set('starCount', this.starCount);
    }

    addScaledImage(x, y, imageKey, desiredWidth, desiredHeight) {
        let img = this.physics.add.image(x, y, imageKey); // Create a physics image instead of a standard image
    
        // Calculate scale factors to reach the desired width and height
        var scaleX = desiredWidth / img.width;
        var scaleY = desiredHeight / img.height;
    
        img.setScale(scaleX, scaleY).setOrigin(0, 0);// Set the scale and origin of the image
        return img;
    }

    movePlayerUpdate() {
        // for up down left right keys
        const { left, right, up, down } = this.cursor;

        if(this.jellyfishStink === false){ // if jellyfish stink is not true

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
        else{ // if jellyfish stink is true
            this.player.setVelocityY(90);
        }
    }

    allSoundSetup() {
        // music
        this.bgMusic = this.sound.add('bgMusic');
        this.bgMusic.play();
        this.bgMusic.loop = true;
        this.bgMusic.volume = 0.1;

        this.starSoundEffect = this.sound.add('starSoundEffect');

        this.explosion = this.sound.add('explosion');
        this.explosion.volume = 0.4;

        this.jellyfishSoundEffect = this.sound.add('jellyfishSoundEffect');
        this.jellyfishSoundEffect.volume = 1.5;

        this.finishSoundEffect = this.sound.add('finishSoundEffect');
        this.finishSoundEffect.volume = 0.5;
    }

    cameraSetup() {
        // Set up the camera
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setFollowOffset(-200, 0); // Adjust if needed
        this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight); // Adjust world bounds as needed
    }

    bombExplosionSetup() {
         // bomb explosion
         this.physics.add.overlap(this.player, this.groupBomb, () => {
            this.explosion.play();
            // Delay na ostatne riadky pri výbuchu
            this.bgMusic.stop();
            this.scene.start('GameOverScene');

        }, null, this);
    }

    jellyfishSetup() {
        // jellyfish
        this.jellyfishStink = false;
        this.physics.add.overlap(this.player, this.groupJellyfish, () => {
            this.jellyfishSoundEffect.play();
            this.jellyfishStink = true;
            this.time.delayedCall(this.levelData.stinkDuration, () => {
                this.jellyfishStink = false;
            });

        }, null, this);
    }
    
    pauseGameSetup(){
        let buttonBackground = this.add.graphics();
        buttonBackground.fillStyle(0xffffff);  // Set the color to white
        buttonBackground.fillRect(15, 50, 100, 50);  // Set the position and size of the button
        buttonBackground.setScrollFactor(0);

        let buttonText = this.add.text(65, 75, 'Pause', { color: '#1ac6ff', align: 'center', fontSize: '24px' });
        buttonText.setOrigin(0.5, 0.5);  // Set the origin to the center of the text
        buttonText.setScrollFactor(0);

        buttonBackground.setInteractive(new Phaser.Geom.Rectangle(15, 50, 100, 50), Phaser.Geom.Rectangle.Contains);
        buttonBackground.on('pointerup', () => {
                if (!this.gameIsPaused) {
                    this.game.loop.sleep();
                    this.gameIsPaused = true;
                    
                } else {
                    this.gameIsPaused = false;
                    this.game.loop.wake();
                }
            });
        
                
        this.input.keyboard.on('keydown-ESC', () => {
            if (this.gameIsPaused) {
                    this.game.loop.wake();
                    this.gameIsPaused = false;
                }
            });
            

    }













}

export default GameScene;