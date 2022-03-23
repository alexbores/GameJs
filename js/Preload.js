var TopDownGame = TopDownGame || {};

//loading the game assets
TopDownGame.Preload = function(){};

TopDownGame.Preload.prototype = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);

    this.load.setPreloadSprite(this.preloadBar);

    //load game assets
    this.load.tilemap('level1', 'assets/tilemaps/gameOne3.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('gameTiles', 'assets/images/tileSet1.png');
    this.load.image('greencup', 'assets/images/greencup.png');
    this.load.image('bluecup', 'assets/images/bluecup.png');
    this.load.image('treeBottom', 'assets/images/treeBottom.png'); 
    this.load.image('treeTop', 'assets/images/treeTop.png'); 
    this.load.image('ground', 'assets/images/ground2.png');
    this.load.image('background', 'assets/images/background.jpg');
    this.load.image('column', 'assets/images/wall1.png');
    this.load.image('box', 'assets/images/box1.png');

    this.load.spritesheet('player', 'assets/images/player.png', 50, 50, 12);
    
  },
  create: function() {
    this.state.start('Game');
  }
};