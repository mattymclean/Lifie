var curId = 0;
var curTypeId = 0;

var groups = [];
var groupColors = [];

function Unit (parentUnit, parentUnit2) {
	this.id = curId++;
	this.parent1 = null;
	this.parent2 = null;

	if (parentUnit == null)
	{
		this.unitType = curTypeId++;
		this.color = get_random_color();
		this.x=get_random_int(0, w_width);
		this.y=get_random_int(0, w_height);
		this.healthMax = get_random_int(100, 3000);
		this.health = this.healthMax;
		this.moveDistance = get_random_int(3, 10);

		this.cellAggression = get_random_int(1, 3); //0=passive 1=defensive 2=aggressive (turn to enum)
		this.cellFoodType = get_random_int(1, 3); //0=herb 1=omni 2=carni (turn to enum)
		this.baseSize = get_random_int(1, 5);
	}
	else if (parentUnit2 != null)
	{
		this.x = parentUnit.x;
		this.y = parentUnit.y;
		this.color = get_random_color(); //should be mix later

		this.parent1Id = parentUnit.id;
		this.parent2Id = parentUnit2.id;
		this.unitType = curTypeId++;
		
		this.baseSize = get_random_int(1, 2) == 1 ? parentUnit.baseSize : parentUnit2.baseSize;
		this.healthMax = get_random_int(1, 2) == 1 ? parentUnit.healthMax : parentUnit2.healthMax;
		if (parentUnit.healthMax == parentUnit.health)
			this.health = (get_random_int(1, 2) == 1 ? parentUnit.health : parentUnit2.health) + get_random_int(1, 1000); // bonus
		else
			this.health = (get_random_int(1, 2) == 1 ? parentUnit.health : parentUnit2.health) + get_random_int(1, 500); //random chance of being healthier than parent

		this.moveDistance = get_random_int(1, 2) == 1 ? parentUnit.moveDistance : parentUnit2.moveDistance;
		this.cellAggression = get_random_int(1, 2) == 1 ? parentUnit.cellAggression : parentUnit2.cellAggression;
		this.cellFoodType = get_random_int(1, 2) == 1 ? parentUnit.cellFoodType : parentUnit2.cellFoodType;
	}
	else 
	{
		this.unitType = parentUnit.unitType;
		this.color = parentUnit.color;
		this.x = parentUnit.x;
		this.y = parentUnit.y;
		this.baseSize = parentUnit.baseSize;
		this.healthMax = parentUnit.healthMax;
		if (parentUnit.healthMax == parentUnit.health)
			this.health = parentUnit.health + get_random_int(1, 1000); // bonus
		else
			this.health = parentUnit.health + get_random_int(1, 500); //random chance of being healthier than parent

		this.moveDistance = parentUnit.moveDistance;
		this.cellAggression = parentUnit.cellAggression;
		this.cellFoodType = parentUnit.cellFoodType;
	}

	this.ticks = 0;
	this.lifespan = get_random_int(1, 6000);

	var sizeChance = get_random_int(1, 10);
	this.size = sizeChance == 1 ? this.baseSize + get_random_int(0, 2) : (sizeChance == 10 ? this.baseSize + get_random_int(0, 2) : this.baseSize);

	this.moved = false;
	this.wanderRate = get_random_int(1, 50);
	
	this.detectedFood = [];

	this.foodIntelligence = 1;
	this.foodDetectionRadius = get_random_int(100, 500);
    
	function UnitOutput(parent)
	{
		this.duplicate = false;
		if (parent.health > (parent.healthMax/2))
			this.duplicate = (get_random_int(1, 1500) == 1);
		else
			this.duplicate = (get_random_int(1, 6000) == 1);

		this.die = (parent.ticks > parent.lifespan) || (parent.health < 0);
	}

	this.tmpDirectionPicker = function()
	{
		var last = null;
		var food = null;
		for (var i=0; i<this.detectedFood.length; i++)
		{
			var xTest = (this.x - this.detectedFood[i].x);
			var yTest = (this.y - this.detectedFood[i].y);
			var total = xText + yTest;
			if (last == null || total < last)
			{
				last = total;
				food = this.detectedFood[i];
			}
		}
		return food;
	}

	this.process = function ()
	{
		this.health--;
		this.ticks++;
		var output = new UnitOutput(this);
		
		// Boundary Logic
		this.moved = false;
		if (get_random_int(0, this.wanderRate) == 1)
		{
			var dx=0;
			var dy=0;
			var closeFood = null;
			if (get_random_int(1, this.foodIntelligence) == 1 && (closeFood = this.tmpDirectionPicker()) != null)
			{
				if (closeFood > x)
					dx=get_random_int((this.moveDistance * -1), 0);
				else
					dx=get_random_int(0, this.moveDistance);

				if (closeFood > y)
					dy=get_random_int((this.moveDistance * -1), 0);
				else
					dy=get_random_int(0, this.moveDistance);
			}
			else
			{
				dx=get_random_int((this.moveDistance * -1), this.moveDistance);
				dy=get_random_int((this.moveDistance * -1), this.moveDistance);
			}

			if(!((this.x<=0 && dx < 0)  
				|| (this.x>=w_width && dx > 0) 
				|| (this.y<=0 && dy < 0) 
				|| (this.y>=w_height && dy > 0)))
			{
				this.x+=dx;
				this.y+=dy;
			}
			this.moved = true;
		}

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
}

function get_random_int (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function get_random_color() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}