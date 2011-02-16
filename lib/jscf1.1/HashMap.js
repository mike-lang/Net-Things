HashMap = Class.extend(AbstractMap);

HashMap.DEFAULT_CAPACITY = 11;
HashMap.LOAD_FACTOR = 0.75;

// Instance varaibles
HashMap.prototype.threshold;
HashMap.prototype.loadFactor;
HashMap.prototype.buckets;
HashMap.prototype.modCount = 0;
HashMap.prototype.currentSize = 0;
HashMap.prototype.entries;

HashMap.HashEntry = Class.extend(AbstractMap.BasicMapEntry);

HashMap.HashEntry.Constructor(
	function(key, value){
		HashMap.HashEntry.superClass.call(this, key, value);
		this.next = null;
	}
);

HashMap.HashEntry.prototype.access = function(){
	// Does nothing. But in Linked Hashmap it must do some book keeping
};

HashMap.HashEntry.prototype.cleanup = function(){
	return this.value;
};

HashMap.Constructor(
	function(){
		HashMap.call(this, HashMap.DEFAULT_CAPACITY, HashMap.LOAD_FACTOR);
	}
);

HashMap.Constructor(
	function(arg){
		if(arg && arg instanceof Object){
			HashMap.call(this, Math.max(arg.size() * 2, HashMap.DEFAULT_CAPACITY), HashMap.LOAD_FACTOR);
			this.putAll(arg);
		}else if(arg){
			HashMap.call(this, arg, HashMap.LOAD_FACTOR);
		}
	}
);

HashMap.Constructor(
	function(initCap, loadFactor){
		if(initCap < 0)
			throw new IllegalArgumentException("Illegal Capacity: " +
													initCap);
		if(!(loadFactor > 0))
			throw new IllegalArgumentException("Illegal Load: " +
													loadFactor);
		if(initCap == 0)
			initCap = 1;

		this.buckets = new Array(initCap);
		this.loadFactor = loadFactor;
		this.threshold = (initCap * loadFactor);
	}
);

HashMap.prototype.size = function(){
	return this.currentSize;
};

HashMap.prototype.isEmpty = function(){
	return this.currentSize == 0;
};

HashMap.prototype.get = function(key){
	var idx = this.hash(key);
	var e = this.buckets[idx];
	while(e != null){
		if(AbstractCollection.equals(key, e.key))
			return e.value;
		e = e.next;
	}
	return null;
};

HashMap.prototype.containsKey = function(key){
	var idx = this.hash(key);
	var e = this.buckets[idx];
	while(e != null){
		if(AbstractCollection.equals(key, e.key))
			return true;
		e = e.next();
	}
	return false;
};

HashMap.prototype.put = function(key, value){
	var idx = this.hash(key);
	var e = this.buckets[idx];
	while(e != null){
		if(AbstractCollection.equals(key, e.key)){
			e.access();
			var r = e.value;
			e.value = value;
			return r;
		}else
			e = e.next;
	}
	// At this point, we know we need to add a new entry.
	this.modCount++;
	if(++this.currentSize > this.threshold){
		HashMap.rehash.call(this);
		// Need a new hash value to suit the bigger table.
		idx = this.hash(key);
	}
	// LinkedHashMap cannot override put(), hence this call.
	this.addEntry(key, value, idx, true);
	return null;
};

HashMap.prototype.putAll = function(map){
	var itr = map.entrySet().iterator();
	while(itr.hasNext()){
		var e = itr.next();
		this.put(e.getKey(), e.getValue());
	}
};

HashMap.prototype.remove = function(key){
	var idx = this.hash(key);
	var e = this.buckets[idx];
	var last = null;

	while(e != null){
		if(AbstractCollection.equals(key, e.key)){
			this.modCount++;
			if(last == null)
				this.buckets[idx] = e.next;
			else
				last.next = e.next;
			this.currentSize--;
			// Method call necessary for LinkedHashMap to work correctly.
			return e.cleanup();
		}
		last = e;
		e = e.next();
	}
	return null;
};

HashMap.prototype.clear = function(){
	this.modCount++;
	this.buckets = new Array();
	this.currentSize = 0;
};

HashMap.prototype.containsValue = function(value){
	for(var i = this.buckets.length - 1; i >= 0; i--){
		var e = this.buckets[i];
		while(e != null){
			if(AbstractCollection.equals(value, e.value))
				return true;
			e = e.next;
		}
	}
	return false;
};

HashMap.prototype.keySet = function(){
	var outer = this;
	if(this.keys == null){
		var NewAbs = Class.extend(AbstractSet);

		NewAbs.prototype.size = function(){
			return outer.currentSize;
		};

		NewAbs.prototype.contains = function(key){
			return outer.containsKey(key);
		};

		NewAbs.prototype.iterator  = function(){
			return outer.iterator(AbstractMap.KEYS);
		};

		NewAbs.prototype.remove = function(obj){
			var oldSize = outer.currentSize;
			outer.remove(obj);
			return oldSize != outer.currentSize;
		};
		this.keys = new NewAbs();
	}
	return this.keys;
};

