function UI()
{
	function init(w, h)
	{
		var world = $('#world');
		world.width = w;
		world.height = h;

		this.context = world.getContext('2d');

		var back = $('#back');
		back.style.width = w;
		back.style.height = h;
	}

}