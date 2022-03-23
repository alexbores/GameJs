var TopDownGame = TopDownGame || {};

TopDownGame.playerMove = function(Game){
    


    if(Game.player.customParams.path.length > 0){
      var temp1 = Game.map.getTile(Game.player.customParams.path[Game.player.customParams.path.length-1].x,Game.player.customParams.path[Game.player.customParams.path.length-1].y)
      var tempX1 = temp1.worldX;
      var tempY1 = temp1.worldY;
      Game.targetMarker.x = tempX1;
      Game.targetMarker.y = tempY1;
    }
    else{
      Game.targetMarker.x = -50;
      Game.targetMarker.y = -50;
    }

    if (Game.player.customParams.path.length > 0) {
      TopDownGame.traverse(Game.player);
      if(TopDownGame.musicStep.isPlaying == false){
        TopDownGame.musicStep.play();
      }
      switch(Game.player.customParams.face){
        case 'left':
          Game.player.play('walkingLeft');
        break;
        case 'right':
          Game.player.play('walkingRight');
        break;
        case 'down':
          Game.player.play('walkingDown');
        break;
        case 'up':
          Game.player.play('walkingUp');
        break;
      }
    }
    else {
      
      

      Game.player.body.velocity.x = 0;
      Game.player.body.velocity.y = 0;
      
      if(controlEnabled){
        TopDownGame.xboxController(Game);
      }
      else{
      	TopDownGame.getMovingState(Game);
      }
      Game.background.x = Game.player.x;
      Game.background.y = Game.player.y;
      if(Game.player.customParams.state == 'idle'){
        switch(Game.player.customParams.face){
          case 'left':
            Game.player.play('idleLeft');
          break;
          case 'right':
            Game.player.play('idleRight');
          break;
          case 'down':
            Game.player.play('idleDown');
          break;
          case 'up':
            Game.player.play('idleUp');
          break;
        }
      }
      else{
      	switch(Game.player.customParams.face){
          case 'left':
            Game.player.play('walkingLeft');
          break;
          case 'right':
            Game.player.play('walkingRight');
          break;
          case 'down':
            Game.player.play('walkingDown');
          break;
          case 'up':
            Game.player.play('walkingUp');
          break;
        }
        if(TopDownGame.musicStep.isPlaying == false){
          TopDownGame.musicStep.play();
        }
      }

      if(Game.player.customParams.blockSummoned){
         switch(Game.player.customParams.face){
            case 'left':
              Game.playerBlock.x = Game.player.x-25;
              Game.playerBlock.y = Game.player.y;
            break;
            case 'right':
              Game.playerBlock.x = Game.player.x+25;
              Game.playerBlock.y = Game.player.y;
            break;
            case 'down':
              Game.playerBlock.x = Game.player.x;
              Game.playerBlock.y = Game.player.y+20;
            break;
            case 'up':
              Game.playerBlock.x = Game.player.x;
              Game.playerBlock.y = Game.player.y-25;
            break;
         }
       }
       else{
       	  Game.playerBlock.x = -50;
          Game.playerBlock.y = -50;
       }
    }

    
}

