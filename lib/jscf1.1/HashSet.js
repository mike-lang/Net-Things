HashSet = Class.extend(AbstractSet);

HashSet.prototype.map = null;

HashSet.Constructor(
	function(){
		HashSet.call(this, HashMap.DEFAULT_CAPACITY, HashMap.LOAD_FACTOR);
	}
);

HashSet.Constructor(
	function(arg){
		if(arg && arg.type == "Number")
			HashSet.call(this, arg, HashMap.LOAD_FACTOR);
		else if(arg && arg.type == "Object"){
			HashSet.call(this, Math.max(arg.size() * 2, HashMap.DEFAULT_CAPACITY));
			this.addAll(arg);
		}
	}
);

HashSet.Constructor(
	function(initCap, loadFactor){
		this.map = this.init(initCap, loadFactor);
	}
);

HashSet.prototype.add = function(obj){
	return this.map.put(obj, "");
};

HashSet.prototype.clear = function(obj){
	this.map.clear();
};

HashSet.prototype.contains = function(obj){
	return this.map.containsKey(obj);
};

HashSet.prototype.isEmpty = function(){
	return this.map.size() == 0;
};

HashSet.prototype.iterator = function(){
	return this.map.iterator(AbstractMap.KEYS);
};

HashSet.prototype.remove = function(obj){
	return (this.map.remove(obj) != null);
};

HashSet.prototype.size = function(obj){
	return this.map.size();
};

HashSet.prototype.init = function(capacity, load){
	return new HashMap(capacity, load);
};