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
			this.mMineUnopenedSet = null;
			this.mFlagSet = null;
		}


		// MyGame.prototype._initializeCells = function (boardSize) {
		// 	var row = 0;
		// 	var column = 0;
		// 	$(".cell").each(function () {
		// 		$(this).attr("id", row + "" + column).css('color', 'black').text("");
		// 		$('#' + row + "" + column).css('background-image',
		// 			'radial-gradient(#fff,#e6e6e6)');
		// 		column++;
		// 		if (column >= boardSize) {
		// 			column = 0;
		// 			row++;
		// 		}

		// 		$(this).off().click(function (e) {
		// 			handleClick($(this).attr("id"));
		// 			var isVictory = true;
		// 			var cells = Object.keys(board);
		// 			for (var i = 0; i < cells.length; i++) {
		// 				if (!board[cells[i]].mined) {
		// 					if (!board[cells[i]].opened) {
		// 						isVictory = false;
		// 						break;
		// 					}
		// 				}
		// 			}

		// 			if (isVictory) {
		// 				this.gameOver = true;
		// 				$('#messageBox').text('You Win!').css({
		// 					'color': 'white',
		// 					'background-color': 'green'
		// 				});
		// 				clearInterval(timeout);
		// 			}
		// 		});

		// 		$(this).contextmenu(function (e) {
		// 			handleRightClick($(this).attr("id"));
		// 			return false;
		// 		});
		// 	})
		// }
