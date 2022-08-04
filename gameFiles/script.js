const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 400,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 300},
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

//images / objects
let backImg;
let startOverlay;
let pauseOverlay;
let player;
let platforms;
let obstacles;
let finishLine;
let cursors;
// audio file
let backgroundMusic;
// booleans
let pressedStart = false;
let gameOver = false;
let gamePaused = false;
// attempt counter
let score = 1;
// text
let scoreText;

const game = new Phaser.Game(config);

function preload ()
{
    // loading player
    this.load.spritesheet('block', '../assets/block.png', {frameWidth: 50, frameHeight: 50});

    // loading obstacles
    this.load.image('obstacle', '../assets/obstacle.png');
    // loading player character
    this.load.image('ground', '../assets/ground.png');
    // background image
    this.load.image('back', '../assets/neon.jpg');
    // background music
    this.load.audio('music', '../assets/Halvorsen - Wouldn\'t Change It [NCS Release].mp3');

    // start Overlay
    this.load.image('start', '../../assets/start.png');
    // pause Overlay
    this.load.image('pause', '../../assets/pause.png');
    // win Overlay
    this.load.image('win', '../../assets/win.png');
}

function create ()
{
    // music
    backgroundMusic = this.sound.add('music');
    // background image
    backImg = this.physics.add.staticGroup();
    backImg.create(17000, 0, 'back').setScale(9, 0.3).refreshBody();

    // adding ground platform to the game | original ground.png size: 500px * 10px
    platforms = this.physics.add.staticGroup();
    platforms.create(16700, 380, 'ground').setScale(66.8, 1).refreshBody();

    // adding obstacles. block "dies" when hitting obstacles
    obstacles =  this.physics.add.staticGroup();
    obstacles.create(800 , 370, 'obstacle');

    // adding block for win condition
    finishLine = this.physics.add.staticGroup();
    finishLine.create(33405, 335, 'ground').setScale(0.002, 10).refreshBody();

    // adding player character to the game and physics
    player = this.physics.add.sprite(400, 350, 'block');

    // player gravity
    player.body.setGravityY(300);

    // collider
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, obstacles, die, null, this);
    this.physics.add.collider(player, finishLine, win, null, this);

    // player block animations
    this.anims.create({
        key: 'jump',
        frames: this.anims.generateFrameNumbers('block', {start: 0, end: 9}),
        frameRate: 5,
        repeat: 0
    });

    // input
    cursors = this.input.keyboard.createCursorKeys();

    // score
    scoreText = this.add.text(16, 16, 'Attempt ' + score, {fontSize: '2.5rem', fill: '#ff5200', backgroundColor: '#1c1b22'});

    // camera following character
    this.cameras.main.startFollow(player, false, 1, 0, -175  , 150);

    // add start overlay
    startOverlay = this.add.image(575, 200, 'start');
    startOverlay.setInteractive();

    // add pause overlay
    pauseOverlay = this.add.image((player.x + 175), 200, 'pause');
    pauseOverlay.visible = false;
    pauseOverlay.setInteractive();
}

function update ()
{
    // checks for game over
    if(gameOver) {
        return;
    }
    // checks if game has actually started
    else if(!pressedStart){
        startOverlay.on('pointerdown', function (pointer){
            // shows pause Button
            document.getElementById('pauseButton').style.display = 'block';
            startOverlay.visible = false;
            pressedStart = true;
            // starts background music
            backgroundMusic.play();
        });
        return;
    }

    // enables player jump on space bar or arrow key up
    if((cursors.up.isDown || cursors.space.isDown) && player.body.touching.down) {
        // plays jump animatino
        player.anims.play('jump');
        // jumps
        player.setVelocityY(-330);
    }

    // set player movement
    player.setVelocityX(200);
    // sets position from score relative to player Character
    scoreText.x = player.x - 200;
}

function pauseGame() {
    if (this.gamePaused) {
        // resumes music
        backgroundMusic.resume();
        this.gamePaused = false;
        // resumes scene
        game.scene.resume('default');
        pauseOverlay.visible = false;
        // reveals pause button
        document.getElementById('pauseButton').style.display = 'block';
        // hides unpause
        document.getElementById('unpause').style.display = 'none';
    } else {
        // pauses music
        backgroundMusic.pause();
        this.gamePaused = true;
        // pauses scene
        game.scene.pause('default');
        // enables pauseOverlay
        pauseOverlay.visible = true;
        pauseOverlay.x = player.x + 175;
        // hides pause button
        document.getElementById('pauseButton').style.display = 'none';
        // reveals unpause
        document.getElementById('unpause').style.display = 'block';
    }
}

function die() {
    // increments attempt counter
    score++;
    scoreText.setText('Attempt ' + score);
    // stops music
    backgroundMusic.stop();
    // gives player character a visual that it has been hit
    player.setTint(0xff0000);
    // pauses scene
    game.scene.pause('default');
    /* after half a second delay resumes the scene & music and
    sets player back to start*/
    setTimeout(() => {
        player.clearTint();
        backgroundMusic.play();
        player.x = 400;
        player.y = 350;
        game.scene.resume('default');
    }, 500);
}

function win() {
    // shows winOverlay
    this.add.image(33554.5, 200, 'win');
    // stops scene and music
    game.scene.pause('default');
    backgroundMusic.stop();
}
