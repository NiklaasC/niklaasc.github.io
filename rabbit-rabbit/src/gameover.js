var rabbit = rabbit || {};

rabbit.GameoverState = function() {}

rabbit.GameoverState.prototype = {
	init: function( score,maxBun,playerDead ) {
		this.bunsRescued = score;
		this.playerDead = playerDead;
		this.maximumBun = maxBun;
	},
	create: function() {
		//	Add background
		//	Use image if no animation or physics is required
		this.add.image(0,0, "sky");

		//	Create a carrot group for ... carrots
		// this.bunnies = this.game.add.group();

		//	Add input
		//	If input gets very complex it may be better to create its own object
		//	But for now it's fine as it is ...
		this.spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);//this.game.input.keyboard.createCursorKeys();
		var string = " buns!"
		var style = { font: "Arial 20px bold", fill: "#000000"};
		this.rescueText = this.game.add.text(20,20, " ", style);
		this.resetText = this.game.add.text(20,60, "Press spacebar to play again!", style);
		if (this.playerDead == true){
			this.rescueText.setText("You died!");
		} else {
			if (this.bunsRescued == 0) {
				this.rescueText.setText("You failed to rescue a single bun!")
			} else if (this.bunsRescued == 1) {
				this.rescueText.setText("You rescued a single bun!");
			} else if (this.bunsRescued == this.maximumBun) {
				this.rescueText.setText("You rescued every single bun!")
			} else {
				this.rescueText.setText("You rescued " + this.bunsRescued + " buns!" );
			}
		}
	},
	update: function() {
		if (this.spaceBar.isDown ) {
			this.state.start("GameState");
		}
	},
	restartLevel: function() {
		//	Reset game ...
		this.bun.reset();
		this.fox.reset();
	}
};
