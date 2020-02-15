MyGame.prototype._getNumberColor = function (number) {
	var color = 'black';
	if (number === 1) {
		// color = 'blue';
		this.mMsg.setColor([0, 0, 0, 1]);
	} else if (number === 2) {
		// color = 'green';
		this.mMsg.setColor([0.2, 1.0, 0.2, 1]);
	} else if (number === 3) {
		// color = 'red';
		this.mMsg.setColor([0.2, 0.2, 1.0, 1]);
	} else if (number === 4) {
		// color = 'orange';
		this.mMsg.setColor([1.0, 0.2, 0.2, 1]);
	}
	return color;
}

MyGame.prototype._number = function () {
	let number = null;
	let numberMsg = null;
	let x = null;
	let y = null;
	for (let i = 0; i < this.mCheckPointStarSet.length; i++) {
		number = this.board[this.mCheckPointStarSet[i]].neighborMineCount;
		numberMsg = number.toString();
		this.mMsg = new FontRenderable(numberMsg);
		this._getNumberColor(numberMsg);
		x = this.board[this.mCheckPointStarSet[i]].x;
		y = this.board[this.mCheckPointStarSet[i]].y;
		this.mMsg.getXform().setPosition(x, y);
		console.log(this.mMsg.getXform().getPosition());
		this.mMsg.setTextHeight(5);
		this.mMsgSet.push(this.mMsg);
	}
}
