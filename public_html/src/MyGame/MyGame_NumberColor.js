MyGame.prototype._getNumberColor = function( number )
{
	var color = 'black';        
	if( number === 1 )
	{
		// color = 'blue';
		this.mMsg.setColor([0, 0, 0, 1]);
	}
	else if( number === 2 )
	{
		// color = 'green';
		this.mMsg.setColor([0.2, 1.0, 0.2, 1]);
	}
	else if( number === 3 )
	{
		// color = 'red';
		this.mMsg.setColor([0.2, 0.2, 1.0, 1]);
	}
	else if( number === 4 )
	{
		// color = 'orange';
		this.mMsg.setColor([1.0, 0.2, 0.2, 1]);
	}
	return color;
}
