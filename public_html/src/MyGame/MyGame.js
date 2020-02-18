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
	this.idX = null;
	this.idY = null;
	this.number = null;
	this.numberMsg = null;

	this.cell = null;
//  ** Default 10 * 10
	// this.boardSize = 10;
	// this.cellSize = 10;
	// this.mineCount = 5;
	// this.startPoint = 5;
	// this.minesRemaining = this.mineCount;
	// this.cameraPosition = [50, 50];
	// this.cameraWidth = 100;
	this.cameraViewport = [0, 0, 640, 640];

	// ** 13 * 13
	// this.boardSize = 13;
	// this.cellSize = this.boardSize;
	// this.mineCount = 20;
	// this.minesRemaining = this.mineCount;
	// this.startPoint = this.boardSize / 2;
	// this.cameraPosition = [this.boardSize * this.boardSize / 2, this.boardSize * this.boardSize / 2];
	// this.cameraWidth = this.boardSize * this.boardSize;
	// this.cameraViewport = [0, 0, 1024, 1024];

	// ** 15 * 15
	// this.boardSize = 15;
	// this.cellSize = this.boardSize;
	// this.mineCount = 30;
	// this.minesRemaining = this.mineCount;
	// this.startPoint = this.boardSize / 2;
	// this.cameraPosition = [this.boardSize * this.boardSize / 2, this.boardSize * this.boardSize / 2];
	// this.cameraWidth = this.boardSize * this.boardSize;

	// default setting game
	this.defaultStart = 0;
	if (this.defaultStart === 0) {
		this._setGame(10, 10);
	} else if (this.defaultStart === 1) {
		this._setGame(13, 20);
	}
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
		vec2.fromValues(this.cameraPosition[0], this.cameraPosition[1]), // position of the camera
		this.cameraWidth, // width of camera
		this.cameraViewport // viewport (orgX, orgY, width, height)
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
	this.mMsgSet = [];

	this.powerBoardSize = this.boardSize * this.boardSize;
	this._Board(this.powerBoardSize, this.mineCount);
	this._number();
	// console.log(this.board);
	// console.log(this.mMsgSet);
};


MyGame.prototype.drawCamera = function (camera) {
	camera.setupViewProjection();
	// Bgd
	for (let i = 0; i < this.mBgdSet.length; i++) {
		this.mBgdSet[i].draw(camera);
	}
	// Mine neighbor number
	for (let i = 0; i < this.mMsgSet.length; i++) {
		this.mMsgSet[i].draw(camera);
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
	// Red_mine
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
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {

	this.mCamera.update(); // for smoother camera movements

	// Pan camera to object
	if (gEngine.Input.isKeyClicked(gEngine.Input.keys.L)) {

	}

	if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Q)) {

	}

	// testing the mouse input
	if (gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Left)) {

	}

	if (gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Left)) {
		this._getClickedID();
		this._handleLeftClick(this.id);
		var isVictory = true;
		var cells = Object.keys(this.board);
		for (var i = 0; i < cells.length; i++) {
			if (!this.board[cells[i]].mined) {
				if (!this.board[cells[i]].opened) {
					isVictory = false;
					break;
				}
			}
		}

		if (isVictory) {
			this.gameOver = true;
			$('#messageBox').text('你赢了!').css({
				color: 'white',
				'background-color': 'green'
			});
			this.mMineUnopenedSet = [];
			this.mFlagSet = [];
		}

		$('#new-game-button').click(function() {
			// var myGame = new MyGame();
			// gEngine.Core.initializeEngineCore('GLCanvas', myGame);
			// $('#messageBox').text('10*10格子').css({
			// 	color: 'white',
			// 	'background-color': 'gray'
			// });
			location.reload();
		});

		// *** didn't work
		$('#next-game-button').click(function() {
			location.reload();
			this._setGame(13, 20)
		});
	}


	if (gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Right)) {
		this._getClickedID();
		this._handleRightClick(this.id);
	}
};