TopDownGame.createPlayer = function(Game){
   //move player with cursor keys
    // Game.cursors = Game.game.input.keyboard.createCursorKeys();
    Game.marker = Game.game.add.graphics();
    Game.marker.lineStyle(2, 0x001111, 1);
    Game.marker.drawRect(0, 0, 25, 25);

    Game.playerMarker = Game.game.add.graphics();
    Game.playerMarker.lineStyle(2, 0x009999, 0);
    Game.playerMarker.drawRect(0, 0, 25, 25);

    Game.targetMarker = Game.game.add.graphics();
    Game.targetMarker.lineStyle(2, 0x001111, 0);
    Game.targetMarker.drawRect(0, 0, 25, 25);

    Game.marker1 = Game.game.add.graphics();
    Game.marker1.lineStyle(2, 0x001111, 0);
    Game.marker1.drawRect(0, 0, 25, 25);

    var result = Game.findObjectsByType('playerStart', Game.map, 'objectLayer')
    Game.player = Game.game.add.sprite(result[0].x, result[0].y, 'player', 3);
    Game.player.animations.add('walkingRight', [4,3,5], 12, true); //nombre, sprites , fps, loop
    Game.player.animations.add('walkingLeft', [1,0,2], 12, true); //nombre, sprites , fps, loop
    Game.player.animations.add('walkingUp', [10,9,11], 10, true); //nombre, sprites , fps, loop
    Game.player.animations.add('walkingDown', [7,6,8], 10, true); //nombre, sprites , fps, loop
    Game.player.animations.add('idleLeft', [2], 4, true); //nombre, sprites , fps, loop
    Game.player.animations.add('idleRight', [3], 4, true); //nombre, sprites , fps, loop
    Game.player.animations.add('idleDown', [6], 4, true); //nombre, sprites , fps, loop
    Game.player.animations.add('idleUp', [9], 4, true); //nombre, sprites , fps, loop
    Game.player.play('idleDown');
    Game.player.customParams = {
      face: 'down',
      state: 'idle',
      collidingWith: '',
      press: '',
      mainPress: '',
      path: [],
      path_counter: -1,
      player_velocity : 200,
      traverse: {x:0, y:0},
      actionPressing: false,
      blockSummoned: true,
    }

    Game.player.anchor.setTo(0.25,0.5);
    Game.game.physics.arcade.enable(Game.player);
    Game.player.body.height = Game.player.height/2;
    Game.player.body.width = Game.player.width/2;
    Game.player.body.offset.setTo(+6, +11);
    // Game.player.body.x = Game.player.x+Game.player.height/2;


    //the camera will follow the player in the world
    Game.player.body.collideWorldBounds = true;
    Game.game.camera.follow(Game.player, 0.5, 0.5, 64, 64);


    Game.playerBlock = Game.game.add.sprite(-50, -50, 'ground');
    Game.playerBlock.customParams = {
    	overlaping: false,
    }
    Game.game.physics.arcade.enable(Game.playerBlock);
    Game.playerBlock.body.immovable = true;
    Game.playerBlock.alpha = 0;

}





/////////////////////////support player
TopDownGame.getMovingState = function(game){
    if(game.cursors.down.isUp && game.cursors.up.isUp && game.cursors.left.isUp && game.cursors.right.isUp){
      game.player.customParams.state = 'idle';
      game.player.customParams.mainPress = '';
      game.player.customParams.press = '';
    }
    else if(game.player.customParams.state == 'idle'){
      if(game.cursors.left.isDown){
        game.player.customParams.mainPress = 'left';
      }
      else if(game.cursors.right.isDown){
        game.player.customParams.mainPress = 'right';
      }
      else if(game.cursors.up.isDown){
        game.player.customParams.mainPress = 'up';
      }
      else if(game.cursors.down.isDown){
        game.player.customParams.mainPress = 'down';
      }
    }

    
    
    if(game.cursors.left.isDown && game.cursors.right.isUp){
      game.player.customParams.press = 'left';
      if((game.cursors.up.isDown || game.cursors.down.isDown)){
        game.player.body.velocity.x = -game.player.customParams.player_velocity/1.2;
      }
      else{
        game.player.body.velocity.x = -game.player.customParams.player_velocity;
      }
    }
    else if (game.cursors.right.isDown && game.cursors.left.isUp){
      game.player.customParams.press = 'right';
      if( (game.cursors.up.isDown || game.cursors.down.isDown)){
        game.player.body.velocity.x = game.player.customParams.player_velocity/1.2;
      }
      else{
        game.player.body.velocity.x = game.player.customParams.player_velocity;
      }
    }

    if(game.cursors.up.isDown && game.cursors.down.isUp){
      game.player.customParams.press = 'up';
      if((game.cursors.left.isDown || game.cursors.right.isDown) ){
        game.player.body.velocity.y = -game.player.customParams.player_velocity/1.2;
      }
      else{
        game.player.body.velocity.y = -game.player.customParams.player_velocity;
      }
    }
    else if(game.cursors.down.isDown && game.cursors.up.isUp){
      game.player.customParams.press = 'down';
      if((game.cursors.left.isDown || game.cursors.right.isDown)){
        game.player.body.velocity.y = game.player.customParams.player_velocity/1.2;
      }
      else{
        game.player.body.velocity.y = game.player.customParams.player_velocity;
      }
    }
    


    if(game.player.customParams.mainPress == 'left' &&  game.cursors.left.isUp){
      game.player.customParams.mainPress = game.player.customParams.press;
    }
    if(game.player.customParams.mainPress == 'right' &&  game.cursors.right.isUp ){
      game.player.customParams.mainPress = game.player.customParams.press;
    }
    else if(game.player.customParams.mainPress == 'up' && game.cursors.up.isUp){
      game.player.customParams.mainPress = game.player.customParams.press;
    }
    else if(game.player.customParams.mainPress == 'down' && game.cursors.down.isUp){
      game.player.customParams.mainPress = game.player.customParams.press;
    }


    if(game.player.customParams.mainPress == 'left' && game.cursors.left.isDown){
      game.player.customParams.state = 'walking';
      game.player.customParams.face = 'left';
    }
    else if(game.player.customParams.mainPress == 'right' && game.cursors.right.isDown){
      game.player.customParams.state = 'walking';
      game.player.customParams.face = 'right';
    }
    else if(game.player.customParams.mainPress == 'up' && game.cursors.up.isDown){
      game.player.customParams.state = 'walking';
      game.player.customParams.face = 'up';
    }
    else if(game.player.customParams.mainPress == 'down' && game.cursors.down.isDown){
      game.player.customParams.state = 'walking';
      game.player.customParams.face = 'down';
    }



    if(game.cursors.action.isDown && game.player.customParams.actionPressing == false){
       
       // console.log('action')
       if(game.player.customParams.blockSummoned == false && game.player.customParams.actionPressing == false){
          game.player.customParams.blockSummoned = true;
       }
       game.player.customParams.actionPressing = true;
       
    }

    
    if(game.cursors.action.isUp){
       game.player.customParams.blockSummoned = false;
       game.player.customParams.actionPressing = false;
    }
}

