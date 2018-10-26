function CollisionController ()
{
	this.processCollisions = function (lifeSim)
	{
		var units = lifeSim.data.getUnitsList();
		var foods = lifeSim.data.getFoodsList();

		var len = units.length;
		for (var i=0;i < len; i++)
		{
			var bFoundFood = false;
			var foodLen = foods.length;
			for (var f=0;f < foodLen; f++)
				if (lifeSim.collision.checkCollision(units[i], foods[f]))
				{
					var bite = units[i].healthMax - units[i].health;

					foods[f].eat(bite);
					units[i].health = units[i].health + bite;
					bFoundFood = true;
				}

			if (this.moved)
			{
				units[i].detectedFood = [];
				if (!bFoundFood)
				{
					
					var unitCopy = jQuery.extend({}, units[i]);
					unitCopy.size = units[i].foodDetectionRadius;

					var foodLen = foods.length;
					for (var f=0;f < foodLen; f++)
						if (lifeSim.collision.checkCollision(unitCopy, foods[f]))
						{
							//should check for the closest but first is good for now
							units[i].detectedFood.push(foods[f]);
						}
					//log(units[i], 'Added ' + units[i].detectedFood.length + ' foods')
				}
			}

			for (var k=0;k < len; k++)
			{
				if (i != k && units[i] != null && units[k] != null
					&& units[i].unitType != units[k].unitType //temp part
					)
				{
					if (lifeSim.collision.checkCollision(units[i], units[k]))
					{
						//log(units[i], 'collision <div style="width:10px;height:10px;background-color:' + units[k].color + ';border:1px solid #000;float: left;"></div>')
						var actionNum = get_random_int(1, 2);
						if (actionNum == 1)
						{
							if (get_random_int(1, 600) == 1)
							{							
								var unit = createUnit(units[i], units[k]);
								if (logLevel < 2)
									log(units[i], 'mate <div style="width:10px;height:10px;background-color:' + units[k].color + ';border:1px solid #000;float: left;"></div><div style="width:10px;height:10px;background-color:' + unit.color + ';border:1px solid #000;float: left;"></div>');
							}
						}
						else if (actionNum == 2)
						{
							//if both not aggressive, be nice
							if (units[i].cellAggression != 3 && units[k].cellAggression != 3)
								continue;

							if (get_random_int(1, 10) == 1)
							{
								var actionNum2 = get_random_int(1, 2);
								//if passive or lost the battle
								if (units[i].cellAggression == 0 || actionNum2 == 1)
								{
									if (logLevel < 2)
										log(units[k], 'kill <div style="width:10px;height:10px;background-color:' + units[i].color + ';border:1px solid #000;float: left;"></div>');
									killUnit(i);
								}
								else
								{
									if (units[k].cellAggression == 0 || logLevel < 2)
										log(units[i], 'kill <div style="width:10px;height:10px;background-color:' + units[k].color + ';border:1px solid #000;float: left;"></div>');
									killUnit(k);
								}
							}
						}

						return true;
						//return false; //for now
					}
				}
			}
		}

		return false;
	}

	this.checkCollision = function (lifeSim, unit1, unit2)
	{
		//I need fractions here dont I....
		t1 = unit1.x + (unit1.size / 2);
		b1 = unit1.x - (unit1.size / 2);
		r1 = unit1.y + (unit1.size / 2);
		l1 = unit1.y - (unit1.size / 2);

		t2 = unit2.x + (unit2.size / 2);
		b2 = unit2.x - (unit2.size / 2);
		r2 = unit2.y + (unit2.size / 2);
		l2 = unit2.y - (unit2.size / 2);

		if (t1 < b2) return false; // unit1 is left of unit2
	    if (b1 > t2) return false; // unit1 is right of unit2
	    if (r1 < l2) return false; // unit1 is above unit2
	    if (l1 > r2) return false; // unit1 is below unit2
	   
		return true;
	}

}