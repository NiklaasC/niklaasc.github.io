//	TinyBabyBunny Entity
var rabbit = rabbit || {};

rabbit.TinyBabyBunny = function(game, x, y, key, frame) {
	Phaser.Sprite.call(this, game, x, y, key, frame);

	// Sprite info - All of this was already set by the group
	// But it's better to set it here to individually control functions
	// this.anchor.setTo(0.5, 0.5);
	this.game.physics.arcade.enable(this);
	// this.enableBody = true;
	this.animations.add("bun", [0,1], 2, true);
};

rabbit.TinyBabyBunny.prototype = Object.create(Phaser.Sprite.prototype);
rabbit.TinyBabyBunny.prototype.constructor = rabbit.TinyBabyBunny;

rabbit.TinyBabyBunny.prototype.update = function() {
	this.animations.play("bun");
};
