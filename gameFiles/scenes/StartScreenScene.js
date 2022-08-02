class StartScreenScene extends Phaser.Scene {
    constructor() {
        super("startScreen");
    }

    preload() {
        this.load.image('start', '../../assets/start.png');
    }

    create() {
        this.add.image(400, 200, 'start');
    }

}
