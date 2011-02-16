LinkedHashSet = Class.extend(HashSet).implement(Set);

LinkedHashSet.Constructor(
	function(){
		LinkedHashSet.superClass.call(this);
	}
);

LinkedHashSet.Constructor(
	function(arg){
		LinkedHashSet.superClass.call(this, arg);
	}
);

LinkedHashSet.prototype.init = function(cap, load){
	return new LinkedHashMap(cap, load);
};