function FoodController()
{
	this.processFoods = function (lifeSim, foods)
	{
		var len = foods.length;
		for (var i=0;i < len; i++)
		{
			if (foods[i] == null)
				continue;

			var output = parent.foodController.process(foods[i]);
		}
	}

	this.process = function (lifeSim, food)
	{
		food.ticks++;
		food.regenCurrent--;
		if (food.regenCurrent <= 0)
		{
			if (food.foodCount < food.foodMax)
				food.foodCount += food.regenFoodAmount;
			food.regenCurrent = food.regenRate;
		}
		food.updateSize();
		
		var output = new FoodOutput(food);
		return output;
	}

	this.createFood = function (lifeSim)
	{
		foods[i] = new Food();
	}

	this.eat = function(amount, food)
	{
		food.foodCount = food.foodCount - amount;
		
		if (get_random_int(1, 1000) == 1) //chance to spread
			food.regenCurrent--;

		if (food.foodCount < 0)
			food.foodCount = 0;
	}

	this.updateSize = function(food)
	{
		var size = food.foodCount / 500;
		if (size > 100)
			food.size = 100;
		else 
			food.size = size;
	}
}