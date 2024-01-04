class InitScene extends Phaser.Scene {
    constructor() {
        super({ key: 'InitScene' });
    }

    create() {
        // Randomize level order
        const levels = ['seaLevel','rageLevel', 'woodenLevel', 'scaryDungeonLevel', 'tubeLevel'];  
        const shuffledLevels = Phaser.Utils.Array.Shuffle(levels);

        // Store the shuffled levels in the game's registry
        this.game.registry.set('levelOrder', shuffledLevels);
        this.game.registry.set('currentLevelIndex', 0);

        // Start the GameScene
        this.scene.start('GameScene');
    }
}
export default InitScene;