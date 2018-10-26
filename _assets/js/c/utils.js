function Utils()
{
	//Complete later
	this.isNullOrWhitespace = function (s)
	{
		return (s == null || s == '')
	}

	this.getRandomInt = function (min, max) {
    	return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	this.getRandomColor = function () {
	    var letters = '0123456789ABCDEF'.split('');
	    var color = '#';
	    for (var i = 0; i < 6; i++ ) {
	        color += letters[Math.round(Math.random() * 15)];
	    }
	    return color;
	}
}