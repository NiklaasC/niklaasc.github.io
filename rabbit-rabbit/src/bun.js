//	Bun (Player) entity for RabbitRabbit
var rabbit = rabbit || {};

rabbit.Bun = function(game, x, y, keyInput, padInput, touchInput) {
	//	Create sprite
	Phaser.Sprite.call(this, game, x, y, "bun");

	//	Sprite info
	this.anchor.setTo(0.5, 0.5);
	this.game.physics.arcade.enable(this);
	//	this.body.bounce.y = 0;
	this.body.gravity.y = 600;

	//	Pass references
	// this.game = game;
	this.keyInput = keyInput;
  this.padInput = padInput;
  this.touchInput = touchInput;
	this.originX = x;
	this.originY = y;

	this.bunsRescued = 0;

	//	Add animations
	this.animations.add("left", [0,1,2,3], 8, true);
	this.animations.add("right", [5,6,7,8], 8, true);
	this.animations.add("stand", [4], 8, false);

	//	Add this sprite to the game
	this.game.add.existing(this);
};

rabbit.Bun.prototype = Object.create(Phaser.Sprite.prototype);
rabbit.Bun.prototype.constructor = rabbit.Bun;
rabbit.Bun.prototype.update = function() {
	//	Handle player input
	//	Zero movement
	this.body.velocity.x = 0;

	//	Is Bun going left, right or standing still
	if (this.keyInput.left.isDown || this.padInput.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1 || this.touchInput.isGoingLeft) {
		this.body.velocity.x = -150;
		this.animations.play("left");
	} else if (this.keyInput.right.isDown || this.padInput.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1 || this.touchInput.isGoingRight) {
		this.body.velocity.x = 150;
		this.animations.play("right");
	} else {
		this.animations.play("stand");
	}
	//	Jump! if bun is standing on the ground ...
	if (this.keyInput.up.isDown || this.padInput.justPressed(Phaser.Gamepad.XBOX360_A) || this.touchInput.isJumping) {
		if (this.body.onFloor()) {
			this.body.velocity.y = -300;
		}
	}
};
rabbit.Bun.prototype.reset = function() {
	//	Quick and dirty reset
	//	No longer used, but it might come in handy!
	this.position.x = this.originX;
	this.position.y = this.originY;
	this.body.velocity.x = 0;
	this.body.velocity.y = 0;
};