// function checkAndAddFlag() {
// 	if (this.mCamera.isMouseInViewport()) {
// 		var x = this.mCamera.mouseWCX();
// 		var y = this.mCamera.mouseWCY();
// 		for (let i = 0; i < this.mBgdSet.length; i++) {
// 			if (this.mBgdSet[i].getBBox().containsPoint(x, y)) {
// 				var row = this.mBgdSet[i].getXform().getXPos();
// 				var column = this.mBgdSet[i].getXform().getYPos();
// 				if (this.mFlagSet !== null) {
// 					for (let j = 0; j < this.mFlagSet.length; i++) {
// 						flagState = (this.mFlagSet[j].getXform().getPosition() === this.mBgdSet[i].getXform().getPosition())
// 						console.log(flagState);
// 						if (flagState) {
// 							this.mFlagSet[j].splice(j, 1);
// 						}
// 					}
// 				}
// 				this.mFlag = new TextureObject(this.kFlag, row, column, 10, 10);
// 				this.mFlagSet.push(this.mFlag);
// 			}

// 		}
// 	}
// }

function Cell(x, y, opened, flagged, mined, neighborMineCount, mineUnopenedImage, mineImage, flagImage) {
	return {
		id: x + '*' + y,
		x: x,
		y: y,
		opened: opened,
		flagged: flagged,
		mined: mined,
		neighborMineCount: neighborMineCount,
		mineUnopenedImage: mineUnopenedImage,
		mineImage: mineImage,
		flagImage: flagImage
	};
}

MyGame.prototype._Board = function(boardSize, mineCount) {
	this.board = {};
	for (let x = 5; x < boardSize; x += 10) {
		for (let y = 5; y < boardSize; y += 10) {
			this.mMineUnopened = new TextureObject(this.kMineUnopened, x, y, 10, 10);
			this.mMineGray = new TextureObject(this.kMineGray, x, y, 10, 10);
			this.mFlag = new TextureObject(this.kFlag, x, y, 10, 10);
			this.mFlag.setVisibility(false);
			this.board[x + '*' + y] = Cell(x, y, false, false, false, 0, this.mMineUnopened, this.mMineGray, this.mFlag);

			this.mBgd = new TextureObject(this.kBgd, x, y, 10, 10);
			this.mBgdSet.push(this.mBgd);

			this.mMineUnopenedSet.push(this.board[x + '*' + y].mineUnopenedImage);
			this.mFlagSet.push(this.board[x + '*' + y].flagImage);

			this.mCheckPoint = [x, y];
			this.mCheckPointSet.push(this.mCheckPoint);
		}
	}
	// console.log(board);
	this.board = this._randomlyAssignMines(this.board, mineCount);
	this.board = this._calculateNeighborMineCounts(this.board, boardSize);
	// console.log(board)
	return this.board;
};

MyGame.prototype._randomlyAssignMines = function(mineCount) {
	var mineCoordinates = [];
	for (var i = 0; i < mineCount; i++) {
		var index = getRandomInteger(0, this.mCheckPointSet.length);
		// console.log('index :', index);
		var randomXCoordinate = this.mCheckPointSet[index][0];
		var randomYCoordinate = this.mCheckPointSet[index][1];
		var cell = randomXCoordinate + '*' + randomYCoordinate;
		while (mineCoordinates.includes(cell)) {
			var index = getRandomInteger(0, this.mCheckPointSet.length);
			var randomXCoordinate = this.mCheckPointSet[index][0];
			var randomYCoordinate = this.mCheckPointSet[index][1];
			var cell = randomXCoordinate + '*' + randomYCoordinate;
		}
		// console.log(cell);
		mineCoordinates.push(cell);
		this.board[cell].mined = true;
		// console.log(board);
		// console.log('board[cell].mined: ', mineCoordinates);
	}
	return this.board;
};

function getRandomInteger(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

MyGame.prototype._calculateNeighborMineCounts = function(boardSize) {
	var cell;
	var neighborMineCount = 0;
	for (let x = 5; x < boardSize; x += 10) {
		for (let y = 5; y < boardSize; y += 10) {
			var id = x + '*' + y;
			cell = this.board[id];
			if (!cell.mined) {
				var neighbors = this._getNeighbors(id);
				neighborMineCount = 0;
				for (var i = 0; i < neighbors.length; i++) {
					neighborMineCount += isMined(this.board, neighbors[i]);
				}
				cell.neighborMineCount = neighborMineCount;
			}
		}
	}

	return this.board;
};

function getXY(id) {
	// console.log(typeof id);
	// console.log(id);
	var slicePoint = id.indexOf('*');
	var xString = id.slice(0, slicePoint);
	var yString = id.slice(slicePoint + 1);
	var x = parseInt(xString);
	var y = parseInt(yString);

	return [x, y];
}

MyGame.prototype._getNeighbors = function(id) {
	// console.log('~~~~');
	// console.log(id);
	// console.log('~~~~');
	// console.log(id);
	let x = getXY(id)[0];
	let y = getXY(id)[1];
	// console.log([x, y])

	var neighbors = [];
	// let trueNeighbors = [];
	// neighbors.push([x - 10, y - 10]);
	// neighbors.push([x - 10, y]);
	// neighbors.push([x - 10, y + 10]);
	// neighbors.push([x, y - 10]);
	// neighbors.push([x, y + 10]);
	// neighbors.push([x + 10, y - 10]);
	// neighbors.push([x + 10, y]);
	// neighbors.push([x + 10, y + 10]);	
	neighbors.push((x - 10) + "*" + (y - 10));
	neighbors.push((x - 10) + "*" + y);
	neighbors.push((x - 10) + "*" + (y + 10));
	neighbors.push(x + "*" + (y - 10));
	neighbors.push(x + "*" + (y + 10));
	neighbors.push((x + 10) + "*" + (y - 10));
	neighbors.push((x + 10) + "*" + y);
	neighbors.push((x + 10) + "*" + (y + 10));
	// console.log('!!!!!!!!!!!!!!!!!!!')
	// console.log(neighbors);
	// for (var i = 0; i < neighbors.length; i++) {
	// 	for (let j = 0; j < this.mBgdSet.length; j++) {
	// 		if (!this.mBgdSet[j].getBBox().containsPoint(neighbors[i])) {
	// 			console.log(neighbors[i]);
	// 			neighbors.splice(i, 1);	
	// 		}
	// 	}
	// }
	// console.log(neighbors);
	// for (let i = 0; i < neighbors.length; i++) {
	// 	let neighbor = neighbors[i];
	// 	if (this.mCheckPointSet.includes(neighbor)) {
	// 		trueNeighbors.push(neighbor);
	// 	}
	// }
	// for (let i = 0; i < this.mCheckPointSet.length; i++) {
	// 	for (let j = 0; j < neighbors.length; j++) {
	// 		if (this.mCheckPointSet[i] == neighbors[j]) {
	// 			trueNeighbors.push(neighbors[j]);
	// 		}
	// 	}
	// }
	// console.log(trueNeighbors);

// console.log(neighbors);
	return neighbors;
};

function isMined(id) {
	var cell = this.board[id];
	var mined = 0;
	if (typeof cell !== 'undefined') {
		mined = cell.mined ? 1 : 0;
	}
	return mined;
}
