var units = [];  

var context;
var w_width=500;
var w_height=400;

var lifeCount = 0;
var deathCount = 0;
var speciesCount = 0;

var logLevel = 0;

var minutes = 0; //ticks

var mainIntervalId = null;
var mainIntervalCount = 20;
var mainIntervalLock = false;

var drawIntervalId = null;
var drawIntervalCount = 500;
var drawIntervalLock = false;

function init()
{
  context = world.getContext('2d');
  units = [];
  groups = [];
  groupColors = [];

  var startCount = get_random_int(1, 20);
  for (var i=0;i < startCount; i++)
  	createUnit();

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
		var len = units.length;
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

		document.getElementById('lifeCount').innerText=lifeCount;
		document.getElementById('deathCount').innerText=deathCount;
		document.getElementById('speciesCount').innerText=speciesCount;
		//alert(unit1.x + ' - ' + unit2.x);

		displayDate();
		displayGroups();
	}
	finally
	{
		mainIntervalLock = false;
	}
}

function draw()
{
	try
	{
		if (drawIntervalLock)
			return;
		drawIntervalLock = true;

		//log(units[0], units.length);
		context.clearRect(0,0, 500,400);
		var len = units.length;
		for (var i=0;i < len; i++)
		{
			if (units[i] == null)
				continue;

			units[i].draw(context);
		}
	}
	finally
	{
		drawIntervalLock = false;
	}
}

function checkForCollisions()
{
	var len = units.length;
	for (var i=0;i < len; i++)
	{
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
						if (get_random_int(1, 1000) == 1)
						{							
							var unit = createUnit();
							if (logLevel < 2)
								log(units[i], 'mate <div style="width:10px;height:10px;background-color:' + units[k].color + ';border:1px solid #000;float: left;"></div><div style="width:10px;height:10px;background-color:' + unit.color + ';border:1px solid #000;float: left;"></div>');
						}
					}
					else if (actionNum == 2)
					{
						if (get_random_int(1, 10) == 1)
						{
							var actionNum2 = get_random_int(1, 2);
							if (actionNum2 == 1)
							{
								if (logLevel < 2)
									log(units[k], 'kill <div style="width:10px;height:10px;background-color:' + units[i].color + ';border:1px solid #000;float: left;"></div>');
								killUnit(i);
							}
							else
							{
								if (logLevel < 2)
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

function log(unit, action)
{
	var logItem = '';
	if (unit == null)
		logItem = 'ERROR';
	else
		logItem = '<div style="width:10px;height:10px;background-color:' + unit.color + ';border:1px solid #000;float: left;"></div> Unit performed action: (' + action + ')';
	
	document.getElementById('log').innerHTML = logItem + '<br/>' + document.getElementById('log').innerHTML;
}

function createUnit(parentUnit)
{
	if (parentUnit == null)
		speciesCount++;
	
	var currentLen = units.length;
	units[currentLen] = new Unit(parentUnit);	
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
 
	document.getElementById('date').innerText = 'Day ' + d + ' of Year ' + y + ' ABB (After Big Bang)';
}

function displayGroups()
{
	var groupsHTML = '';
	for (var i=0;i < groups.length;i++)
		if (groups[i] > 0)
			groupsHTML += '<div style="width:10px;height:10px;background-color:' + groupColors[i] + ';border:1px solid #000;float: left;"></div> (' + i + ') ' + groups[i] + '<br/>';

	document.getElementById('groups').innerHTML = groupsHTML;
}
