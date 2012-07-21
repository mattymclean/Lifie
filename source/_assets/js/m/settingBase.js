function Setting(key, type, name, defaultValue, defaultValue2)
{
	this.init = function (key, type, name, defaultValue, defaultValue2)
	{
		this.key = key;
		this.type = type;
		this.name = name;

		if (type == _LifeSim.enums.settingTypes.int
			|| type == _LifeSim.enums.settingTypes.string)
		{
			this.defaultValue = defaultValue; //In this case, these is only one value
			this.value = this.defaultValue;
		}
		else if (type == _LifeSim.enums.settingTypes.intRange)
		{
			this.defaultValue = defaultValue; //In this case, defaultValue is Min
			this.defaultValue2 = defaultValue2;  //In this case, defaultValue is Max
			this.value = _LifeSim.utils.getRandomInt(this.defaultValue, this.defaultValue2);
		}
		else if (type == _LifeSim.enums.settingTypes.color)
		{
			if (LifeSim.utils.isNullOrWhitespace(defaultValue))
				this.defaultValue = LifeSim.utils.getRandomColor();
			this.defaultValue = defaultValue; //In this case, defaultValue is a defined (or random) color
			this.value = this.defaultValue;
		}
	}
	this.init(key, type, name, defaultValue, defaultValue2);
}