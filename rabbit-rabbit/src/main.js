//	Create a variable as a namespace: If the variable exists use that, otherwise create a new object
var rabbit = rabbit || {};

//	Create a Phaser.Game object
rabbit.game = new Phaser.Game(400,400, Phaser.AUTO, "");

//	Add Phaser states
rabbit.game.state.add("BootState", rabbit.BootState);					//	Boot to load preloader assets (quickly) and init Phaser variables e.g. Resolution
rabbit.game.state.add("PreloadState", rabbit.PreloadState);		//	Preload actual game assets (slower)
rabbit.game.state.add("GameState", rabbit.GameState);					//	The Game itself (Note: not game, but Game!)
rabbit.game.state.add("GameoverState", rabbit.GameoverState);					//	The Game itself (Note: not game, but Game!)

//	Start the Boot process ...
rabbit.game.state.start("BootState");
