function Food () {
	this.color = get_random_color();
	this.x=get_random_int(0, 500);
	this.y=get_random_int(0, 400);
	
	this.ticks = 0;

	this.foodMax = get_random_int(1, 100000);
	this.foodCount = get_random_int(1, 50000);
	this.regenFoodAmount = get_random_int(1000, 10000);
	this.regenRate = get_random_int(50, 2000);
	this.regenCurrent = this.regenRate;

	this.size = this.size = 0;

	function FoodOutput(parent)
	{
		
	}

	this.process = function ()
	{
		this.ticks++;
		this.regenCurrent--;
		if (this.regenCurrent <= 0)
		{
			if (this.foodCount < this.foodMax)
				this.foodCount += this.regenFoodAmount;
			this.regenCurrent = this.regenRate;
		}
		this.updateSize();
		var output = new FoodOutput(this);
		
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
	}

	this.eat = function(amount)
	{
		this.foodCount = this.foodCount - amount;
		
		if (get_random_int(1, 1000) == 1) //chance to spread
			this.regenCurrent--;

		if (this.foodCount < 0)
			this.foodCount = 0;
	}

	this.updateSize = function()
	{
		var size = this.foodCount / 500;
		if (size > 100)
			this.size = 100;
		else 
			this.size = size;
	}
}