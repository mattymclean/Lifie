function Unit (color) {
	this.color = color;
	this.size = getRandomInt(1, 5);
	this.lifespan = getRandomInt(1, 20000);
    this.x=getRandomInt(0, 500);
	this.y=getRandomInt(0, 400);

	function UnitOutput()
	{
		this.duplicate = (getRandomInt(0, 2000) == 1);
	}

	this.process = function (context)
	{
		var output = new UnitOutput();
		this.draw(context);
		return output;
	}

	this.draw = function (context)
	{
		context.beginPath();
		context.fillStyle=this.color;
		// Draws a circle of radius 20 at the coordinates 100,100 on the canvas
		context.arc(this.x,this.y,this.size,0,Math.PI*2,true);
		context.closePath();
		context.fill();
		
		// Boundary Logic
		if (getRandomInt(0, 200) == 1)
		{
			var dx=getRandomInt(-5, 5);
			var dy=getRandomInt(-5, 5);

			if(!((this.x<=0 && dx < 0)  
				|| (this.x>=500 && dx > 0) 
				|| (this.y<=0 && dy < 0) 
				|| (this.y>=400 && dy > 0)))
			{
				this.x+=dx;
				this.y+=dy;
			}
		}
	}
}

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}