HashMap.prototype.values = function(){
	var outer = this;
	if(this.vals == null){
		var NewAbs = Class.extend(AbstractCollection);
		NewAbs.prototype.size = function(){
			return outer.currentSize;
		};

		NewAbs.prototype.iterator  = function(){
			return outer.iterator(AbstractMap.VALUES);
		}

		NewAbs.prototype.clear = function(){
			outer.clear();
		};

		this.vals = new NewAbs();
	}
	return this.vals;
};

HashMap.prototype.entrySet = function(){
	var outer = this;
	if(this.entries == null){
		var absSet = Class.extend(AbstractSet);

		absSet.prototype.size = function(){
			return outer.currentSize;
		};

		absSet.prototype.iterator = function(){
			return outer.iterator(AbstractMap.ENTRIES);
		};

		absSet.prototype.clear = function(){
			outer.clear();
		};

		absSet.prototype.contains = function(obj){
			return outer.getEntry(obj) != null;
		};

		absSet.prototype.remove = function(obj){
			var e = outer.getEntry(obj);
			if(e != null){
				outer.remove(e.key);
				return true;
			}
			return false;
		};
		this.entries = new absSet();
	}
	return this.entries;
};

HashMap.prototype.addEntry = function(key, value, idx, callRemove){
	var e = new HashMap.HashEntry(key, value);
	e.next = this.buckets[idx];
	this.buckets[idx] = e;
};

HashMap.prototype.getEntry = function(obj){
	if(! (obj instanceof Object))
		return null;
	var me = obj;
	var key = me.getKey();
	var idx = this.hash(key);
	var e = this.buckets[idx];
	while(e != null){
		if(AbstractCollection.equals(e.key, key))
			return AbstractCollection.equals(e.value, me.getValue()) ? e : null;
	}
	return null;
};

HashMap.prototype.hash = function(key){
	return key == null ? 0 : Math.abs(key.hashCode() % this.buckets.length);
};

HashMap.prototype.iterator = function(type){
	return new this.HashIterator(this, type);
};

HashMap.prototype.putAllInternal = function(map){
	var itr = m.entrySet().iterator();
	this.currentSize = 0;
	while (itr.hasNext()){
		this.currentSize++;
		var e = itr.next();
		var key = e.getKey();
		var idx = this.hash(key);
		this.addEntry(key, e.getValue(), idx, false);
	}
};

HashMap.rehash = function(){
	var oldBuckets = this.buckets;
    var newcapacity = (this.buckets.length * 2) + 1;
    this.threshold = parseInt((newcapacity * this.loadFactor));
    this.buckets = new Array(newcapacity);

    for (var i = oldBuckets.length - 1; i >= 0; i--){
    	var e = oldBuckets[i];
        while (e != null){
        	var idx = this.hash(e.key);
            var dest = this.buckets[idx];
            var next = e.next;
            e.next = this.buckets[idx];
            this.buckets[idx] = e;
            e = next;
    	}
	}
};

// Non-static inner class
HashMap.prototype.HashIterator = Class.define().implement(Iterator);

HashMap.prototype.HashIterator.prototype.type = 0;
HashMap.prototype.HashIterator.prototype.last = null;
HashMap.prototype.HashIterator.prototype.nxt = null;

HashMap.prototype.HashIterator.Constructor(
	function(obj, type){
		this.me = obj;
		this.type = type;
		this.knownMod = obj.modCount;
		this.count = obj.size();
		this.idx = obj.buckets.length;
	}
);

HashMap.prototype.HashIterator.prototype.hasNext = function(){
	if(this.knownMod != this.me.modCount)
		throw new ConcurrentModificationException();
	return this.count > 0;
};

HashMap.prototype.HashIterator.prototype.next = function(){
	if(this.knownMod != this.me.modCount)
		throw new ConcurrentModificationException();
	if(this.count == 0)
		throw new NoSuchElementException();
	this.count--;

	var e = this.nxt;
	while( (e == null || e == undefined))
		e = this.me.buckets[--this.idx];

	this.nxt = e.next;
	this.last = e;

	if(this.type == AbstractMap.VALUES)
		return e.value;
	if(this.type == AbstractMap.KEYS)
		return e.key;
	return e;
};

HashMap.prototype.HashIterator.prototype.remove = function(){
	if(this.knownMod != me.modCount)
		throw new ConcurrentModificationException();
	if(this.last == null)
		throw new IllegalStateException();

	this.me.remove(this.last.key);
	this.last = null;
	this.knownMod++;
};

