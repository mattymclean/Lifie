function UnitController()
{
	this.processUnits = function (lifeSim, unit)
	{
		var units = lifeSim.data.GetUnitsList();
		len = units.length;
		for (var i=0;i < len; i++)
		{
			if (units[i] == null)
				continue;

			var output = lifeSim.unitController.processUnit(units[i]);
			if (output.duplicate)
			{
				lifeSim.unitController.createUnit(units[i]);

				if (logLevel < 1)
					log(units[i], 'duplicate');
			}
			if (output.die)
			{
				if (logLevel < 1)
					log(units[i], 'die');
				
				killUnit(i);
			}
		}
	}

	this.processUnit = function (lifeSim, unit)
	{
		unit.health--;
		unit.ticks++;
		var output = new UnitOutput(unit);
		
		// Boundary Logic
		unit.moved = false;
		if (get_random_int(0, unit.wanderRate) == 1)
		{
			var dx=0;
			var dy=0;
			var closeFood = null;
			if (get_random_int(1, unit.foodIntelligence) == 1 && (closeFood = unit.tmpDirectionPicker()) != null)
			{
				if (closeFood > x)
					dx=get_random_int((unit.moveDistance * -1), 0);
				else
					dx=get_random_int(0, unit.moveDistance);

				if (closeFood > y)
					dy=get_random_int((unit.moveDistance * -1), 0);
				else
					dy=get_random_int(0, unit.moveDistance);
			}
			else
			{
				dx=get_random_int((unit.moveDistance * -1), unit.moveDistance);
				dy=get_random_int((unit.moveDistance * -1), unit.moveDistance);
			}

			if(!((unit.x <= 0 && dx < 0)  
				|| (unit.x >= w_width && dx > 0) 
				|| (unit.y <= 0 && dy < 0) 
				|| (unit.y >= w_height && dy > 0)))
			{
				unit.x+=dx;
				unit.y+=dy;
			}
			unit.moved = true;
		}

		return output;
	}

	this.tmpDirectionPicker = function(parent, unit)
	{
		var last = null;
		var food = null;
		for (var i=0; i<parent.detectedFood.length; i++)
		{
			var xTest = (parent.x - parent.detectedFood[i].x);
			var yTest = (parent.y - parent.detectedFood[i].y);
			var total = xText + yTest;
			if (last == null || total < last)
			{
				last = total;
				food = parent.detectedFood[i];
			}
		}
		return food;
	}

	this.createUnit = function (lifeSim, parentUnit, parentUnit2)
	{
		var units = lifeSim.data.GetUnitsList();

		if (parentUnit == null || parentUnit2 != null)
			speciesCount++;
		
		var currentLen = units.length;
		units[currentLen] = new Unit(parentUnit, parentUnit2);	
		lifeCount++;

		//add this Unit to group
		if (groups[units[currentLen].unitType] == null)
			groups[units[currentLen].unitType] = 1;
		else
		{
			groups[units[currentLen].unitType] = groups[units[currentLen].unitType] + 1;
		}
		groupColors[units[currentLen].unitType] = units[currentLen].color;
		
		return units[currentLen];
	}

	this.killUnit = function (i)
	{
		groups[units[i].unitType] = groups[units[i].unitType] - 1;
		if (groups[units[i].unitType] < 1)
			log(units[i], 'extinct')
		var splicedUnits = units.splice(i, 1);
		lifeCount--;
		deathCount++;
		return splicedUnits[0];
	}
}