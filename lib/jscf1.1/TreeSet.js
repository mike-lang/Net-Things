TreeSet = Class.extend(AbstractSet).implement(SortedSet);

TreeSet.prototype.map = null;

TreeSet.Constructor(
	function(){
		this.map = new TreeMap();
	}
);

TreeSet.Constructor(
	function(arg){
		if(arg && arg.put){
			this.map = arg;
		}else if(arg && arg.type == "Object" && arg.size){
			this.map = new TreeMap();
			this.addAll(arg);
		}else if(arg && arg.compare){
			this.map = new TreeMap(arg);
		}else if(arg && arg.comparator){
			this.map = new TreeMap(arg.comparator());
			var itr = arg.iterator();
			this.map.putKeysLinear(itr, arg.size());
		}
	}
);

TreeSet.prototype.addAll = function(c){
	var result = false;
	var pos = c.size();
	var itr = c.iterator();
	while(--pos >= 0)
		result |= (this.map.put(itr.next(), "") == null);
	return result;
};

TreeSet.prototype.add = function(obj){
	return this.map.put(obj, "") == null;
};

TreeSet.prototype.clear = function(){
	this.map.clear();
};

TreeSet.prototype.comparator = function(){
	this.map.comparator();
};

TreeSet.prototype.contains = function(obj){
	return this.map.containsKey(obj);
};

TreeSet.prototype.first = function(){
	return this.map.firstKey();
};

TreeSet.prototype.headSet = function(to){
	return new TreeSet(this.map.headMap(to));
};

TreeSet.prototype.isEmpty = function(){
	return this.map.isEmpty();
};

TreeSet.prototype.iterator = function(){
	return this.map.keySet().iterator();
};

TreeSet.prototype.last = function(){
	return this.map.lastKey();
};

TreeSet.prototype.remove = function(obj){
	return (this.map.remove(obj) != null);
};

TreeSet.prototype.size = function(obj){
	return this.map.size();
};

TreeSet.prototype.subSet = function(from, to){
	return new TreeSet(this.map.subMap(from, to));
};

TreeSet.prototype.tailSet = function(from){
	return new TreeSet(this.map.tailMap(from));
};
