var TopDownGame = TopDownGame || {};

TopDownGame.Barriers = function(game, x, y, name) {
  Phaser.Sprite.call(this, game, x, y, name);
  
  this.customParams = {
  	name: name,
  }
};

TopDownGame.Barriers.prototype = Object.create(Phaser.Sprite.prototype);
TopDownGame.Barriers.prototype.constructor = TopDownGame.Barriers;