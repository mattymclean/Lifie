function SettingsBase()
{
	this._settings = {};

	this.init = function (parent) 
	{
		parent._settings = {};
	}
	this.init(this);

	this.CreateSetting = function (parent, key, name, defaultValue, defaultValue2)
	{
		parent._settings[key] = new Setting(key, name, defaultValue, defaultValue2);

		Object.defineProperty(parent, key, {
     		get: function() { return parent._settings[key]; },
     		set: function(value) { parent._settings[key] = value;}
		});
	}
}