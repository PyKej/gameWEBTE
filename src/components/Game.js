import Phaser from 'phaser'

import gameBg from '../assets/game_bcg2.png';

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
        this.load.image('gameBg', gameBg);
        this.load.image('submarine', submarine);
        this.load.image('sea_mine', seaMine);
        this.load.image('star', star);
        this.load.image('spark', star);
        this.load.image('wooden_obstacle_small', woodenObstacleSmall);
        this.load.image('wooden_obstacle_medium', woodenObstacleMedium);
        this.load.image('wooden_obstacle_large', woodenObstacleLarge);
        this.load.image('finish', finish);
        this.load.image('jellyfish', jellyfish);

        this.load.audio('bgMusic', bgMusic);
        this.load.audio('starSoundEffect', starSoundEffect);
        this.load.audio('explosion', explosionSound);

        this.load.json('data', data);

    }

    create() {
        this.levelData = data.woodenLevel;
        // let levelData = data.bombLevel;
       

        // Parameters
        this.playerSpeed = this.levelData.playerSpeed; // Parameter for player speed
        // this.widthOfLevelMultiplayer = 1.8; // Multiplayer for width of level calculated for worldWidth
        // this.heightOfLevelMultiplayer = 1; // Multiplayer for height of level calculated for worldHeight


        this.boundsSetup(); // bounds
        this.addBackgroundImageSetup(); // background
        this.allSoundSetup(); // sound
        this.cursor = this.input.keyboard.createCursorKeys(); // keyboard tracking
        this.playerSetup(); // player
        // this.seaMineSetup(); // sea mine
        this.cameraSetup();  // Setup the camera
        this.starScoreSetup(); // stars
        this.finishSetup(); // finish

        this.processLevelData();
        this.bombExplosionSetup(); // bomb explosion
        this.jellyfishSetup(); // jellyfish
        this.createBorder(); // border
        this.pauseGame();// pause the game

        

    }
    
    update() {
        this.oscillatorUpdate(); // Oscillator update
        this.checkBoundaryCollision(); // New function to check boundary collision
        this.movePlayerUpdate(); // Move the player
  
    }


    processLevelData() {
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
    
        // Create small wooden obstacles
        this.levelData.obstacles.forEach(obstacle => {
            let newObstacle;
            if (obstacle.type === 167) { // small wooden obstacle
                newObstacle = this.groupWoodenObstacleSmall.create(obstacle.posX, obstacle.posY, obstacle.imageKey);
            }
            else if (obstacle.type === 177) { // medium wooden obstacle
                newObstacle = this.groupWoodenObstacleMedium.create(obstacle.posX, obstacle.posY, obstacle.imageKey);
            }
            else if (obstacle.type === 187) { // large wooden obstacle
                newObstacle = this.groupWoodenObstacleLarge.create(obstacle.posX, obstacle.posY, obstacle.imageKey);
            }
            else if (obstacle.type === 267) { // star
                newObstacle = this.groupStars.create(obstacle.posX, obstacle.posY, obstacle.imageKey);
                newObstacle.originalY = obstacle.posY; // Set the originalY
                newObstacle.oscillationSpeed = Phaser.Math.FloatBetween(0.001, 0.008);
                newObstacle.oscillationRange = Phaser.Math.FloatBetween(1, 20);
                
            }
            else if (obstacle.type === 367) { // bomb
                newObstacle = this.groupBomb.create(obstacle.posX, obstacle.posY, obstacle.imageKey);
                this.processLevelFloating(newObstacle, obstacle);
                // newObstacle.setBounds(0, 0, this.worldWidth, this.worldHeight);
            }
            else if (obstacle.type === 467) { // jellyfish
                newObstacle = this.groupJellyfish.create(obstacle.posX, obstacle.posY, obstacle.imageKey);
                this.processLevelFloating(newObstacle, obstacle);
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
    processLevelFloating(newObstacle, obstacle) {
        newObstacle.originalY = obstacle.posY; // Set the originalY
        newObstacle.originalX = obstacle.posX; // Set the originalX
        newObstacle.oscilationVertical = obstacle.oscilationVertical;
        newObstacle.oscillationSpeed = obstacle.oscillationSpeed;
        newObstacle.oscillationRange =obstacle.oscillationRange;
    }

    finishSetup() {
        this.finish = this.addScaledImage(this.levelData.finish.x, this.levelData.finish.y, 'finish', 80, 80);
        this.finish.body.setAllowGravity(false);


        this.physics.add.overlap(this.player, this.finish, () => {
            this.bgMusic.stop();
            this.scene.start('LevelCompleteScene');
        }, null, this);
    }

    boundsSetup() {
        // setup bounds for the intire game
        // this.worldWidth = this.game.config.width * this.levelData.widthOfLevelMultiplayer; 
        // this.worldHeight = this.game.config.height *this.levelData.heightOfLevelMultiplayer; 

        this.worldWidth = this.levelData.worldWidth; 
        this.worldHeight = this.levelData.worldHeight; 

        this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight);

    }

    checkBoundaryCollision() {
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
        this.menuImage = this.add.image(0, 0, 'gameBg');
        var scaleX = this.cameras.main.width / this.menuImage.width;
        var scaleY = this.cameras.main.height / this.menuImage.height;
        var scale = Math.max(scaleX, scaleY);
        this.menuImage.setScale(scale).setOrigin(0, 0);
        this.menuImage.setScrollFactor(0);
    }

    // TODO redoo stars
    starScoreSetup() {
        this.starCount = 0;
        this.starScore = this.add.text(16, 16, 'Stars: 0', { fontSize: '32px', fill: '#000' });
        this.starScore.setScrollFactor(0);
    }

    playerSetup(){
        this.player = this.addScaledImage(this.levelData.start.x, this.levelData.start.y, 'submarine', 80, 80);
        this.player.body.setAllowGravity(false);
        this.player.setCollideWorldBounds(true);
    }

    createBorder() {
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
    

    oscillatorUpdate() {
        this.groupStars.getChildren().forEach(star => {
            if (star.originalY !== undefined) {
                star.y = star.originalY + Math.sin(this.time.now * star.oscillationSpeed) * star.oscillationRange;
            }
        });

        this.groupBomb.getChildren().forEach(bomb => {
            if (bomb.oscilationVertical === true) {
                bomb.y = bomb.originalY + Math.sin(this.time.now * bomb.oscillationSpeed) * bomb.oscillationRange;
            }
            else if (bomb.oscilationVertical === false) {
                bomb.x = bomb.originalX + Math.sin(this.time.now * bomb.oscillationSpeed) * bomb.oscillationRange;
            }
        });

        this.groupJellyfish.getChildren().forEach(jellyfish => {
            if (jellyfish.oscilationVertical === true) {
                jellyfish.y = jellyfish.originalY + Math.sin(this.time.now * jellyfish.oscillationSpeed) * jellyfish.oscillationRange;
            }
            else if (jellyfish.oscilationVertical === false) {
                jellyfish.x = jellyfish.originalX + Math.sin(this.time.now * jellyfish.oscillationSpeed) * jellyfish.oscillationRange;
            }

        });
  
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

            this.jellyfishStink = true;
            this.time.delayedCall(3000, () => {
                this.jellyfishStink = false;
            });


        }, null, this);
    }
    
    pauseGame(){
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