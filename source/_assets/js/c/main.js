function LifeSim () {

}
var _LifeSim = new LifeSim();


var units = [];
var foods = [];

var context;
var w_width=1000;
var w_height=800;

var lifeCount = 0;
var deathCount = 0;
var speciesCount = 0;

var logLevel = 1;

var minutes = 0; //ticks

var mainIntervalId = null;
var mainIntervalCount = 20;
var mainIntervalLock = false;

var drawIntervalId = null;
var drawIntervalCount = 500;
var drawIntervalLock = false;

function initSystem()
{
	var world = document.getElementById('world');
	world.width = w_width;
	world.height = w_height;
	context = world.getContext('2d');
	var back = document.getElementById('back');
	back.style.width = w_width;
	back.style.height = w_height;
}
setTimeout(initSystem, 2000);

function init()
{
	
	units = [];
	foods = [];
	var curId = 0;
	curTypeId = 0;
	groups = [];
	groupColors = [];
	minutes = 0;
	deathCount = 0;

	var startCount = get_random_int(25, 200);
	for (var i=0;i < startCount; i++)
		createUnit();

	var foodCount = get_random_int(1, 40);
	for (var i=0;i < foodCount; i++)
		foods[i] = new Food();

	lifeCount = units.length;
	speciesCount = lifeCount;

	start();
}

function start()
{
	clearInterval(mainIntervalId);
	mainIntervalId = setInterval(process, mainIntervalCount);

	clearInterval(drawIntervalId);
	drawIntervalId = setInterval(draw, drawIntervalCount);
}

function stop()
{
	clearInterval(mainIntervalId);
	clearInterval(drawIntervalId);
}

function process()
{
	try
	{
		if (mainIntervalLock)
			return;
		mainIntervalLock = true;

		minutes++;

		var len = foods.length;
		for (var i=0;i < len; i++)
		{
			if (foods[i] == null)
				continue;

			var output = foods[i].process();
		}


		len = units.length;
		for (var i=0;i < len; i++)
		{
			if (units[i] == null)
				continue;

			var output = units[i].process();
			if (output.duplicate)
			{
				createUnit(units[i]);

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

		if (checkForCollisions())
		{
			
		}

		$('#lifeCount').html(lifeCount);
		$('#deathCount').html(deathCount);
		$('#speciesCount').html(speciesCount);
		
		displayDate();
		displayGroups();
		displayFoods();
	}
	catch(ex)
	{
		throw ex;
	}
	finally
	{
		mainIntervalLock = false;
	}
}

function checkForCollisions()
{
	var len = units.length;
	for (var i=0;i < len; i++)
	{
		var bFoundFood = false;
		var foodLen = foods.length;
		for (var f=0;f < foodLen; f++)
			if (checkCollision(units[i], foods[f]))
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
					if (checkCollision(unitCopy, foods[f]))
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
				if (checkCollision(units[i], units[k]))
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

function checkCollision(unit1, unit2)
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

function draw()
{
	try
	{
		if (drawIntervalLock)
			return;
		drawIntervalLock = true;

		//log(units[0], units.length);
		context.clearRect(0,0, w_width,w_height);
		
		var len = foods.length;
		for (var i=0;i < len; i++)
		{
			if (foods[i] == null)
				continue;

			foods[i].draw(context);
		}

		len = units.length;
		for (var i=0;i < len; i++)
		{
			if (units[i] == null)
				continue;

			units[i].draw(context);
		}
	}
	catch(ex)
	{
		throw ex;
	}
	finally
	{
		drawIntervalLock = false;
	}
}

function log(unit, action)
{
	var logItem = '';
	if (unit == null)
		logItem = 'ERROR';
	else
		logItem = '<div style="width:10px;height:10px;background-color:' + unit.color + ';border:1px solid #000;float: left;"></div> Unit performed action: (' + action + ')';
	
	document.getElementById('log').innerHTML = logItem + '<br/>' + document.getElementById('log').innerHTML;
}

function createUnit(parentUnit, parentUnit2)
{
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

function killUnit(i)
{
	groups[units[i].unitType] = groups[units[i].unitType] - 1;
	if (groups[units[i].unitType] < 1)
		log(units[i], 'extinct')
	var splicedUnits = units.splice(i, 1);
	lifeCount--;
	deathCount++;
	return splicedUnits[0];
}


function displayDate()
{
	var m = minutes;

	var y = Math.floor(minutes / (60 * 24 * 365));
    var divisor_for_years = minutes % (60 * 24 * 365);
    var d = Math.floor(divisor_for_years / (60 * 24));
    var divisor_for_days = minutes % (60 * 24);
    var h = Math.floor(divisor_for_days / (60));
 
	document.getElementById('date').innerHTML = 'Hour ' + h + ' of Day ' + d + ' of Year ' + y + ' ABB (After Big Bang)';
}

function displayGroups()
{
	var count = 0;
	var groupsHTML = '';
	for (var i=0;i < groups.length;i++)
		if (groups[i] > 0)
		{
			groupsHTML += '<div style="width:10px;height:10px;background-color:' + groupColors[i] + ';border:1px solid #000;float: left;font-size:8px;">' + i + '</div> ' + groups[i] + '<br/>';
			count++;
		}

	$('#groups').html(groupsHTML);
	$('#unitLabel').html('Unit Types (' + count + '):');
}

function displayFoods()
{
	$('#foodLabel').html('Food Types (' + foods.length + '):');
	var foodsHTML = '';
	for (var i=0;i < foods.length;i++)
		foodsHTML += '<div style="width:10px;height:10px;background-color:' + foods[i].color + ';border:1px solid #000;float: left;font-size:8px;">' + i + '</div> ' + foods[i].foodCount + ' (' + foods[i].regenCurrent + '=>' + foods[i].regenFoodAmount + ')<br/>';

	$('#foods').html(foodsHTML);
}
