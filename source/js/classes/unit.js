function Unit (color) {
	this.color = color;
    this.x=getRandomInt(0, 500);
	this.y=getRandomInt(0, 400);
	this.dx=5;
	this.dy=5;

	this.draw = function (context)
	{
		context.beginPath();
		context.fillStyle=this.color;
		// Draws a circle of radius 20 at the coordinates 100,100 on the canvas
		context.arc(this.x,this.y,10,0,Math.PI*2,true);
		context.closePath();
		context.fill();
		
		// Boundary Logic
		if( this.x<0 || this.x>500) this.dx=-this.dx;
		if( this.y<0 || this.y>400) this.dy=-this.dy;
		
		this.x+=this.dx;
		this.y+=this.dy;
	}
}

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}