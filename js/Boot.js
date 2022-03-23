var TopDownGame = TopDownGame || {};

TopDownGame.Boot = function(){};

//setting game configuration and loading the assets for the loading screen
TopDownGame.Boot.prototype = {
  preload: function() {
    //assets we'll use in the loading screen
    this.load.image('preloadbar', 'assets/images/preloader-bar.png');


    // ///////////////audio
    this.load.audio('theme', 'assets/audio/home.ogg');
    this.load.audio('step', 'assets/audio/step.ogg');

  },
  create: function() {
    //loading screen will have a white background
    this.game.stage.backgroundColor = '#000';

    //scaling options
    
    if(screen.width >= 960){
      // this.scale.setMinMax(0,0,960,590);
      this.scale.pageAlignHorizontally = true;
      this.scale.pageAlignVertically = true;
    }
    else{
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.scale.pageAlignHorizontally = true;
    }
    //have the game centered horizontally
    
    // this.game.world.setBounds(0,0,3000,3000);
    //physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    
    this.state.start('Preload');
  }
};
