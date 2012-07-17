function Setting()
{
	function init(key, name, defaultValue)
	{
		this.key = key;
		this.name = name;
		this.defaultValue = defaultValue;
		this.value = this.defaultValue;
	}
	init();
}