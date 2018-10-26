function Data()
{
	this.init = function () 
	{
		this.currentUnitId = 0;
		this.currentUnitTypeId = 0;

		this._units = [];
		this._foods = [];
		this._groups = [];
		this._groupColors = [];
	}
	this.init();

	this.getUnitsList = function (lifeSim)
	{
		return lifeSim.data._units;
	}

	this.getUnitGroupsList = function (lifeSim)
	{
		return lifeSim.data._groups;
	}

	this.getFoodsList = function (lifeSim)
	{
		return lifeSim.data._foods;
	}


}