var rabbit = rabbit || {};

rabbit.GameState = function() {}

rabbit.GameState.prototype = {
	// init: function() {},
	create: function() {
		//	Local variables
		var style = { font: "Arial 20px bold", fill: "#000000"};

		//	Add input
		//	If input gets very complex it may be better to create its own object
		//	But for now it's fine as it is ... note: DO NOT call this variale input ... Phaser thinks it's a nested input object
		//	It will throw destroy() is not a function (member function) of input because it thinks input inherited from phaser.input
		this.stateInput = this.game.input.keyboard.createCursorKeys();

		//	Add background
		//	Use image if no animation or physics is required
		//	this.add.image(0,0, "sky");

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

		//	Create a group for all the bunnies
		this.bunnies = this.game.add.group();

		//	Create sprites from objects ... in the tiled map
		this.map.createFromObjects("bunnies", 2, "tinybabybunny", 1, true, false, this.bunnies, rabbit.TinyBabyBunny, true);
		//	The final true is required to correctly align all the sprites.
		//	Find out how many bunnies there are. There are an arbitrary number in the levels ...
		this.bunniesRemaining = this.bunnies.length;

		//	Add player data
		this.bun = new rabbit.Bun(this.game, 100,100, this.stateInput);
		this.playerDead = false;

		//	Add Fox data////////////////////////////////////////////////////////////////////////////////////////////////////////
		//	this.fox = new rabbit.Fox(this.game, 200,0, this.bun, this.bunnies);
		this.originalX = 200;
		this.originalY = 0;
		// FOX.game.physics arcade.enable(this.foxHead);
		//	set anchor
		this.foxPath = [];
		this.foxBody = [];
		var i;
		var j;
		//	8 segments (excluding the head and leg overlay)
		for (i = 7; i >= 0; i -= 1) {
			if (i===1) {
				this.foxBody[8] = rabbit.game.add.sprite(this.originalX,this.originalY,"foxSprites",9);
				this.foxBody[8].anchor.setTo(0.5,0.5);
				rabbit.game.physics.arcade.enable(this.foxBody[8]);
				this.foxBody[8].scale.x = -1;
			}
			this.foxBody[i] = rabbit.game.add.sprite(this.originalX,this.originalY,"foxSprites",i+1);
			this.foxBody[i].anchor.setTo(0.5,0.5);
			rabbit.game.physics.arcade.enable(this.foxBody[i]);
			this.foxBody[i].scale.x = -1;
		}
		//	Add Fox head
		this.foxHead = rabbit.game.add.sprite(this.originalX,this.originalY,"foxSprites",0);
		this.foxHead.anchor.setTo(0.5,0.75);
		rabbit.game.physics.arcade.enable(this.foxHead);
		this.foxHead.scale.x = -1;
		//	this.foxHead.body.allowRotation = true;
		this.foxHead.body.setSize(32, 32, 0, 0);
		//	preload the path
		for (j = 0; j < 9*60; j +=1) {
			this.foxPath[j] = {x: this.originalX, y: this.originalY};
		}
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		//	Add bun statistics!
		this.rescueText = this.game.add.text(20,20, "Rescued Buns: " + this.bun.bunsRescued, style);
		this.remainingText = this.game.add.text(370,20, this.bunniesRemaining, style);
	},
	update: function() {
		//	Calculate collisions before input for reliability 100% of the time
		//	As bun, fox etc are abstracted away...
		//	I assume this runs before everything else is updated(!)
		this.game.physics.arcade.collide(this.bun, this.level);
		
		//////////////////////////////////////////////////////////////////////////////////////////////////
		var i;
		var temp = this.foxPath.pop();
		temp.x = this.foxHead.x;
		temp.y = this.foxHead.y;
		this.foxPath.unshift(temp);
		
		for (i=0; i<8; i+=1) {
			//	i*10 = foxHead
			//	i+1 gives an offset to start the rest of the body
			this.foxBody[i].x = this.foxPath[(i+1)*10].x;
			this.foxBody[i].y = this.foxPath[(i+1)*10].y;
			
			if (i===0) {
				this.foxBody[i].rotation = rabbit.game.physics.arcade.angleBetween(this.foxBody[i],this.foxHead);
			} else {
				this.foxBody[i].rotation = rabbit.game.physics.arcade.angleBetween(this.foxBody[i],this.foxBody[i-1]);
			}
			
			//	As I am manually updating the positions deltaX etc don't work
			//	I have to use position.x vs previousPosition.x
			if (this.foxBody[i].position.x > this.foxBody[i].previousPosition.x) {
				this.foxBody[i].scale.y = 1;
			} else {
				this.foxBody[i].scale.y = -1;
			}
		}
		this.foxBody[8].position.x = this.foxBody[3].position.x;
		this.foxBody[8].position.y = this.foxBody[3].position.y;
		this.foxBody[8].rotation = this.foxBody[3].rotation;
		this.foxBody[8].scale.y = this.foxBody[3].scale.y;
		
		if (this.foxHead.body.deltaX() > 0) {
			this.foxHead.scale.y = 1;
		} else {
			this.foxHead.scale.y = -1;
		}
		
		////////////////////////2////////////////////////////////////////////////////////////////////////////////////
		var bunnySearch;
		var distance;
		var closestBunDistance;
		var closestBun;
		var temp;

		// Search for the cloeset bunny
		// for each bun
		for (bunnySearch = 0; bunnySearch < this.bunnies.length; bunnySearch++) {
			// if they are alive!
			if (this.bunnies.children[bunnySearch].alive) {
				// grab the distance
				distance = this.game.physics.arcade.distanceBetween(this.foxHead, this.bunnies.children[bunnySearch]);
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
			this.game.physics.arcade.moveToObject(this.foxHead, this.bun, 80);
			this.foxHead.rotation = rabbit.game.physics.arcade.angleBetween(this.foxHead, this.bun);
		} else {
			if (this.game.physics.arcade.distanceBetween(this.foxHead,this.bun) < closestBunDistance ) {
				this.game.physics.arcade.moveToObject(this.foxHead, this.bun, 80);
				this.foxHead.rotation = rabbit.game.physics.arcade.angleBetween(this.foxHead, this.bun);
			} else {
				this.game.physics.arcade.moveToObject(this.foxHead, closestBun, 80);
				this.foxHead.rotation = rabbit.game.physics.arcade.angleBetween(this.foxHead, closestBun);
			}
		}
		/////////////////////////2////////////////////////////////////////////////////////////////////////////////////
		
		//this.foxHead.rotation = rabbit.game.physics.arcade.angleBetween(this.foxHead, FOX.game.input.activePointer);
		//FOX.game.physics.arcade.moveToPointer(this.foxHead, 240);
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
		//	Is the player overlapping the bunnies -> rescue them
		this.game.physics.arcade.overlap(this.bun, this.bunnies, this.removeSprite, null, this);
		//	Is the fox overlapping the bunnies -> :(
		this.game.physics.arcade.overlap(this.foxHead, this.bunnies, this.removeSprite, null, this);

		//	Has the fox caught the player bun? If so end the game
		this.game.physics.arcade.overlap(this.foxHead, this.bun, this.dieDieDie, null, this);
		//if (this.game.physics.arcade.distanceBetween(this.foxHead, this.bun) <= 10) {
		//	this.playerDead = true;
		//	this.endLevel();
		//}
	},
	//render: function() {
		//this.game.debug.spriteBounds(this.foxHead);
//		this.game.debug.body(this.foxHead)
//		this.game.debug.body(this.bun)
//	},
	dieDieDie: function() {
		this.playerDead = true;
		this.endLevel();
	},
	endLevel: function() {
		//	Go to gameover state ... take the player info and bunnies info with you ...
		this.state.start("GameoverState", true, false, this.bun.bunsRescued, this.bunnies.length, this.playerDead);
	},
	removeSprite: function( entity, sprite ){
		//	Remove sprite ...
		//	If it was the player, add the bun to the rescued list ...
		if (entity === this.bun) {
			this.bun.bunsRescued += 1;
		}
		//	Otherwise and also, just get rid of the bun!
		this.bunniesRemaining -= 1;
		//	Update text
		this.rescueText.setText("Rescued Buns: " + this.bun.bunsRescued)
		this.remainingText.setText(this.bunniesRemaining)
		//	Remove the actual sprite
		sprite.kill();
		//	If there are no more buns ... end the level
		if (this.bunniesRemaining == 0 ) {
			this.endLevel();
		}
	}
};
