function Food () 
{
	this._settings = new SettingsBase();

	this.init = function(parent)
	{
		this.ticks = 0;

		parent._settings.CreateSetting(parent, 'color', parent.settingTypes.color, 'Food Color', null);
		parent._settings.CreateSetting(parent, 'x', parent.settingTypes.intRange, 'Food X', 0, w_width);
		parent._settings.CreateSetting(parent, 'y', parent.settingTypes.intRange, 'Food Y', 0, w_height);

		parent._settings.CreateSetting(parent, 'foodMax', parent.settingTypes.intRange, 'Food Max', 1, 100000);
		parent._settings.CreateSetting(parent, 'foodCount', parent.settingTypes.intRange, 'Food Count', 1, 50000);
		parent._settings.CreateSetting(parent, 'regenRate', parent.settingTypes.intRange, 'Food Regeneration Rate', 50, 2000);
		parent._settings.CreateSetting(parent, 'regenFoodAmount', parent.settingTypes.intRange, 'Food Regeneration Amount', 1000, 10000);
		
		this.regenCurrent = this.regenRate;
		this.size = 0;
	}
	this.init(this);

	function FoodOutput(parent)
	{
		
	}
}