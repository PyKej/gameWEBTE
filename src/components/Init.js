class InitScene extends Phaser.Scene {
    constructor() {
        super({ key: 'InitScene' });
    }

    create() {
        // Randomize level order
        // const levels = ['rageLevel', 'woodenLevel', 'scaryDungeonLevel', 'adolevel', 'test'];
        const levels = ['scaryDungeonLevel', 'woodenLevel', 'test']; // TODO tuna musia byť všetky levely
        const shuffledLevels = Phaser.Utils.Array.Shuffle(levels);

        // Store the shuffled levels in the game's registry
        this.game.registry.set('levelOrder', shuffledLevels);
        this.game.registry.set('currentLevelIndex', 0);

        // Start the GameScene
        this.scene.start('GameScene'); // TODO toto bude treba potom zmeniť na menu
    }
}
export default InitScene;