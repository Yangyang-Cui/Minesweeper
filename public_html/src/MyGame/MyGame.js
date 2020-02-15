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
	this.mBgdSet = null;

	this.kMineUnopened = "assets/mine_unopened.png";
	this.mMineUnopened = null;
	this.mMineUnopenedSet = null;

	this.kMineRed = "assets/mine_red.png";
	this.mMineRed = null;
	this.kMineGray = "assets/mine_gray.jpg";
	this.mMineGray = null;
	this.mMineGraySet = null;

	this.kFlag = "assets/flag.png";
	this.mFlag = null;
	this.mFlagSet = null;

	this.powerBoardSize = null;

	this.mCamera = null;

	this.mMsg = null;
	this.mMsgSet = null;

	this.mFlagState = false;

	this.mCheckPoint = null;
	this.mCheckPointSet = null;

	this.mCheckPointStar = null;
	this.mCheckPointStarSet = null;

	this.gameOver = false;

	this.board = null;
	this.id = null;	

	this.boardSize = 10;
	this.cellSize = 10;
	this.minesRemaining = this.boardSize;
	this.mineCount = 15;
}
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.loadScene = function () {
	gEngine.Textures.loadTexture(this.kBgd);
	gEngine.Textures.loadTexture(this.kMineUnopened);
	gEngine.Textures.loadTexture(this.kMineRed);
	gEngine.Textures.loadTexture(this.kMineGray);
	gEngine.Textures.loadTexture(this.kFlag);
};

MyGame.prototype.unloadScene = function () {
	gEngine.Textures.unloadTexture(this.kBgd);
	gEngine.Textures.unloadTexture(this.kMineUnopened);
	gEngine.Textures.unloadTexture(this.kMineRed);
	gEngine.Textures.unloadTexture(this.kMineGray);
	gEngine.Textures.unloadTexture(this.kFlag);
};

MyGame.prototype.initialize = function () {
	// Step A: set up the cameras
	this.mCamera = new Camera(
		vec2.fromValues(50, 50), // position of the camera
		100, // width of camera
		[0, 0, 640, 640] // viewport (orgX, orgY, width, height)
	);
	this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);

	this.mBgdSet = [];

	// this.mMsg = new FontRenderable("Status Message");
	// this.mMsg.setColor([0, 0, 0, 1]);
	// this.mMsg.getXform().setPosition(20, 40);
	// this.mMsg.setTextHeight(5);

	this.mBgdSet = [];
	this.mMineUnopenedSet = [];
	this.mMineGraySet = [];
	this.mFlagSet = [];
	this.mCheckPointSet = []
	this.mCheckPointStarSet = []

	this.powerBoardSize = this.boardSize * this.boardSize;
	this._Board(this.powerBoardSize, this.mineCount);
};


MyGame.prototype.drawCamera = function (camera) {
	camera.setupViewProjection();
	// Bgd
	for (let i = 0; i < this.mBgdSet.length; i++) {
		this.mBgdSet[i].draw(camera);
	}
	// Mine
	for (let i = 0; i < this.mMineGraySet.length; i++) {
			this.mMineGraySet[i].draw(camera);

	}
	// Mine_unopened
	for (let i = 0; i < this.mMineUnopenedSet.length; i++) {
		if (this.mMineUnopenedSet[i].mVisible) {
			this.mMineUnopenedSet[i].draw(camera);
		}
	}
	// Flag
	for (let i = 0; i < this.mFlagSet.length; i++) {
		if (this.mFlagSet[i].mVisible) {
			this.mFlagSet[i].draw(camera);
		}
	}
	if (this.mMineRed !== null) {
		this.mMineRed.draw(camera);
	}
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
	// Step A: clear the canvas
	gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

	// Step  B: Draw with all three cameras
	this.drawCamera(this.mCamera);
	// this.mMsg.draw(this.mCamera); // only draw status in the main camera
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
	var msg = "";

	this.mCamera.update(); // for smoother camera movements

	// Pan camera to object
	if (gEngine.Input.isKeyClicked(gEngine.Input.keys.L)) {

	}

	if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Q)) {
		this.mCamera.shake(-2, -2, 20, 30);
	}

	// testing the mouse input
	if (gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Left)) {
		msg += "[L Down]";

	}

	if (gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Left)) {
		this._getClickedID();
		this._handleLeftClick(this.id);
	}


	if (gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Right)) {
		this._getClickedID();
		this._handleRightClick(this.id);
	}

	// msg += " X=" + gEngine.Input.getMousePosX() + " Y=" + gEngine.Input.getMousePosY();
	msg += " X=" + this.mCamera.mouseWCX() + " Y=" + this.mCamera.mouseWCY();
	// this.mMsg.setText(msg);
};

