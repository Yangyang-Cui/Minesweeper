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

MyGame.prototype._Board = function (boardSize, mineCount) {
	this.board = {};
	for (let x = 5; x < boardSize; x += this.cellSize) {
		for (let y = 5; y < boardSize; y += this.cellSize) {
			this.mMineUnopened = new TextureObject(this.kMineUnopened, x, y, this.cellSize, this.cellSize);
			this.mFlag = new TextureObject(this.kFlag, x, y, this.cellSize, this.cellSize);
			this.mFlag.setVisibility(false);
			this.mMineGray = null;
			this.board[x + '*' + y] = Cell(x, y, false, false, false, 0, this.mMineUnopened, this.mMineGray, this.mFlag);

			this.mBgd = new TextureObject(this.kBgd, x, y, this.cellSize, this.cellSize);
			this.mBgdSet.push(this.mBgd);

			this.mMineUnopenedSet.push(this.board[x + '*' + y].mineUnopenedImage);
			this.mFlagSet.push(this.board[x + '*' + y].flagImage);

			this.mCheckPoint = [x, y];
			this.mCheckPointSet.push(this.mCheckPoint);
			this.mCheckPointStar = x + "*" + y;
			this.mCheckPointStarSet.push(this.mCheckPointStar);
		}
	}

	this.board = this._randomlyAssignMines(mineCount);
	this.board = this._calculateNeighborMineCounts(boardSize);

	return this.board;
};

MyGame.prototype._randomlyAssignMines = function (mineCount) {
	var mineCoordinates = [];

	for (var i = 0; i < mineCount; i++) {
		var index = getRandomInteger(0, this.mCheckPointSet.length);

		var randomXCoordinate = this.mCheckPointSet[index][0];
		var randomYCoordinate = this.mCheckPointSet[index][1];
		var cell = randomXCoordinate + '*' + randomYCoordinate;
		while (mineCoordinates.includes(cell)) {
			var index = getRandomInteger(0, this.mCheckPointSet.length);
			var randomXCoordinate = this.mCheckPointSet[index][0];
			var randomYCoordinate = this.mCheckPointSet[index][1];
			var cell = randomXCoordinate + '*' + randomYCoordinate;
		}
		mineCoordinates.push(cell);
		this.board[cell].mined = true;
		this.mMineGray = new TextureObject(this.kMineGray, randomXCoordinate, randomYCoordinate , this.cellSize, this.cellSize);
		this.mMineGraySet.push(this.mMineGray);
	}
	// console.log(mineCoordinates);
	return this.board;
};

function getRandomInteger(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

MyGame.prototype._calculateNeighborMineCounts = function (boardSize) {
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
					neighborMineCount += this._isMined(neighbors[i]);
				}
				cell.neighborMineCount = neighborMineCount;
			}
		}
	}

	return this.board;
};

function getXY(id) {
	var slicePoint = id.indexOf('*');
	var xString = id.slice(0, slicePoint);
	var yString = id.slice(slicePoint + 1);
	var x = parseInt(xString);
	var y = parseInt(yString);

	return [x, y];
}

MyGame.prototype._getNeighbors = function (id) {
	let x = getXY(id)[0];
	let y = getXY(id)[1];

	var neighbors = [];
	var trueNeighbors = []

	neighbors.push((x - 10) + "*" + (y - 10));
	neighbors.push((x - 10) + "*" + y);
	neighbors.push((x - 10) + "*" + (y + 10));
	neighbors.push(x + "*" + (y - 10));
	neighbors.push(x + "*" + (y + 10));
	neighbors.push((x + 10) + "*" + (y - 10));
	neighbors.push((x + 10) + "*" + y);
	neighbors.push((x + 10) + "*" + (y + 10));

	for (var i = 0; i < neighbors.length; i++) {
		if (this.mCheckPointStarSet.indexOf(neighbors[i]) >= 0) {
			trueNeighbors.push(neighbors[i]);
		}
	};

	return trueNeighbors;
}

MyGame.prototype._isMined = function(id) {
	var cell = this.board[id];
	var mined = 0;
	if (typeof cell !== 'undefined') {
		mined = cell.mined ? 1 : 0;
	}
	return mined;
}
