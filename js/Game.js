var TopDownGame = TopDownGame || {};

//title screen
// TopDownGame.Game = function(){};
var movement = false;
var pad;
var leftTriggerButton;
var dirLeft = false;
var dirRight = false;
var dirUp = false;
var dirDown = false;
var controlEnabled = false;
TopDownGame.Game = {
  //initiate game settings
  init: function(gameSection) {
    // this.gameSection = gameSection ? gameSection :1 ;

    TopDownGame.createControls(TopDownGame.Game); 
  },
  create: function() {
    //parse the file
    this.musicTheme = this.add.audio('theme',0.2,true);
    this.musicTheme.play();

    TopDownGame.musicStep = this.add.sound('step');
    TopDownGame.musicStep.volume=0.5;

    this.clicked = false;
    
    this.background = this.game.add.image(0, 0, 'background');
    // console.log(this.camera.width)
    this.background.width = this.camera.width*1.5;
    this.background.height = this.camera.height*1.5;
    this.background.anchor.setTo(0.5);

    this.map = this.game.add.tilemap('level1',25,25);

    //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
    this.map.addTilesetImage('tileSet', 'gameTiles');

    //create layer
    this.backgroundlayer = this.map.createLayer('backgroundLayer');
    this.backgroundlayer.alpha = 0;
    // console.log(this.map)
    for(var i = 0;   i < this.map.layers.length; i++){
      var temp = this.map.layers[i].name;
      if(temp.search('drawLayer') != -1 ){
        this.map.createLayer(temp);
        // console.log('layer created');
      }
    }
    // this.ground = this.add.tileSprite(0,0,this.game.world.width,this.game.world.height,'ground');
    this.createNature('bottom');

    //resizes the game world to match the layer dimensions
    this.backgroundlayer.resizeWorld();

    // this.createItems();

    //create player
    TopDownGame.createPlayer(TopDownGame.Game);
    


    


    // make the game grid
    this.grid = TopDownGame.initGraph(this.map);
    
    this.createNature('top');
    

    // this.topLayer = this.map.createLayer('topLayer');
    // this.map.setCollisionBetween(1, 1000, true, 'topLayer');
    
    this.background.x = this.player.x;
    this.background.y = this.player.y;
    
    TopDownGame.game.input.gamepad.start();
    
    pad = TopDownGame.game.input.gamepad.pad2;
    

    
    this.cursorController(TopDownGame.Game);
    

    // this.emitter = this.game.add.emitter(this.player.x,this.player.y, 0, 100);
    // this.emitter.makeParticles('ground');
    // this.emitter.minParticleSpeed.setTo(-100, 30);
    // this.emitter.maxParticleSpeed.setTo(30, 100);
    // this.emitter.minParticleScale = 0.1;
    // this.emitter.maxParticleScale = 0.1;
    // this.emitter.gravity = 1;
    // this.emitter.flow(200, 100, 5, -1);
    
  },
  createItems: function() {
    //create items
    this.items = this.game.add.group();
    this.items.enableBody = true;
    var item;    
    result = this.findObjectsByType('item', this.map, 'objectLayer');
    result.forEach(function(element){
      this.createFromTiledObject(element, this.items);
    }, this);
  },
  //find objects in a Tiled layer that containt a property called "type" equal to a certain value
  findObjectsByType: function(type, map, layer) {
    var result = new Array();
    map.objects[layer].forEach(function(element){
      if(element.properties.type === type) {
        element.y -= map.tileHeight;
        result.push(element);
      }      
    });
    return result;
  },
  //create a sprite from an object
  createFromTiledObject: function(element, group) {
    var sprite = group.create(element.x, element.y, element.properties.sprite);

      //copy all properties to the sprite
      Object.keys(element.properties).forEach(function(key){
        sprite[key] = element.properties[key];
      });
  },
  update: function() { //////////////////////////////////update
    if (this.game.input.gamepad.supported && this.game.input.gamepad.active && this.game.input.gamepad.pad2.connected){
        // console.log('controller enable');
        controlEnabled = true;
    }
    else{
      controlEnabled = false;
    }

    //collision
    this.player.customParams.collidingWidth = '';
    this.game.physics.arcade.collide(this.player, this.barriers, this.collect, null, this);
    this.game.physics.arcade.collide(this.player, this.movables);

    this.game.physics.arcade.collide(this.movables, this.barriers);
    this.game.physics.arcade.collide(this.movables, this.movables);
    this.resetMovableVelocity();
    this.playerBlock.customParams.overlaping = false;
    this.game.physics.arcade.overlap(this.playerBlock, this.movables, this.blockColliding, null, this);
    if(this.playerBlock.customParams.overlaping == false){
      // this.playerBlock.x = -50;
      // this.playerBlock.y = -50;
      this.player.customParams.blockSummoned = false;
    }
    
    this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);
    this.resetOpacTree();
    this.game.physics.arcade.overlap(this.player, this.treeTops, this.opacTree ,null, this);
    //player movement
    

    
    
    

    
    TopDownGame.playerMove(TopDownGame.Game);
    this.cursorController();
  },
  render: function(){
    // console.log(this.movables)
    // this.game.debug.body(this.movables.children[0]);
    // this.barriers.forEach(function(element){
    //      this.game.debug.body(element);
    // },this);
    // this.movables.forEach(function(element){
    //      this.game.debug.body(element);
    // },this);
    // this.game.debug.body(this.playerBlock);
  },
  collect: function(player, collectable) {
    console.log('yummy!');

    //remove sprite
    // collectable.destroy();
  },
  resetMovableVelocity : function(){
    this.movables.forEach(function(element){
        element.body.velocity.x = 0;
        element.body.velocity.y = 0;
        element.body.immovable = true;
    },this);
  },
  blockColliding: function(playerBlock, block){
     // if(block.body.immovable == true){
      block.body.immovable = false;
      this.playerBlock.customParams.overlaping = true;
      // block.alpha = 0.6;
     // }
     // else{
     //  block.body.immovable = true;
     //  block.alpha = 1;
     // }
     // playerBlock.x = -50;
     // playerBlock.y = -50;
     // console.log("get");
  },
  opacTree : function(player,tree){
    tree.alpha = 0.4;
    // this.game.add.tween(tree).to({ alpha: 0.5 }, 1, Phaser.Easing.Linear.None, true, 0);
  },
  resetOpacTree : function(){
    this.treeTops.forEach(function(element){
         element.alpha = 1;
    },this);
  },
  createNature: function(z){
    
    //barriers
    if(z == 'bottom'){
      this.barriers = this.add.group();
      this.barriers.enableBody = true;
      this.draws = this.add.group();
      this.movables = this.add.group();
      this.movables.enableBody = true;
      walkable_data = this.map.layers[0].data;
      var cell;
    
      
      for (var i =0; i<this.map.width; i++) {
        for(var j=0; j<this.map.height; j++){
          cell = walkable_data[i][j];
          
          if (cell && cell.index == 1){
            var temp1 = this.map.getTile(cell.x,cell.y)
            var tempX1 = temp1.worldX;
            var tempY1 = temp1.worldY;
            var draw = this.draws.create(tempX1+26, tempY1+12, 'treeBottom');
            draw.anchor.setTo(0.5,0.5);
            this.draws.add(draw);
            var barrier = this.barriers.create(tempX1, tempY1, 'ground');
            barrier.alpha = 0; 
            barrier.body.height /= 2;
            barrier.body.width /= 2;
            barrier.body.offset.setTo(+6, +4);
            this.barriers.add(barrier);
          }
          else if (cell && cell.index == 5){
            var temp1 = this.map.getTile(cell.x,cell.y)
            var tempX1 = temp1.worldX;
            var tempY1 = temp1.worldY;
            var barrier = this.barriers.create(tempX1, tempY1, 'ground');
            barrier.alpha = 0; 
            barrier.body.height /= 2;
            barrier.body.width /= 2;
            barrier.body.offset.setTo(+6, +4);
            this.barriers.add(barrier);
          }
          else if (cell && cell.index == 3){
            var temp1 = this.map.getTile(cell.x,cell.y)
            var tempX1 = temp1.worldX;
            var tempY1 = temp1.worldY;
            var barrier = this.barriers.create(tempX1, tempY1, 'ground');
            barrier.alpha = 0; 
            this.barriers.add(barrier);
          }
          else if (cell && cell.index == 4){
            var temp1 = this.map.getTile(cell.x,cell.y)
            var tempX1 = temp1.worldX;
            var tempY1 = temp1.worldY;
            var movable = this.movables.create(tempX1, tempY1, 'box');
            movable.body.width = movable.width/1.3;
            // movable.body.height = movable.height/2;
            movable.customParams = {
              blocked: true,
            }
            movable.body.offset.setTo(+3.5, +0);
            this.movables.add(movable);
          }
        }
      }
      this.barriers.setAll('body.immovable', true);
      this.movables.setAll('body.immovable', true);

    }
    else{
      this.treeTops = this.add.group();
      this.treeTops.enableBody = true;
      walkable_data = this.map.layers[0].data;
      var cell;
    
      
      for (var i =0; i<this.map.width; i++) {
        for(var j=0; j<this.map.height; j++){
          cell = walkable_data[i][j];
          
          if (cell && cell.index == 1) {
            var temp1 = this.map.getTile(cell.x,cell.y)
            var tempX1 = temp1.worldX;
            var tempY1 = temp1.worldY;
            var treeTop = this.treeTops.create(tempX1+28, tempY1+2, 'treeTop');
            treeTop.anchor.setTo(0.5,0.5);
            treeTop.x = treeTop.x-5;
            treeTop.y = treeTop.y-treeTop.height/3.4;
            // treeTop.body.width /=3;
            treeTop.body.height /= 3; 
            this.treeTops.add(treeTop);
          }
        }
      }
      this.treeTops.setAll('body.immovable', true);
    } 
  },
  cursorController: function(){
    this.marker.x = this.backgroundlayer.getTileX(this.game.input.activePointer.worldX) * 25;
    this.marker.y = this.backgroundlayer.getTileY(this.game.input.activePointer.worldY) * 25;

    if (this.game.input.activePointer.isDown && this.clicked == false){
        // TopDownGame.findPath(this.player, this.marker);
        var temp1 = this.map.getTile(this.backgroundlayer.getTileX(this.marker.x),this.backgroundlayer.getTileY(this.marker.y));
        console.log(temp1)
        this.clicked = true;
    }

    if(this.game.input.activePointer.isUp && this.clicked==true){
      this.clicked = false;
    }
  },

};