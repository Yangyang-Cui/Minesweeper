MyGame.prototype._getClickedID = function() {
	if (this.mCamera.isMouseInViewport()) {
		var x = this.mCamera.mouseWCX();
		var y = this.mCamera.mouseWCY();
		for (let i = 0; i < this.mBgdSet.length; i++) {
			if (this.mBgdSet[i].getBBox().containsPoint(x, y)) {
				var idX = this.mBgdSet[i].getXform().getXPos();
				var idY = this.mBgdSet[i].getXform().getYPos();
				this.id = idX + "*" + idY;
			}
		}
	}
}

MyGame.prototype._handleLeftClick = function (id) {
	if (!this.gameOver) {
		var cell = this.board[id];
		if (!cell.opened) {
			if (!cell.flagged) {
				if (cell.mined) {
					this._loss();
				} else {
					cell.opened = true;
					cell.mineUnopenedImage.setVisibility(false);
				}
			}
		}
	}
}

MyGame.prototype._handleRightClick = function (id) {
		if (!this.gameOver) {
			var cell = this.board[id];
			if (!cell.opened) {
				if (!cell.flagged && this.minesRemaining > 0) {
						cell.flagged = true;
						cell.flagImage.setVisibility(true);
						this.minesRemaining--;
					} else if (cell.flagged) {
						cell.flagged = false;
						cell.flagImage.setVisibility(false);
						this.minesRemaining++;
					}
				}
			}
		}


		MyGame.prototype._loss = function () {
			this.gameOver = true;
			this.mMineRed = new TextureObject(this.kMineRed, this.board[this.id].x, this.board[this.id].y, this.cellSize, this.cellSize);
			this.mMineUnopenedSet = [];
			this.mFlagSet = [];
		}

