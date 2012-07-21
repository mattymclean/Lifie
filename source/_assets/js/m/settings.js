function Settings()
{
	this._settings = new SettingsBase();

	this.init = function (parent) 
	{
		//General
		parent._settings.CreateSetting(parent, 'logLevel', _LifeSim.enums.settingTypes.int, 'Log Level', 1);
		parent._settings.CreateSetting(parent, 'gameWidth', _LifeSim.enums.settingTypes.int, 'Game Width', 1000);
		parent._settings.CreateSetting(parent, 'gameHeight', _LifeSim.enums.settingTypes.int, 'Game Height', 800);

		//Performance
		parent._settings.CreateSetting(parent, 'mainIntervalCount', _LifeSim.enums.settingTypes.int, 'Main Interval Count', 20);
		parent._settings.CreateSetting(parent, 'drawIntervalCount', _LifeSim.enums.settingTypes.int, 'Main Interval Count', 500);

		//Units
		parent._settings.CreateSetting(parent, 'unitStartCount', _LifeSim.enums.settingTypes.intRange, 'Unit Start Count', 25, 200);
		

		//Food
		parent._settings.CreateSetting(parent, 'foodStartCount', _LifeSim.enums.settingTypes.intRange, 'Food Start Count', 1, 40);
	}
	this.init(this);
}