var TopDownGame = TopDownGame || {};

// make a graph from tiled map
TopDownGame.initGraph = function(map){
  this.map = map;
  var walkable_data_index = _.findIndex(this.map.layers, function(layer) {
    return layer.name == "backgroundLayer";
  });
  // console.log(walkable_data_index)
  walkable_data = this.map.layers[walkable_data_index].data;
  // console.log(walkable_data)
  var game_grid = Array(313).fill().map(()=> []);
  var cell;

  // populate the grid with value 1 if the tile is walkable
  for (var i =0; i<this.map.width; i++) {
    for(var j=0; j<this.map.height; j++){
      cell = walkable_data[i][j];
      
      if (cell && (cell.index == 2 || cell.index == 4) ) {
        game_grid[cell.x][cell.y] = 1;
      }
      else{
        game_grid[cell.x][cell.y] = 0;
      }
    }
  }

  this.graph = new Graph(game_grid);
  return this.graph;
};

TopDownGame.findPath = function (follower, mouse) {
  this.follower = follower;
  var followerX = Math.floor (this.follower.x/ this.map.tileWidth),
    followerY = Math.floor (this.follower.y/ this.map.tileHeight),
    mouseX = Math.floor (mouse.x / this.map.tileWidth),
    mouseY = Math.floor (mouse.y / this.map.tileHeight);

  var start = this.graph.node_grid[followerX][followerY];
  var dest = this.graph.node_grid[mouseX][mouseY];

  this.follower.customParams.path = PathFinder.a_star_search(start, dest, this.graph);

  this.follower.customParams.path_counter = 0;
};


TopDownGame.traverse = function(player){
  this.player = player;
  var length = this.player.customParams.path.length;
  var velocity;

  var destX = this.player.customParams.path[length -1].x * this.map.tileWidth;
  var destY = this.player.customParams.path[length -1].y * this.map.tileHeight;

  if (this.player.customParams.path.length > 0) {
    this.next_pos = this.player.customParams.path[this.player.customParams.path_counter];
    this.player.customParams.traverse.x = this.next_pos.x * this.map.tileWidth;
    this.player.customParams.traverse.y = this.next_pos.y * this.map.tileHeight;
    velocity = new Phaser.Point(this.player.customParams.traverse.x - (this.player.x), this.player.customParams.traverse.y - (this.player.y));
    var abs_v_x = Math.abs(velocity.x);
    var abs_v_y = Math.abs(velocity.y);
    this.player.customParams.state = 'walking';
    if (velocity.x > 0 && abs_v_x >= abs_v_y) {
      this.player.customParams.face = 'right';
    }
    else if (velocity.x < 0 && abs_v_x >= abs_v_y) {
      this.player.customParams.face = 'left';
    }
    if (velocity.y < 0 && abs_v_x <= abs_v_y) {
      this.player.customParams.face = 'up';
    }
    else if (velocity.y > 0 && abs_v_x <= abs_v_y) {
      this.player.customParams.face = 'down';
    }

    var target_position = new Phaser.Point(this.player.customParams.traverse.x, this.player.customParams.traverse.y);
    if( !this.reached_target (this.player, target_position)){
      // console.log(this.player.customParams.traverse.x);
      TopDownGame.game.physics.arcade.moveToXY(this.player, this.player.customParams.traverse.x, this.player.customParams.traverse.y, this.player.customParams.player_velocity);
    }
    else{
      if (this.player.customParams.path_counter < length -1) {
        this.player.customParams.path_counter +=1;
      }
      else {
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
        this.player.customParams.path = [];
        this.player.customParams.path_counter = -1;
        this.next_pos = null;
      }
    }
   }
}
TopDownGame.reached_target = function (follower, target) {
  var current_position = new Phaser.Point(follower.x, follower.y);
  var distance = Phaser.Point.distance(current_position, target);
  if(distance < 4){
    this.followerTime = TopDownGame.game.add.tween(follower).to({ x: target.x, y: target.y }, 1, Phaser.Easing.Linear.None, true, 0);
    return true;
  }
  return false;
}





///////////////////////////////////////////////////////game controls//////////////////////////////////77
TopDownGame.createControls = function(game){

  // console.log("creat")
    game.cursors = game.game.input.keyboard.createCursorKeys();
    game.cursors = {
      up: game.game.input.keyboard.addKey(Phaser.Keyboard.W),
      down: game.game.input.keyboard.addKey(Phaser.Keyboard.S),
      left: game.game.input.keyboard.addKey(Phaser.Keyboard.A),
      right: game.game.input.keyboard.addKey(Phaser.Keyboard.D),
      action: game.game.input.keyboard.addKey(Phaser.Keyboard.P),
    };
}