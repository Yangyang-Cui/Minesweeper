/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, DyePack, Hero, Minion, Brain,
  GameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict"; // Operate in Strict mode such that variables must be declared before used!

function MyGame() {
	this.kBgd = "assets/bgd.png";
	this.mBgd = null;
	this.kMineUnopened = "assets/mine_unopened.png";
	this.mMineUnopened = null;
	this.kMineRed = "assets/mine_red.png";
	this.mMineRed = null;
	this.kMineGray = "assets/mine_gray.jpg";
	this.mMineGray = null;
	this.boardSize = 10;

	// set will be array
	this.mBgdSet = null;
	this.mMineUnopenedSet = null;
	this.mMineGraySet = null;

	// The camera to view the scene
	this.mCamera = null;
	// message will be number
	this.mMsg = null;
}
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.loadScene = function () {
	gEngine.Textures.loadTexture(this.kBgd);
	gEngine.Textures.loadTexture(this.kMineUnopened);
	gEngine.Textures.loadTexture(this.kMineRed);
	gEngine.Textures.loadTexture(this.kMineGray);
};

MyGame.prototype.unloadScene = function () {
	gEngine.Textures.unloadTexture(this.kBgd);
	gEngine.Textures.unloadTexture(this.kMineUnopened);
	gEngine.Textures.unloadTexture(this.kMineRed);
	gEngine.Textures.unloadTexture(this.kMineGray);
};

MyGame.prototype.initialize = function () {
	// Step A: set up the cameras
	this.mCamera = new Camera(
		vec2.fromValues(50, 50), // position of the camera
		100, // width of camera
		[0, 0, 640, 640] // viewport (orgX, orgY, width, height)
	);
	this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);

	this.mMsg = new FontRenderable("Status Message");
	this.mMsg.setColor([0, 0, 0, 1]);
	this.mMsg.getXform().setPosition(20, 40);
	this.mMsg.setTextHeight(5);

	// ^_^ --
	// this.mMineUnopened = new TextureObject(this.kMineUnopened, 5 , 5 , 10, 10);
	// this.mMineUnopened2 = new TextureObject(this.kMineUnopened, 15 , 5 , 10, 10);
	this.mBgdSet = [];
	this.mMineUnopenedSet = [];
	this.mMineGraySet = [];

	this.boardSize = this.boardSize * this.boardSize - 5;
	for (let row = 5; row <= this.boardSize; row+= 10) {
		for (let column = 5; column <= this.boardSize; column+= 10) {
			this.mMineUnopened = new TextureObject(this.kMineUnopened, row, column, 10, 10);
			this.mMineUnopenedSet.push(this.mMineUnopened);
		}
	}
	// -- ^_^

};


MyGame.prototype.drawCamera = function (camera) {
	camera.setupViewProjection();
	// ^_^ --
	// this.mMineUnopened.draw(camera);
	// this.mMineUnopened2.draw(camera);
	for (let i = 0; i < this.mMineUnopenedSet.length; i++) {
		this.mMineUnopenedSet[i].draw(camera);
	}
	// -- ^_^
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
	// Step A: clear the canvas
	gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

	// Step  B: Draw with all three cameras
	this.drawCamera(this.mCamera);
	this.mMsg.draw(this.mCamera); // only draw status in the main camera
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
	var msg = "L/R: Left or Right Minion; H: Dye; P: Portal]: ";

	this.mCamera.update(); // for smoother camera movements

	this.mMineUnopened.update( // for arrow movement
		gEngine.Input.keys.Up,
		gEngine.Input.keys.Down,
		gEngine.Input.keys.Left,
		gEngine.Input.keys.Right
	);

	// Brain chasing the hero
	var h = [];

	// Pan camera to object
	if (gEngine.Input.isKeyClicked(gEngine.Input.keys.L)) {

	}

	if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Q)) {
		this.mCamera.shake(-2, -2, 20, 30);
	}


	msg = "";
	// testing the mouse input
	if (gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Left)) {
		msg += "[L Down]";

		// console.log('Left mouse pressed');
	}

	if (gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Left)) {
		if (this.mCamera.isMouseInViewport()) {
			var x = this.mCamera.mouseWCX();
			var y = this.mCamera.mouseWCY();
			// console.log('Left mouse clicked');
			for (let i = 0; i < this.mMineUnopenedSet.length; i++) {
				if (this.mMineUnopenedSet[i].getBBox().containsPoint(x, y)) {
					this.mMineUnopenedSet.splice(i, 1);
					console.log(this.mMineUnopenedSet);
					i--;
				}
			}
			// var log = this.mMineUnopened2.getBBox().containsPoint(x, y);
			// console.log(log);
		}
	}

	// msg += " X=" + gEngine.Input.getMousePosX() + " Y=" + gEngine.Input.getMousePosY();
	msg += " X=" + this.mCamera.mouseWCX() + " Y=" + this.mCamera.mouseWCY();
	this.mMsg.setText(msg);
};
