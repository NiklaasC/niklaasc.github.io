//	FOX refactor for RabbitRabbit
var rabbit = rabbit || {};

rabbit.Fox = function(game, x, y, player, bunnies){
	//	Create sprite
	Phaser.Sprite.call(this, game, x, y, "fox");

	//	Sprite info
	this.anchor.setTo(0.5, 0.5);
	this.game.physics.arcade.enable(this);

	//	Pass references
	//	this.game = game; //	Set automatically!
	this.player = player;		// The player
	this.bunnies = bunnies;	// All the bunnies
	this.bunTarget;					// The target of fox!
	//	This reference is used to spawn segments and for fox reset (for now)
	this.originX = x;
	this.originY = y;

	//	Object variables
	this.path = [];
	this.segments = [];

	for (var i = 1;  i <= 8 -1; i++) {
		this.segments[i] = this.game.add.sprite(this.originX,this.originY, "foxbody");
		this.segments[i].anchor.setTo(0.5);
	}

	for (var i = 0; i <= 8*20; i++) {
		var p = {x:this.originX, y:this.originY};
		this.path[i] = p;
	}

	//	Add this sprite to the game
	this.game.add.existing(this);
};

//	CONSTANTS GO HERE
//	RR.Fox.rotateSpeed = 22;

//	Don't override the whole prototype!
rabbit.Fox.prototype = Object.create(Phaser.Sprite.prototype);
rabbit.Fox.prototype.constructor = rabbit.Fox;
rabbit.Fox.prototype.update = function() {
	var bunnySearch;
	var distance;
	var closestBunDistance;
	var closestBun;

	// Search for the cloeset bunny
	// for each bun
	for (bunnySearch = 0; bunnySearch < this.bunnies.length; bunnySearch++) {
		// if they are alive!
		if (this.bunnies.children[bunnySearch].alive) {
			// grab the distance
			distance = this.game.physics.arcade.distanceBetween(this, this.bunnies.children[bunnySearch]);
			if (!closestBunDistance) {
				closestBunDistance = distance;
				closestBun = this.bunnies.children[bunnySearch];
			} else if (distance < closestBunDistance ) {
				closestBunDistance = distance;
				closestBun = this.bunnies.children[bunnySearch];
			}
		}
	}

	// If distance to the player is smaller go to player, else seek bun!
	// If closestBun is undefined ... so for example ... if there are no buns!
	if (!closestBun) {
		// Just follow the player!
		this.game.physics.arcade.moveToObject(this, this.player, 80);
	} else {
		if (this.game.physics.arcade.distanceBetween(this,this.player) < closestBunDistance ) {
			this.game.physics.arcade.moveToObject(this, this.player, 80);
		} else {
			this.game.physics.arcade.moveToObject(this, closestBun, 80);
		}
	}


	var temp = this.path.pop();
	temp.x = this.x;
	temp.y = this.y;
	this.path.unshift(temp);

	//	Update foxBody
	for (var i = 1; i <= 8 - 1; i++) {
		this.segments[i].x = (this.path[i * 10]).x;
		this.segments[i].y = (this.path[i * 10]).y;
	}

	if (this.game.physics.arcade.distanceBetween(this, this.player) <= 10) {
		//	Call for action!
	}
};
rabbit.Fox.prototype.reset = function() {
	//	Reset fox ...
	this.position.x = this.originX;
	this.position.y = this.originY;
	this.body.velocity.x = 0;
	this.body.velocity.y = 0;

	for (var i = 0; i <= 8*20; i++) {
		var p = {x:this.originX, y:this.originY};
		this.path[i] = p;
	}
};
