Mike.NetThings.Core = function () {

var objectState = [
{ name: 'object1', top: 10, left: 50, height:30, width: 30, color: 'Grey'},
{ name: 'object2', top: 100, left: 100, height:50, width: 50, color: 'Red'}
]

var render = function() {
	for (var objectSpec in objectState)
	{
		var objectHtml = "<div class='object'>" + objectSpec.name + "</div>";
		$('#objects').add(objectHtml).css(
		{
			'top' : objectSpec.top,
			'left' : objectSpec.left,
			'height' : objectSpec.height,
			'width' : objectSpec.width,
			'background-color' : objectSpec.color
		});
	}
}

return {
	render: render
}

}();