//	Use (or create) RabbitRabbit namespace ...
var rabbit = rabbit || {};

//	Each state is a function which is handled by RabbitRabbit.game
rabbit.BootState = function() {};

//	Define the prototype for the Boot function to define behaviour
rabbit.BootState.prototype = {
	preload: function() {
		//	Load assets for loading assets ...
		this.game.load.image("logo", "./res/logo.png");
	},
	create: function() {
		//	Set Phaser scaling information and settings ...
		//	Set background colour
		this.game.stage.backgroundColor = "#3c99d0";

		//	Can either set scaling options here, or can set it manually
		//	Using HTML and CSS

		//	Set scaling options
		//	SHOW_ALL - Shows the entire game while maintaining proportions
		//	NO_SCALE - Prevents any scaling
		//	EXACT_FIT- Streched to fill all avaliable space
		//	RESIZE - Changes the Game size to fit the display size
		//	USER_SCALE - User specified by setUserScale
		this.scale.scaleMode = Phaser.ScaleManager.NO_SCALE; //NO_SCALE;

		//	Put the game in the center of the screen
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;

		//	Activate scaling
		this.scale.setScreenSize = true;

		//	Start physics system for movement
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		//	Start Preloading assets
		this.state.start("PreloadState");
	},
};
