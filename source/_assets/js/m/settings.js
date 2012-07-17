function Settings()
{
	this.settings = {};

	function init() 
	{
		this.settings = {};

		//General
		CreateSetting('logLevel', 'Log Level', 1);
		CreateSetting('gameWidth', 'Game Width', 1000);
		CreateSetting('gameHeight', 'Game Height', 800);

		//Performance
		CreateSetting('mainIntervalCount', 'Main Interval Count', 20);
		CreateSetting('drawIntervalCount', 'Main Interval Count', 500);

	}
	init();

	function CreateSetting(key, name, defaultValue)
	{
		this.setting['logLevel'] = new Setting(key, name, defaultValue);

		Object.defineProperty(parent, 'key', {
     		get: function() { return this.settings[key]; },
     		set: function(value) { this.settings[key] = value;}
		});
	}
}