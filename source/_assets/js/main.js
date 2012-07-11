var units = [];  

var intervalId = null;
var context;
var w_width=500;
var w_height=400;

var lifeCount = 0;
var deathCount = 0;

function init()
{

  context = world.getContext('2d');
  units = [];
  units[0] = new Unit();
  units[1] = new Unit();
  units[2] = new Unit();
  units[3] = new Unit();
  lifeCount = units.length;

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
			log(units[i], 'duplicate');
		}
		if (output.die)
		{
			log(units[i], 'die');
			units[i] = null; //do this more efficiently
			lifeCount--;
			deathCount++;
		}
	}

	if (checkCollision())
	{
		units[units.length] = new Unit("000000");
	}

	document.getElementById('lifeCount').innerText=lifeCount;
	document.getElementById('deathCount').innerText=deathCount;
	//alert(unit1.x + ' - ' + unit2.x);
}

function checkCollision()
{
	var len = units.length;
	for (var i=0;i < len; i++)
	{
		for (var k=0;k < len; k++)
		{
			if (i != k && units[i] != null && units[k] != null)
			{
				if (units[i].x == units[k].x && units[i].y == units[k].y)
				{
					//alert(units[i].color + ' ' + units[k].color);
					//return true;
					return false; //for now
				}
			}
		}
	}

	return false;
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