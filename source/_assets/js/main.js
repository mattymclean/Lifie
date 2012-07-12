var units = [];  

var intervalId = null;
var context;
var w_width=500;
var w_height=400;

var lifeCount = 0;
var deathCount = 0;
var speciesCount = 0;

var logLevel = 0;

function init()
{

  context = world.getContext('2d');
  units = [];

  var startCount = get_random_int(1, 20);
  for (var i=0;i < startCount; i++)
  	units[i] = new Unit();
  lifeCount = units.length;
  speciesCount = lifeCount;

  clearInterval(intervalId);
  intervalId = setInterval(draw,20);
}

function draw()
{
	context.clearRect(0,0, 500,400);

	var len = units.length;
	for (var i=0;i < len; i++)
	{
		if (units[i] == null)
			continue;

		var output = units[i].process(context);
		if (output.duplicate)
		{
			var currentLen = units.length;
			units[currentLen] = new Unit();	
			units[currentLen].color = units[i].color;
			units[currentLen].x = units[i].x;
			units[currentLen].y = units[i].y;
			lifeCount++;

			if (logLevel < 1)
				log(units[i], 'duplicate');
		}
		if (output.die)
		{
			if (logLevel < 1)
				log(units[i], 'die');
			units[i] = null; //do this more efficiently
			lifeCount--;
			deathCount++;
		}
	}

	
	if (checkForCollisions())
	{
		
	}

	document.getElementById('lifeCount').innerText=lifeCount;
	document.getElementById('deathCount').innerText=deathCount;
	document.getElementById('speciesCount').innerText=speciesCount;
	//alert(unit1.x + ' - ' + unit2.x);
}

function checkForCollisions()
{
	var len = units.length;
	for (var i=0;i < len; i++)
	{
		for (var k=0;k < len; k++)
		{
			if (i != k && units[i] != null && units[k] != null
				&& units[i].color != units[k].color //temp part
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
							var currentLen = units.length;
							units[currentLen] = new Unit();
							//units[currentLen].color = '#' + units[i].color.substring(1, 3) + units[i].color.substring(4, 3);
							units[currentLen].x = units[i].x;
							units[currentLen].y = units[i].y;
							speciesCount++;
							log(units[i], 'mate <div style="width:10px;height:10px;background-color:' + units[k].color + ';border:1px solid #000;float: left;"></div><div style="width:10px;height:10px;background-color:' + units[currentLen].color + ';border:1px solid #000;float: left;"></div>');
						}
					}
					else if (actionNum == 2)
					{
						if (get_random_int(1, 10) == 1)
						{
							var actionNum2 = get_random_int(1, 2);
							if (actionNum2 == 1)
							{
								log(units[k], 'kill <div style="width:10px;height:10px;background-color:' + units[i].color + ';border:1px solid #000;float: left;"></div>');
								units[i] == null;
							}
							else
							{
								log(units[i], 'kill <div style="width:10px;height:10px;background-color:' + units[k].color + ';border:1px solid #000;float: left;"></div>');
								units[k] == null;
							}
							lifeCount--;
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