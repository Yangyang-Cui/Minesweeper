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
	this.kMinionSprite = "assets/minion_sprite.png";
	this.kBg = "assets/bg.png";

	this.kMineUnopened = "assets/bgd.png";
	this.mMineUnopened = null;

	// The camera to view the scene
	this.mCamera = null;
	// this.mBg = null;

	this.mMsg = null;

	// the hero and the support objects
	// this.mHero = null;
	// this.mBrain = null;
	// this.mLMinion = null;
	// this.mRMinion = null;
	// this.mFocusObj = null;

	this.mChoice = 'D';
}
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.loadScene = function () {
	gEngine.Textures.loadTexture(this.kMinionSprite);
	gEngine.Textures.loadTexture(this.kBg);

	gEngine.Textures.loadTexture(this.kMineUnopened);
};

MyGame.prototype.unloadScene = function () {
	gEngine.Textures.unloadTexture(this.kMinionSprite);
	gEngine.Textures.unloadTexture(this.kBg);

	gEngine.Textures.unloadTexture(this.kMineUnopened);
};

MyGame.prototype.initialize = function () {
	// Step A: set up the cameras
	this.mCamera = new Camera(
		vec2.fromValues(50, 50), // position of the camera
		100, // width of camera
		[0, 0, 640, 640] // viewport (orgX, orgY, width, height)
	);
	this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
	// Large background image
	// var bgR = new SpriteRenderable(this.kBg);
	// bgR.setElementPixelPositions(0, 1024, 0, 1024);
	// bgR.getXform().setSize(150, 150);
	// bgR.getXform().setPosition(50, 35);
	// this.mBg = new GameObject(bgR);

	// Objects in the scene
	// this.mHero = new Hero(this.kMinionSprite);
	// this.mLMinion = new Minion(this.kMinionSprite, 30, 30);
	// this.mRMinion = new Minion(this.kMinionSprite, 70, 30);
	// this.mFocusObj = this.mHero;

	this.mMsg = new FontRenderable("Status Message");
	this.mMsg.setColor([1, 1, 1, 1]);
	this.mMsg.getXform().setPosition(20, 40);
	this.mMsg.setTextHeight(3);

	// ^_^ --
	// this.mMineUnopened = new TextureObject(this.kMineUnopened, 5 , 5 , 10, 10);
	// this.mMineUnopened2 = new TextureObject(this.kMineUnopened, 15 , 5 , 10, 10);

	this.mMineUnopenedSet = [];
	var i, j, boardSize;
	boardSize = 100;
	for (i = 5; i < boardSize; i += 10) {
		for (j = 5; j < boardSize; j += 10) {
			this.mMineUnopened = new TextureObject(this.kMineUnopened, i, j, 10, 10);
			this.mMineUnopenedSet.push(this.mMineUnopened);
		}
	}
	// -- ^_^

};


MyGame.prototype.drawCamera = function (camera) {
	camera.setupViewProjection();
	// this.mBg.draw(camera);
	// this.mHero.draw(camera);

	// this.mLMinion.draw(camera);
	// this.mRMinion.draw(camera);

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
	var zoomDelta = 0.05;
	var msg = "L/R: Left or Right Minion; H: Dye; P: Portal]: ";

	this.mCamera.update(); // for smoother camera movements

	// this.mLMinion.update(); // for sprite animation
	// this.mRMinion.update();

	// this.mHero.update(); // for WASD movement
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
