function UI ()
{
	this.uiContext = null;

	function init (w, h)
	{
		var world = $('#world');
		world.width = w;
		world.height = h;

		var back = $('#back');
		back.style.width = w;
		back.style.height = h;

		this.uiContext = world.getContext('2d');		
	}

	//
	// Container / Stats
	//	
	this.drawContainer = function (lifeSim)
	{
		$('#lifeCount').html(lifeSim.stats.lifeCount);
		$('#deathCount').html(lifeSim.stats.deathCount);
		$('#speciesCount').html(lifeSim.stats.speciesCount);
		
		lifeSim.ui.drawDateUI();
		lifeSim.ui.drawGroupStats();
		lifeSim.ui.drawFoodStats();
		lifeSim.ui.drawLog();
	}

	this.drawDateUI = function (lifeSim)
	{
		var m = lifeSim.stats.minutes;

		var y = Math.floor(m / (60 * 24 * 365));
	    var y_divisor = m % (60 * 24 * 365);
	    var d = Math.floor(y_divisor / (60 * 24));
	    var d_divisor = m % (60 * 24);
	    var h = Math.floor(d_divisor / (60));
	 
		$('#date').innerHTML = 'Hour ' + h + ' of Day ' + d + ' of Year ' + y + ' ABB (After Big Bang)';
	}

	this.drawGroupStats = function (lifeSim)
	{
		var groups = lifeSim.data.getUnitGroupsList();

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

	this.drawFoodStats = function (lifeSim)
	{
		var foods = lifeSim.data.getFoodsList();

		$('#foodLabel').html('Food Types (' + foods.length + '):');
		var foodsHTML = '';
		for (var i=0;i < foods.length;i++)
			foodsHTML += '<div style="width:10px;height:10px;background-color:' + foods[i].color + ';border:1px solid #000;float: left;font-size:8px;">' + i + '</div> ' + foods[i].foodCount + ' (' + foods[i].regenCurrent + '=>' + foods[i].regenFoodAmount + ')<br/>';

		$('#foods').html(foodsHTML);
	}

	this.drawLog = function (lifeSim)
	{
		var logs = lifeSim.logs.getLogs()

		var logItem = '';
		if (unit == null)
			logItem = 'ERROR';
		else
			logItem = '<div style="width:10px;height:10px;background-color:' + unit.color + ';border:1px solid #000;float: left;"></div> Unit performed action: (' + action + ')';
		
		document.getElementById('log').innerHTML = logItem + '<br/>' + document.getElementById('log').innerHTML;
	}

	//
	// World
	//
	this.drawWorld = function (lifeSim, foods, units)
	{
		var uiContext = lifeSim.ui.uiContext;

		uiContext.clearRect(0,0, lifeSim.settings.gameWidth, lifeSim.settings.gameHeight);
		
		var len = foods.length;
		for (var i=0;i < len; i++)
		{
			if (foods[i] == null)
				continue;

			drawFood(lifeSim.ui.uiContext, foods[i]);
		}

		len = units.length;
		for (var i=0;i < len; i++)
		{
			if (units[i] == null)
				continue;

			drawUnit(lifeSim.ui.uiContext, units[i]);
		}
	}

	this.drawUnit = function (uiContext, unit)
	{
		uiContext.beginPath();
		uiContext.fillStyle = unit.color;
		uiContext.arc(unit.x, unit.y, unit.size, 0, Math.PI*2, true);
		uiContext.closePath();
		uiContext.fill();
	}

	this.drawFood = function (uiContext, food)
	{
		uiContext.beginPath();
		uiContext.fillStyle=this.color;
		uiContext.arc(food.x,food.y,food.size,0,Math.PI*2,true);
		uiContext.closePath();
		uiContext.fill();
	}
}