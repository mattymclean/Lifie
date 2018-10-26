function LifeSim () {
	this.mainIntervalId = null;
	this.mainIntervalLock = false;
	this.drawIntervalId = null;
	this.drawIntervalLock = false;

	//c
	this.enums = null;
	this.utils = null;
	this.logsController = null;
	this.unitController = null;
	this.foodController = null;
	this.collisionController = null;

	//v
	this.ui = null;

	//m
	this.data = null;
	this.settings = null;
	this.stats = null;

	this.init = function (lifeSim)
	{
		lifeSim.enums = new Enums();
		lifeSim.utils = new Utils();

		lifeSim.settings = new Settings();
		
		lifeSim.logsController = new LogController();
		lifeSim.unitController = new UnitController();
		lifeSim.foodController = new FoodController();
		lifeSim.collisionController = new CollisionController();
		lifeSim.ui = new UI(lifeSim.settings.gameWidth, lifeSim.settings.gameHeight);
	}

	this.initGame = function (lifeSim)
	{
		lifeSim.data = new Data();

		var startCount = lifeSim.settings.unitStartCount;
		for (var i=0;i < startCount; i++)
			lifeSim.unitController.createUnit(lifeSim);

		var foodCount = lifeSim.settings.foodStartCount;
		for (var i=0;i < foodCount; i++)
			lifeSim.foodController.createFood(lifeSim);

		var units = lifeSim.data.getUnitsList(lifeSim);
		var foods = lifeSim.data.getFoodsList(lifeSim);
		lifeSim.stats = new Stats(units.length, foods.length);

		lifeSim.start(lifeSim);
	}

	this.start = function (lifeSim)
	{
		clearInterval(lifeSim.mainIntervalId);
		lifeSim.mainIntervalId = setInterval(function(lifeSim) { lifeSim.process(lifeSim); }, lifeSim.mainIntervalCount);

		clearInterval(lifeSim.drawIntervalId);
		lifeSim.drawIntervalId = setInterval(function(lifeSim) { lifeSim.draw(lifeSim); }, lifeSim.drawIntervalCount);
	}

	this.stop = function (lifeSim)
	{
		clearInterval(lifeSim.mainIntervalId);
		clearInterval(lifeSim.drawIntervalId);
	}

	this.process = function (lifeSim)
	{
		try
		{
			if (lifeSim.mainIntervalLock)
				return;
			lifeSim.mainIntervalLock = true;

			lifeSim.stats.tick();

			var foods = lifeSim.data.GetFoodsList();
			lifeSim.foodController.processFoods();

			lifeSim.collision.processCollisions();
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

	this.draw = function (lifeSim)
	{
		try
		{
			if (drawIntervalLock)
				return;
			drawIntervalLock = true;

			var foods = lifeSim.data.getFoodsList();
			var units = lifeSim.data.getUnitsList();
			lifeSim.ui.drawWorld(lifeSim, foods, units);

			lifeSim.ui.drawContainer();
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
}

var _LifeSim = new LifeSim();
$(document).ready(function() { _LifeSim.init(_LifeSim); })