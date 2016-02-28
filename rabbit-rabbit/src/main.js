//	Create a variable as a namespace: If the variable exists use that, otherwise create a new object
var rabbit = rabbit || {};

// Change the aspect ratio of the canvas to that of the opening element
var wWidth = window.innerWidth ;
var wHeight = window.innerHeight;
var aspectRatio = wWidth/wHeight;
var gameSize = 400;
var gameWidth;
var gameHeight;
if (wWidth > wHeight) {
  gameWidth = gameSize*aspectRatio;
  gameHeight = gameSize;
} else {
  gameWidth = gameSize;
  gameHeight = gameSize/aspectRatio;
}


rabbit.game = new Phaser.Game(gameWidth,gameHeight, Phaser.AUTO, "");

//	Add Phaser states
rabbit.game.state.add("BootState", rabbit.BootState);					//	Boot to load preloader assets (quickly) and init Phaser variables e.g. Resolution
rabbit.game.state.add("PreloadState", rabbit.PreloadState);		//	Preload actual game assets (slower)
rabbit.game.state.add("GameState", rabbit.GameState);					//	The Game itself (Note: not game, but Game!)
rabbit.game.state.add("GameoverState", rabbit.GameoverState);					//	The Game itself (Note: not game, but Game!)

//	Start the Boot process ...
rabbit.game.state.start("BootState");
