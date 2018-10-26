function Stats(unitCount, foodCount)
{
	function init(parent, unitCount, foodCount)
	{
		this.minutes = 0;

		parent.stats.lifeCount = unitCount;
		this.deathCount = 0;
		parent.stats.speciesCount = unitCount;
	}
	this.init(parent, unitCount, foodCount);

	function tick()
	{
		this.minutes++;
	}
}