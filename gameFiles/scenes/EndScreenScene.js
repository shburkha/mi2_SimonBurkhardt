class endScreenScene extends Phaser.Scene {
    constructor() {
        super("endScreen");
    }

    preload() {
        this.load.image('win', '../../assets/win.png');
    }

    create() {
        this.add.image(400, 200, 'win');
    }

}
