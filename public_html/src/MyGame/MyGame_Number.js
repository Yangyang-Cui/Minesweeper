MyGame.prototype._getNumberColor = function (numberMsg) {
	var color = 'black';
	if (numberMsg === '1') {
		this.mMsg.setColor([0, 1.0, 1.0, 1]);
	} else if (numberMsg === '2') {
		this.mMsg.setColor([0.2, 1.0, 0.2, 1]);
	} else if (numberMsg === '3') {
		this.mMsg.setColor([0.2, 0.2, 1.0, 1]);
	} else if (numberMsg === '4') {
		this.mMsg.setColor([1.0, 0.2, 0.2, 1]);
	} else if (numberMsg === '5') {
		this.mMsg.setColor([1.0, 0.2, 1.0, 1]);
	} else if (numberMsg === '6') {
		this.mMsg.setColor([0.5, 0.2, 0.5, 1]);
	} else {
		this.mMsg.setColor([1.0, 1.0, 0.2, 1]);
	}
	return color;
}

MyGame.prototype._number = function () {
	let x = null;
	let y = null;
	for (let i = 0; i < this.mCheckPointStarSet.length; i++) {
		this.number = this.board[this.mCheckPointStarSet[i]].neighborMineCount;
		if (this.number !== 0) {
			this.numberMsg = this.number.toString();
		} else {
			this.numberMsg = '';
		}
		this.mMsg = new FontRenderable(this.numberMsg);
		this._getNumberColor(this.numberMsg);
		x = this.board[this.mCheckPointStarSet[i]].x;
		y = this.board[this.mCheckPointStarSet[i]].y;
		this.mMsg.getXform().setPosition(x, y+1);

		this.mMsg.setTextHeight(7);
		this.mMsgSet.push(this.mMsg);
	}
}

MyGame.prototype._checkNeighborZero = function (cell, id) {
	if (cell.neighborMineCount === 0) {
		let neighbors = this._getNeighbors(id);
		for (var i = 0; i < neighbors.length; i++) {
			let newId = neighbors[i];
			let newCell = this.board[newId];
			if (!newCell.opened) {
				newCell.opened = true;
				newCell.mineUnopenedImage.setVisibility(false);
			}
			// if (newCell.neighborMineCount !== 0) {
			// 	return;
			// } else {
			// 	this._checkNeighborZero(newCell, newId);
			// }
	// 		let cellNeighbor = this.board[neighbors[i]];
	// 		cellNeighbor.opened = true;
	// 		cellNeighbor.mineUnopenedImage.setVisibility(false);
	// 		if (cellNeighbor.neighborMineCount === 0) {
	// 			neighbors = this._getNeighbors(cellNeighbor);
	// 			for (var j = 0; j < neighbors.length; j++) {
	// 				cellNeighbor = this.board[neighbors[j]];
	// 				cellNeighbor.opened = true;
	// 				cellNeighbor.mineUnopenedImage.setVisibility(false);
	// 			}
	// 			// this._checkNeighborZero(cellNeighbor, neighbors[i]);
	// 		}
		}
	}
}
