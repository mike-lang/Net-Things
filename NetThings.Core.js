var Mike;
Mike = Mike || {};
Mike.NetThings = Mike.NetThings || {};

Mike.NetThings.Core = function () {

var applyMovable = function(target) {
	target.draggable({stop: dragStop});
};

var applyPortal = function(target, params) {
	var destination = params.destination;
	target.data('portal', function(objectId) { handlePortal(destination, objectId);}); 
};

var handlePortal = function(destintation, objectId){
	var object = placeObjects[objectId];
	delete placeObjects['objectId'];
	objectState[destination][objectId] = object;
	saveState();
};


var behaviorHandlers = {
'movable' : applyMovable,
'portal' : applyPortal
};

// hash where key is the page key, value is the page's objects
var initialState = {
'chaos' : {
			'greybox' :	{ name: '', top: 10, left: 50, height:30, width: 30, color: 'Grey', behaviors: [{type:'movable'}] },
			'redbox' : { name: '', top: 100, left: 100, height:50, width: 50, color: 'Red', behaviors: [{type:'movable'}] },
			'world1portal' : { name: '', top: 300, left: 600, height:100, width: 100, color: 'Black', behaviors: [{type:'portal', params : {destination:'world1'}}]} 
		  },
'world1' : {}
};


var objectState;
var placeObjects;

var dragStop = function(e, ui) {
	// when someone finishes dragging an object, let's update its object state
	// and save it into a cookie
	
	var objectId = ui.helper.attr('id');
	placeObjects[objectId].top = ui.position.top;
	placeObjects[objectId].left = ui.position.left;
	
	saveState();	
};

var clearSavedState = function() {
	createCookie('thingsState', '', -1);
};

var saveState = function() {
	objectState[inferPlace()] = placeObjects;
	createCookie('thingsState', JSON.stringify(objectState));
};

var loadState = function() {
	var stateJson = readCookie('thingsState');
	if (stateJson)
	{
		objectState = JSON.parse(stateJson);
	} else {
		objectState = initialState;
	}
	
	loadPlace();
};

var getPlaceObjects = function(place) {
	place = place || inferPlace();
	return objectState[place];
};

var inferPlace = function() {
	var pathParts = window.location.pathname.split('/');
	var lastPart = pathParts[pathParts.length - 1];
	var inferredPlace = lastPart.split('.')[0];
	return inferredPlace;
};

var loadPlace = function() {
	placeObjects = getPlaceObjects();
};

var render = function() {
	
	for (var i in placeObjects)
	{
		var objectSpec = placeObjects[i];
		var id = i;
		var objectHtml = "<div id='" + id + "' class='object'>" + objectSpec.name + "</div>";
		$('#objects').append(objectHtml);
		$('#' + id).css(
		{
			'top' : objectSpec.top,
			'left' : objectSpec.left,
			'height' : objectSpec.height,
			'width' : objectSpec.width,
			'background-color' : objectSpec.color
		});
		
		var behaviors = objectSpec.behaviors;
		
		for (j=0;j<behaviors.length;j++) {
			var behavior = behaviors[j];
			var handler = behaviorHandlers[behavior.type];
			handler($('#' + id), behavior.params);
		}
		
	}
};

return {
	render: render,
	loadState: loadState,
	clearSavedState: clearSavedState
};

}();