TopDownGame.xboxController = function(Game){
	
	// TopDownGame.game.input.gamepad.start();
    dirLeft = false;
    dirRight = false;
    dirUp = false;
    dirDown = false;
    // if(dirLeft==true && dirDown==true && dirUp==true && dirRight==true){
    	Game.player.customParams.state = 'idle';
    // }
    if (pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1)
    {
       dirLeft = true;
       Game.player.customParams.state = 'walking';
       Game.player.customParams.face = 'left';
       Game.player.body.velocity.x = pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) * Game.player.customParams.player_velocity;
    }
    else if (pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1)
    {
        dirRight = true;
        Game.player.customParams.state = 'walking';
        Game.player.customParams.face = 'right';
        Game.player.body.velocity.x = pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) * Game.player.customParams.player_velocity;
    }

    if (pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1)
    {
        dirUp = true;
        Game.player.customParams.state = 'walking';
        Game.player.customParams.face = 'up';
        Game.player.body.velocity.y = pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) * Game.player.customParams.player_velocity;
    }
    else if (pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1)
    {
        dirDown = true;
        Game.player.customParams.state = 'walking';
        Game.player.customParams.face = 'down';
        Game.player.body.velocity.y = pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) * Game.player.customParams.player_velocity;
    }

    if(pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < 0 && pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < 0){
    	if(pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y)){
    	 Game.player.customParams.face = 'left';
    	}
    	else{
    	 Game.player.customParams.face = 'up';
    	}
    }
    else if(pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < 0 && pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0){
    	if(pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -1*pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y)){
    	 Game.player.customParams.face = 'left';
    	}
    	else{
    	 Game.player.customParams.face = 'down';
    	}
    }
    if(pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0 && pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0){
    	if(pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y)){
    	 Game.player.customParams.face = 'right';
    	}
    	else{
    	 Game.player.customParams.face = 'down';
    	}
    }
    else if(pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0 && pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < 0){
    	if(pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > -1*pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y)){
    	 Game.player.customParams.face = 'right';
    	}
    	else{
    	 Game.player.customParams.face = 'up';
    	}
    }


    // console.log(Game.player.customParams.actionPressing)
    if(pad.isDown(Phaser.Gamepad.XBOX360_A) && Game.player.customParams.actionPressing == false){
       if(Game.player.customParams.blockSummoned == false && Game.player.customParams.actionPressing == false){
          Game.player.customParams.blockSummoned = true;
       }
       Game.player.customParams.actionPressing = true;
    }
    
    if(pad.isUp(Phaser.Gamepad.XBOX360_A)){
       Game.player.customParams.actionPressing = false;
       Game.player.customParams.blockSummoned = false;
    }

    // Game.player.body.velocity.x = 0;
    //  Game.player.body.velocity.y = 0;

}






