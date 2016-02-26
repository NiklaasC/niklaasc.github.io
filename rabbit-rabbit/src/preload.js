var rabbit = rabbit || {};

rabbit.PreloadState = function() {};

rabbit.PreloadState.prototype = {
	preload: function() {
		this.preloadBar = this.add.sprite(this.game.world.centerX,this.game.world.centerY, "logo");
		this.preloadBar.anchor.setTo(0.5);

		// Use quick and easy preload bar ... can also use this.load.progress (0-100)
		this.load.setPreloadSprite(this.preloadBar, 1);

		// Load game assets ...
		// this.load.image("sky", "./res/sky.png");
		// Tilesets for Tiled maps must have exactly matching names!
		this.load.image("block", "./res/block.png");
		this.load.spritesheet("foxSprites", "./res/foxspritesheetsmall.png", 64,64)
		// this.load.image("fox", "./res/fox.png");
		// this.load.image("foxbody", "./res/foxbody.png");
		this.load.spritesheet("bun", "./res/bun.png", 12,28);
		this.load.spritesheet("tinybabybunny", "./res/tinybabybunny.png", 11,12);
		this.load.tilemap("map", "./res/map.json", null, Phaser.Tilemap.TILED_JSON);
	},
	create: function() {
		// Start the game ...
		this.state.start("GameState");
	},
};
