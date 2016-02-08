var rabbit = rabbit || {};

rabbit.GameState = function() {}

rabbit.GameState.prototype = {
	// init: function() {},
	create: function() {
		//	Add input
		//	If input gets very complex it may be better to create its own object
		//	But for now it's fine as it is ...

		this.stateInput = this.game.input.keyboard.createCursorKeys();
		//	Add background
		//	Use image if no animation or physics is required
		this.add.image(0,0, "sky");

		//	Add map data
		this.map = this.game.add.tilemap("map");
		this.map.addTilesetImage("block", "block", 16,16);

		//	Load level
		this.level = this.map.createLayer("tiles");
		//	Set tiles to collide with
		//	Tiles are indexed from 1 in this case ...
		this.map.setCollision(1);
		//	Call this to set the world size to match the size of the level
		this.level.resizeWorld();

		//	Create a carrot group for ... carrots
		this.bunnies = this.game.add.group();
		//this.car = this.game.add.group();
		//this.bunnies.visible = true;
		//this.bunnies.enableBody = true;
		//this.car.visible = true;
		//this.car.enableBody = true;

		//	Using enableBody there is no X or Y info for sprites. Commenting out group.enableBody means we get an X value at least ....


		// this.game.world.bringToTop(this.bunnies);



		//	Create sprites from objects ...
		this.map.createFromObjects("carrotLayer", 4, "tinybabybunny", 1, true, false, this.bunnies, rabbit.TinyBabyBunny, true);
		this.bunniesRemaining = this.bunnies.length;
		//this.map.createFromObjects("carrotLayer", 3, "block2", 1, true, false, this.carrot, Phaser.Sprite, false);

		//	BUG HUNTING SETTING adjustY is causing sprite.y to be NaN ... but the sprites are still not visible!!!!!!
		//	Phaser line 89082

		// this.carrotSprites.setAll('anchor.x', 0.5);
		// this.carrotSprites.setAll('anchor.y', 0.5);
/*		console.log("carrot " + this.carrotSprites.length);
		console.log(this.carrotSprites.x + " " + this.carrotSprites.y);
		console.log(this.carrotSprites.children[5].x + " " + this.carrotSprites.children[5].y);
		console.log(this.carrotSprites.children[10].x + " " + this.carrotSprites.children[10].y);
		console.log(this.carrotSprites.children[18].x + " " + this.carrotSprites.children[18].y);
		console.log(this.carrotSprites.children[5].visible);
		console.log(this.carrotSprites.children[5].exists);
		console.log("carrot " + car.length);
		console.log(car.x + " " + car.y);
		console.log(car.children[5]);*/

		//	Add player data
		this.bun = new rabbit.Bun(this.game, 100,100, this.stateInput);
		this.playerDead = false;
		//	Add Fox data
		this.fox = new rabbit.Fox(this.game, 200,0, this.bun, this.bunnies);

		var style = { font: "Arial 20px bold", fill: "#000000"};
		this.rescueText = this.game.add.text(20,20, "Rescued Buns: " + this.bun.bunsRescued, style);
		this.remainingText = this.game.add.text(370,20, this.bunniesRemaining, style);
	},
	update: function() {
		//	Calculate collisions before input for reliability 100% of the time
		//	As bun, fox etc are abstracted away...
		//	I assume this runs before everything else is updated(!)
		this.game.physics.arcade.collide(this.bun, this.level);

		this.game.physics.arcade.overlap(this.bun, this.bunnies, this.removeSprite, null, this);
		this.game.physics.arcade.overlap(this.fox, this.bunnies, this.removeSprite, null, this);

		//	Has the fox caught the bun? If so ... Restart ... for now
		if (this.game.physics.arcade.distanceBetween(this.fox, this.bun) <= 10) {
			this.playerDead = true;
			this.restartLevel();
		}
	},
	restartLevel: function() {
		//	Reset game ...
		// this.bun.reset();
		// this.fox.reset();
		this.state.start("GameoverState", true, false, this.bun.bunsRescued, this.bunnies.length, this.playerDead);
	},
	removeSprite: function( player, sprite ){
		// Remove sprite ...
		if (player === this.bun) {
			this.bun.bunsRescued += 1;
		}
		this.bunniesRemaining -= 1;
		this.rescueText.setText("Rescued Buns: " + this.bun.bunsRescued)
		this.remainingText.setText(this.bunniesRemaining)
		sprite.kill();
		if (this.bunniesRemaining == 0 ) {
			this.restartLevel();
		}
	}
};
