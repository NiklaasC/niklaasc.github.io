var rabbit = rabbit || {};

rabbit.GameoverState = function() {}

rabbit.GameoverState.prototype = {
	init: function( score,maxBun,playerDead ) {
		this.bunsRescued = score;
		this.playerDead = playerDead;
		this.maximumBun = maxBun;
	},
	create: function() {
		//	Variables
		var style = { font: "Arial 20px bold", fill: "#000000"};
		//	Add background
		//	Use image if no animation or physics is required, otherwise sprite
		this.add.image(0,0, "sky");

		//	Add input
		//	If input gets very complex it may be better to create its own object
		//	But for now it's fine as it is ...
		this.spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);//this.game.input.keyboard.createCursorKeys();

		//	Add text
		this.rescueText = this.game.add.text(20,20, " ", style);
		this.resetText = this.game.add.text(20,60, "Press spacebar to play again!", style);

		//	Decide on text based on the number of buns rescued, and whether the player is still alive!
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
		//	Go back to the play-state if the spacebar is pressed
		if (this.spaceBar.isDown ) {
			this.state.start("GameState");
		}
	}
};
