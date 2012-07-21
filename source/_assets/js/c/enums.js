function Enums()
{
	this.settingTypes = null;

	this.init = function(parent)
	{
		parent.settingTypes = new Object();
		parent.settingTypes.int = 'int';
		parent.settingTypes.intRange = 'intRange';
		parent.settingTypes.string = 'string';
		parent.settingTypes.color = 'color';
	}
	this.init(this);
}