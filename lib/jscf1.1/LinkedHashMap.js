LinkedHashMap = Class.extend(HashMap);

LinkedHashMap.prototype.root = null;
LinkedHashMap.prototype.accessOrder = null;


LinkedHashMap.prototype.LinkedHashEntry = Class.extend(HashMap.HashEntry);

LinkedHashMap.prototype.LinkedHashEntry.prototype.root = null;
LinkedHashMap.prototype.LinkedHashEntry.prototype.accessOrder = null;

LinkedHashMap.prototype.LinkedHashEntry.Constructor(
	function(clas, key, value){
		LinkedHashMap.prototype.LinkedHashEntry.superClass.call(this, key, value);
		this.clas = clas;
		if(this.clas.root == null){
			this.clas.root = this;
			this.pred = this;
		}else{
			this.pred = this.clas.root.pred;
			this.pred.succ = this;
			this.clas.root.pred = this;
		}
	}
);

LinkedHashMap.prototype.LinkedHashEntry.prototype.access = function(){
	if(this.accessOrder && this.succ != null){
		this.clas.modCount++;
		if(this == this.clas.root){
			this.clas.root = this.succ;
			this.pred.succ = this;
			this.succ = null;
		}else{
			this.pred.succ = this.succ;
			this.succ.pred = this.pred;
			this.succ = null;
			this.pred = this.clas.root.pred;
			this.pred.succ = this;
			this.clas.root.pred = this;
		}
	}
};

LinkedHashMap.prototype.LinkedHashEntry.prototype.cleanup = function(){
	if(this == this.clas.root){
		this.clas.root = this.succ;
		if(this.succ != null)
			this.succ.pred = this.pred;
	}else if(this.succ == null){
		this.pred.succ = null;
		this.clas.root.pred = this.pred;
	}else{
		this.pred.succ = this.succ;
		this.succ.pred = this.pred;
	}
};


LinkedHashMap.Constructor(
	function(){
		LinkedHashMap.superClass.call(this);
		this.accessOrder = false;
	}
);

LinkedHashMap.Constructor(
	function(arg){
		LinkedHashMap.superClass.call(this, arg);
		this.accessOrder = false;
	}
);

LinkedHashMap.Constructor(
	function(initCap, loadFactor){
		LinkedHashMap.superClass.call(this, initCap, loadFactor);
		this.accessOrder = false;
	}
);

LinkedHashMap.Constructor(
	function(initCap, loadFactor, accessOrder){
		LinkedHashMap.superClass.call(this, initCap, loadFactor);
		this.accessOrder = accessOrder;
	}
);

LinkedHashMap.Constructor(
	function(initCap, loadFactor, accessOrder){
		LinkedHashMap.superClass.call(this, initCap, loadFactor);
		this.accessOrder = accessOrder;
	}
);

LinkedHashMap.prototype.clear = function(){
	this.base.clear.call(this);
	this.root = null;
};

LinkedHashMap.prototype.containsValue = function(value){
	var e = this.root;
	while(e != null){
		if(AbstractCollection.equals(value, e.value))
			return true;
		e = e.succ;
	}
	return false;
};

LinkedHashMap.prototype.get = function(key){
	var idx = this.hash(key);
	var e = this.buckets[idx];
	while(e != null){
		if(AbstractCollection.equals(key, e.key)){
			e.access();
			return e.value;
		}
		e = e.next;
	}
	return null;
};

LinkedHashMap.prototype.removeEldestEntry = function(eldest){
	return false;
};

LinkedHashMap.prototype.addEntry = function(key, value, idx, callRemove){
	var e = new this.LinkedHashEntry(this, key, value);
	e.next = this.buckets[idx];
	this.buckets[idx] = e;
	if(callRemove && this.removeEldestEntry(this.root))
		this.remove(this.root.key);

};

LinkedHashMap.prototype.putAllInternal = function(map){
	this.root = null;
	this.base.putAllInternal.call(this,map);
};

LinkedHashMap.prototype.iterator = function(type){
	var itr = null;
	var outer = this;
	var Iter = Class.define().implement(Iterator);

	Iter.prototype.current = outer.root;
	Iter.prototype.last = null;
	Iter.prototype.knownMod = outer.modCount;

	Iter.prototype.hasNext = function(){
		if (this.knownMod != outer.modCount)
			throw new ConcurrentModificationException();
		return this.current != null;
	};

	Iter.prototype.next = function(){
		if (this.knownMod != outer.modCount)
			throw new ConcurrentModificationException();
		if(this.current == null)
			throw new NoSuchElementException();
		this.last = this.current;
		this.current = this.current.succ;
		return type == AbstractMap.VALUES ? this.last.value : type == AbstractMap.KEYS ? this.last.key : this.last;
	};

	Iter.prototype.remove = function(){
		if (this.knownMod != outer.modCount)
			throw new ConcurrentModificationException();
		if(this.last == null)
			throw new IllegalStateException();
		outer.remove(this.last.key);
		this.last = null;
		this.knownMod++;
	};

	return new Iter();
};
