/*
    Class ArrayList
    Resizable-array implementation of the List interface. Implements all optional
    list operations, and permits all elements, including null.
    In addition to implementing the List interface, this class provides methods
    to manipulate the size of the array that is used internally to store the
    list.
*/


// Define the class
ArrayList = Class.extend(AbstractList);

ArrayList.DEFAULT_CAPACITY = 16;

ArrayList.Constructor(
	function(arg){
		if(arg && arg instanceof Array){
			var cap = arg.length;
			ArrayList.call(this, cap);
			for(var i = 0; i < cap; i++)
				this.add(arg[i]);
		}else if(arg && arg instanceof Object){
			var cap = Math.ceil(arg.size() * 1.1);
			ArrayList.call(this, cap);
			this.addAll(arg);
		}else if(arg && parseInt(arg) != NaN){
			if(arg < 0)
				throw new IllegalArgumentsException("Wrong arguments or no arguments specified.");
			this.modCount = 0;
			this.currentSize = 0;
			this.capacity = arg;
			this.data = new Array(arg);
		}
	}
);

ArrayList.Constructor(
	function(){
		ArrayList.call(this, ArrayList.DEFAULT_CAPACITY);
	}
);

ArrayList.prototype.trimToSize = function(){
	if (this.currentSize != this.data.length){
        var newData = new Array(this.currentSize);
        System.arraycopy(this.data, 0, newData, 0, this.currentSize);
    	this.data = newData;
    }
};

ArrayList.prototype.ensureCapacity = function(minCapacity){
	// Not needed as Javascript arrays are always of variable size.
	// Implemented for the sake of completeness
};

ArrayList.prototype.size = function(){
	return this.currentSize;
};

ArrayList.prototype.isEmpty = function(){
	return this.currentSize == 0;
};

ArrayList.prototype.contains = function(e){
    return this.indexOf(e) != -1;
};

ArrayList.prototype.indexOf = function(e){
     for (var i = 0; i < this.currentSize ; i++)
       if (AbstractCollection.equals(e, this.data[i]))
         return i;
     return -1;
};

ArrayList.prototype.lastIndexOf = function(e){
     for (var i = this.currentSize - 1; i >= 0; i--)
       if (AbstractCollection.equals(e, this.data[i]))
         return i;
     return -1;
};

ArrayList.prototype.toArray = function(){
	return this.data;
};

ArrayList.prototype.get = function(index){
	ArrayList.checkBoundExclusive.call(this, index);
	return this.data[index];
};

ArrayList.prototype.set = function(index, obj){
	ArrayList.checkBoundExclusive.call(this, index);
	var result = this.data[index];
    this.data[index] = obj;
    return result;
};

ArrayList.prototype.add = Class.initOverload();

ArrayList.prototype.add.overload(
	function(obj){
		this.modCount++;
		if(this.currentSize == this.data.length)
			this.capacity = this.data.length + 1;
		this.data[this.currentSize++] = obj;
		return true;
	}
);

ArrayList.prototype.add.overload(
	function(index, obj){
		ArrayList.checkBoundInclusive.call(this, index);
		this.modCount++;
		if(this.currentSize == this.data.length)
			this.capacity = this.data.length + 1;
		if (index != this.currentSize)
	       System.arraycopy(this.data, index, this.data, index + 1, this.currentSize - index);

		this.data[index] = obj;
		this.currentSize++;
	}
);

ArrayList.prototype.remove = function(index){
	ArrayList.checkBoundExclusive.call(this, index);
	var r = this.data[index];
	this.modCount++;
	if(index != --this.currentSize)
		System.arraycopy(this.data, index + 1, this.data, index, this.currentSize - index);
	this.data[this.currentSize] = null;
	return r;
};

ArrayList.prototype.clear = function(){
	if(this.currentSize > 0){
		// Allow for garbage collection
		for( var i = 0 ; i < this.currentSize ; i++)
			this.data[i] = null;
		this.currentSize = 0;
	}
};

ArrayList.prototype.addAll = Class.initOverload();

ArrayList.prototype.addAll.overload(
	function(collection){
	   this.addAll(this.currentSize, collection);
	}
);

ArrayList.prototype.addAll.overload(
	function(index, collection){
		ArrayList.checkBoundInclusive.call(this, index);
	    var itr = collection.iterator();
	    var csize = collection.size();

	    this.modCount++;
	    var end = index + csize;
	    if (this.currentSize > 0 && index != this.currentSize)
	    	System.arraycopy(this.data, index, this.data, end, this.currentSize - index);
	    this.currentSize += csize;
	    for ( ; index < end; index++)
	    	this.data[index] = itr.next();
	    return csize > 0;
	}
);

ArrayList.prototype.removeRange = function(fromIndex, toIndex){
	var change = toIndex - fromIndex;
	if(change > 0){
		this.modCount++;
		System.arraycopy(this.data, toIndex, this.data, fromIndex, this.currentSize - toIndex);
		this.currentSize -= change;
	}else if(change < 0){
		throw new IndexOutOfBoundsException();
	}
};

ArrayList.checkBoundExclusive = function(index){
	if(index >= this.currentSize)
		throw new IndexOutOfBoundsException("Index: " + index +
											", Size: "+ this.currentSize);
};

ArrayList.checkBoundInclusive = function(index){
	if(index > this.currentSize)
		throw new IndexOutOfBoundsException("Index: " + index +
											", Size: "+ this.currentSize);
};

ArrayList.prototype.removeAllInternal = function(collection){
	var i,j;
    for (i = 0; i < this.currentSize; i++)
    	if (collection.contains(this.data[i]))
        	break;
    if (i == this.currentSize)
    	return false;

    this.modCount++;
    for (j = i++; i < this.currentSize; i++)
    	if (!collection.contains(this.data[i]))
        	this.data[j++] = this.data[i];
    this.currentSize -= i - j;
    return true;
};

ArrayList.prototype.retainAllInternal = function(collection){
	var i,j;
    for (i = 0; i < this.currentSize; i++)
    	if (!collection.contains(this.data[i]))
        	break;
    if (i == this.currentSize)
    	return false;

    this.modCount++;
    for (j = i++; i < this.currentSize; i++)
    	if (!collection.contains(this.data[i]))
        	this.data[j++] = this.data[i];
    this.currentSize -= i - j;
    return true;
};

// ArrayList methods to support Javascript's Array functions
// Delegate the methods to Javascript's usual array methods
ArrayList.prototype.join = function(delimiter){
	return this.data.join(delimiter);
};

ArrayList.prototype.push = function(obj){
	this.add(obj);
};

ArrayList.prototype.pop = function(obj){
	return this.remove(this.size() - 1);
};

ArrayList.prototype.reverse = function(){
	return new ArrayList(this.data.reverse());
};

ArrayList.prototype.shift = function(){
	return this.remove(0);
};

ArrayList.prototype.slice = function(start, end){
	if(start && end)
		return new ArrayList(this.data.slice(start, end));
	else
		throw new IllegalArgumentsException();
};