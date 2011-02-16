/**
 * A basic implementation of most of the methods in the Collection interface to
 * make it easier to create a collection. To create an unmodifiable Collection,
 * just subclass AbstractCollection and provide implementations of the
 * iterator() and size() methods. The Iterator returned by iterator() need only
 * provide implementations of hasNext() and next() (that is, it may throw an
 * UnsupportedOperationException if remove() is called). To create a modifiable
 * Collection, you must in addition provide an implementation of the
 * add(Object) method and the Iterator returned by iterator() must provide an
 * implementation of remove(). Other methods should be overridden if the
 * backing data structure allows for a more efficient implementation. The
 * precise implementation used by AbstractCollection is documented, so that
 * subclasses can tell which methods could be implemented more efficiently.
 */
AbstractCollection = Class.define().implement(Collection);

/**
 * The main constructor, for use by subclasses.
 */
AbstractCollection.Constructor(
	function(){

	}
);

/**
 * Add an object to the collection.
 */
AbstractCollection.prototype.add = function(){
	throw new UnsupportedOperationException();
};

/**
 * Add all the objects of a collection
 */
AbstractCollection.prototype.addAll = function(collection){
	var itr = collection.iterator();
	var modified = false;
    var size = collection.size();
    for (var pos = size; pos > 0; pos--)
	    modified |= this.add(itr.next());
    return modified;
};

/**
 * Empty the collection
 */
AbstractCollection.prototype.clear = function(){
	var itr = this.iterator();
    var pos = this.size();
    while (--pos >= 0){
    	itr.next();
    	itr.remove();
    }
};

/**
 * Check if the collection has the element.
 */
AbstractCollection.prototype.contains = function(obj){
    var itr = this.iterator();
    var pos = this.size();
    while (--pos >= 0)
      if (AbstractCollection.equals(obj, itr.next()))
        return true;
    return false;
};

/**
 * Check if the collection has all the elements of another collection
 */
AbstractCollection.prototype.containsAll = function(collection){
    var itr = collection.iterator();
    var pos = collection.size();
    while (--pos >= 0)
      if ( !this.contains(itr.next()))
        return false;
    return true;
};

/**
 * Check if collection is empty.
 */
AbstractCollection.prototype.isEmpty = function(){
	return this.size() == 0;
};

/**
 * Remove an element from collection.
 */
AbstractCollection.prototype.remove = function(obj){
	this.checkBoundExclusive(index);
	var r = this.data[index];
	this.modCount++;
	if(index != --this.currentSize)
		System.arraycopy(this.data, index + 1, this.data, index, this.currentSize - index);
	this.data[this.currentSize] = null;
	return r;
};

/**
 * Remove a set of elements from the collection.
 */
AbstractCollection.prototype.removeAll = function(collection){
   return AbstractCollection.removeAllInternal.call(this, collection);
};

/**
 * Private Method to remove a set of elements from a collection
 */
AbstractCollection.removeAllInternal = function(collection){
	var itr = this.iterator();
	var modified = false;
	var pos = this.size();
	while(--pos >= 0)
		if(collection.contains(itr.next())){
			itr.remove();
			modified = true;
		}
    return modified;
};

/**
 * Retain all the elements and remove the rest
 */
AbstractCollection.prototype.retainAll = function(collection){
   return AbstractCollection.retainAllInternal.call(this, collection);
};

/**
 * Private method to retain all the elements and remove the rest
 */
AbstractCollection.retainAllInternal = function(collection){
	var itr = this.iterator();
	var modified = false;
	var pos = this.size();
	while(--pos >= 0)
		if(!collection.contains(itr.next())){
			itr.remove();
			modified = true;
		}
    return modified;
};

/**
 * Return an array of elements.
 */
AbstractCollection.prototype.toArray = function(collection){
   	var itr = this.iterator();
	var siz = this.size();
	var arr = new Array(siz);
	for(var pos = 0; pos < siz; pos++){
		arr[pos] = itr.next();
	}
	return a;
};

AbstractCollection.prototype.toString = function(collection){
   	var itr = this.iterator();
	var siz = this.size();
	var str = "[";
	for(var pos = 0; pos < siz; pos++){
		str += itr.next();
		if(pos > 1)
			str += ", ";
	}
	return str + "]";
};

/**
  * Compare two objects according to Collection semantics.
  *
  * @param o1 the first object
  * @param o2 the second object
  * @return o1 == null ? o2 == null : o1.equals(o2)
  */
AbstractCollection.equals = function(obj1, obj2){
    return obj1 == null ? obj2 == null : obj1.equals(obj2);
};


/////////////////////////////////////////////////////////////////////
//////				Class AbstractList                       ////////
/////////////////////////////////////////////////////////////////////
/**
 * A basic implementation of most of the methods in the List interface to make
 * it easier to create a List based on a random-access data structure. If
 * the list is sequential (such as a linked list), use AbstractSequentialList.
 * To create an unmodifiable list, it is only necessary to override the
 * size() and get(int) methods (this contrasts with all other abstract
 * collection classes which require an iterator to be provided). To make the
 * list modifiable, the set(int, Object) method should also be overridden, and
 * to make the list resizable, the add(int, Object) and remove(int) methods
 * should be overridden too. Other methods should be overridden if the
 * backing data structure allows for a more efficient implementation.
 * The precise implementation used by AbstractList is documented, so that
 * subclasses can tell which methods could be implemented more efficiently.
*/
AbstractList = Class.extend(AbstractCollection).implement(List);

/**
 * The main constructor, for use by subclasses.
 */
AbstractList.Constructor(
	function(){

	}
);

AbstractList.prototype.add = Class.initOverload();

/**
 * Add an object to the list at a specific index
 */
AbstractList.prototype.add.overload(
	function(index, obj){
		throw new UnsupportedOperationException();
	}
);

/**
 * Add an object to the list.
 */
AbstractList.prototype.add.overload(
	function(obj){
		this.add(this.size(), obj);
		return true;
	}
);

/**
 * Add all the objects to the list
 */
AbstractList.prototype.addAll = function(index, collection){
	var itr = collection.iterator();
    var size = collection.size();
    for (var pos = size; pos > 0; pos--)
	    this.add(index++, itr.next());
    return size > 0;
};

/**
 * Empty the list
 */
AbstractList.prototype.clear = function(){
	this.removeRange(0, this.size());
};

/**
 * Equals method overridden
 */
AbstractList.prototype.equals = function(obj){
	if (obj == this)
    	return true;
    if (! (obj instanceof Object))
	    return false;
    var size = this.size();
    if (size != obj.size())
    	return false;

    var itr1 = this.iterator();
    var itr2 = obj.iterator();

    while (--size >= 0)
    	if (! AbstractCollection.equals(itr1.next(), itr2.next()))
		    return false;
    return true;
};


/**
 * Find the position of an element in the list
 */
AbstractList.prototype.indexOf= function(obj){
	var itr = this.listIterator();
    var size = this.size();
    for (var pos = 0; pos < size; pos++)
    	if (AbstractCollection.equals(obj, itr.next()))
    		return pos;
    return -1;
};

/**
 * Find the last position of an element in the list
 */
AbstractList.prototype.lastIndexOf= function(obj){
	var pos = this.size();
	var itr = this.listIterator();
	while (--pos >= 0)
    	if (AbstractCollection.equals(obj, itr.previous()))
        	return pos;
    return -1;
};

/**
 * Obtain an Iterator over this list, whose sequence is the list order.
 */
AbstractList.prototype.iterator = function(){
	var outer = this;
	return new function(){
		this.pos = 0;
		this.size = outer.size();
		this.last = -1;
		this.knowMod = outer.modCount;

		this.checkMod = function(){
			if(parseInt(this.knowMod) != parseInt(outer.modCount))
				throw new ConcurrentModificationException();
		};

		this.hasNext = function(){
			this.checkMod();
			return this.pos < this.size;
		};

		this.next = function(){
			this.checkMod();
			if(this.pos == this.size)
				throw new NoSuchElementException();
			this.last = this.pos;
			return outer.get(this.pos++);
		};

		this.remove = function(){
			this.checkMod();
			if(this.last < 0)
				throw new IllegalStateException();
			outer.remove(this.last);
			this.pos--;
			this.size--;
			this.last = -1;
			this.knowMod = outer.modCount;
		};
	};
};

/**
 * Obtain a ListIterator over this list, starting at a given position.
 */
AbstractList.prototype.listIterator = Class.initOverload();

AbstractList.prototype.listIterator.overload(
	function(){
		return this.listIterator(0);
	}
);

AbstractList.prototype.listIterator.overload(
	function(index){
		var outer = this;
		if(index < 0 || index > this.size())
			throw new IndexOutOfBoundsException("Index: " + index + ", Size: "
													+ this.size());

		return new function(){
			this.position = index;
			this.size = outer.size();
			this.lastReturned = -1;
			this.knowMod = outer.modCount;

			this.checkMod = function(){
				if(parseInt(this.knowMod) != parseInt(outer.modCount))
					throw new ConcurrentModificationException();
			};

			this.hasNext = function(){
				this.checkMod();
				return this.position < this.size;
			};

			this.hasPrevious = function(){
				this.checkMod();
				return this.position > 0;
			};

			this.next = function(){
				this.checkMod();
				if(this.position == this.size)
					throw new NoSuchElementException();
				this.lastReturned = this.position;
				return outer.get(this.position++);
			};

			this.previous = function(){
				this.checkMod();
				if(this.position == 0)
					throw new NoSuchElementException();
				this.lastReturned = --this.position;
				return outer.get(this.lastReturned);
			};

			this.nextIndex = function(){
				this.checkMod();
				return this.position;
			};

			this.previousIndex = function(){
				this.checkMod();
				return this.position - 1;
			};

			this.remove = function(){
				this.checkMod();
				if(this.lastReturned < 0)
					throw new IllegalStateException();
				outer.remove(this.last);
				this.position = this.lastReturned;
				this.size--;
				this.lastReturned = -1;
				this.knowMod = outer.modCount;
			};

			this.set = function(obj){
				this.checkMod();
				if(this.lastReturned < 0)
					throw new IllegalStateException();
				outer.set(this.lastReturned, obj)
			};

			this.add = function(obj){
				this.checkMod();
				outer.add(this.position++, obj);
				this.size++;
				this.lastReturned = -1;
				this.knowMod = outer.modCount;
			};
		};
	}
);

/**
 * Remove an element from the list
 */
AbstractList.prototype.remove = function(index){
	throw new UnsupportedOperationException();
};

/**
 * Remove a range of elements from the list
 */
AbstractList.prototype.removeRange = function(fromIndex, toIndex){
	var itr = this.listIterator(fromIndex);
	for(var index = fromIndex; index < toIndex; index++){
		itr.next();
		itr.remove();
	}
};

/**
 * Replace an object at a location
 */
AbstractList.prototype.set = function(index, obj){
	throw new UnsupportedOperationException();
};

/**
 * Get a sublist.It stores, in
 * private fields, the offset and size of the sublist, and the expected
 * modCount of the backing list. If the backing list implements RandomAccess,
 * the sublist will also.
 */
AbstractList.prototype.subList = function(fromIndex, toIndex){
	if(fromIndex > toIndex)
		throw new IllegalArgumentException(fromIndex + " > " + toIndex);
	if(fromIndex < 0 || toIndex > this.size())
		throw new IndexOutOfBoundsException();
	return new AbstractList.SubList(this, fromIndex, toIndex);
};

/**
 * Sublist Class
 */
AbstractList.SubList = Class.extend(AbstractList);

/**
 * Constructor
 */
AbstractList.SubList.Constructor(
    function(backing, fromIndex, toIndex){
        this.backingList = backing;
        this.offset = fromIndex;
        this.modCount = backing.modCount;
        this.currentSize = toIndex - fromIndex;
    }
);

/**
 * This method checks the two modCount fields to ensure that there has
 * not been a concurrent modification, returning if all is okay.
 */
AbstractList.SubList.prototype.checkMod = function(){
    if (this.modCount != this.backingList.modCount)
        throw new ConcurrentModificationException();
};

 /**
  * This method checks that a value is between 0 and size (inclusive). If
  * it is not, an exception is thrown.
  *
  */
AbstractList.SubList.checkBoundsInclusive = function(index){
    if (index < 0 || index >  this.currentSize)
        throw new IndexOutOfBoundsException("Index: " + index + ", Size:" + this.currentSize);
};

 /**
  * This method checks that a value is between 0 and size (exclusive). If
  * it is not, an exception is thrown.
  *
  */
AbstractList.SubList.checkBoundsExclusive = function(index){
    if (index < 0 || index >= this.currentSize)
        throw new IndexOutOfBoundsException("Index: " + index + ", Size:" + this.currentSize);
};

/**
 * Return the size of the sublist.
 */
AbstractList.SubList.prototype.size = function(){
    this.checkMod();
    return this.currentSize;
};

/**
 * Replace an object at a location in the sublist
 */
AbstractList.SubList.prototype.set = function(index, obj){
    this.checkMod();
    AbstractList.SubList.checkBoundsExclusive.call(this, index);
    return this.backingList.set(index + this.offset, obj);
};

/**
 * Obtain an element at an index.
 */
AbstractList.SubList.prototype.get = function(index){
    this.checkMod();
    AbstractList.SubList.checkBoundsExclusive.call(this, index);
    return this.backingList.get(index + this.offset);
};

/**
 * Add an element to the sublist
 */
AbstractList.SubList.prototype.add = function(index, obj){
    this.checkMod();
    AbstractList.SubList.checkBoundsInclusive.call(this, index);
    this.backingList.add(index + this.offset, obj);
    this.currentSize++;
    this.modCount = this.backingList.modCount;
};

/**
 * Remove an element from the sublist
 */
AbstractList.SubList.prototype.remove = function(index){
    this.checkMod();
    AbstractList.SubList.checkBoundsExclusive.call(this, index);
    var obj = this.backingList.remove(index + this.offset);
    this.currentSize--;
    this.modCount = this.backingList.modCount;
    return obj;
};

/**
 * Remove a set of elements form the sublist
 */
AbstractList.SubList.prototype.removeRange = function(fromIndex, toIndex){
    this.checkMod();
    var obj = this.backingList.removeRange(fromIndex + this.offset, toIndex + this.offset);
    this.currentSize = toIndex - fromIndex;
    this.modCount = this.backingList.modCount;
};

AbstractList.SubList.prototype.addAll = Class.initOverload();
/**
 * Add all objects of a collection after a position.
 */
AbstractList.SubList.prototype.addAll.overload(
	function(index, collection){
		this.checkMod();
		AbstractList.SubList.checkBoundsInclusive.call(this, index);
		var csize = collection.size();
		var result = this.backingList.addAll(this.offset + index, collection);
		this.currentSize += csize;
		this.modCount = this.backingList.modCount;
		return result;
	}
);

/**
 * Add all objects of a collection
 */
AbstractList.SubList.prototype.addAll.overload(
	function(collection){
		this.addAll(this.currentSize, collection);
	}
);

/**
 * Obtain an iterator of the sublist
 */
AbstractList.SubList.prototype.iterator = function(){
	return this.listIterator(0);
};

AbstractList.SubList.prototype.listIterator = Class.initOverload();

/**
 * Obtain an iterator of the sublist after a position
 */
AbstractList.SubList.prototype.listIterator = function(index){
	this.checkMod();
	AbstractList.SubList.checkBoundsInclusive.call(this, index);
	var outer = this;
	return new function(){
		this.i = outer.backingList.listIterator(index + outer.offset);
		this.position = index;


		this.hasNext = function(){
			outer.checkMod();
			return this.position < outer.size();
		};

		this.hasPrevious = function(){
			outer.checkMod();
			return this.position > 0;
		};

		this.next = function(){
			if(this.position == outer.size())
				throw new NoSuchElementException();
			this.position++;
			return this.i.next();
		};

		this.previous = function(){
			if(this.position == 0)
				throw new NoSuchElementException();
			this.position--;
			return this.i.previous();
		};

		this.nextIndex = function(){
			return this.i.nextIndex() - outer.offset;
		};

		this.previousIndex = function(){
			return this.i.previousIndex() - outer.offset;
		};

		this.remove = function(){
			this.i.remove();
			outer.currentSize--;
			this.position = this.nextIndex();
			outer.modCount = outer.backingList.modCount;
		};

		this.set = function(obj){
			this.i.set(obj);
		};

		this.add = function(obj){
			this.i.add(obj);
			this.position++;
			outer.modCount = outer.backingList.modCount;
		};
	};
};

/**
 * Class Random Access Sublist
 */
AbstractList.RandomAccessSubList = Class.extend(AbstractList.SubList);

AbstractList.RandomAccessSubList.Constructor(
	function(backingList, fromIndex, toIndex){
		this.superClass(backingList, fromIndex, toIndex);
	}
);

/////////////////////////////////////////////////////////////////////
//////				Class AbstractMap                        ////////
/////////////////////////////////////////////////////////////////////


/**
 * An abstract implementation of Map to make it easier to create your own
 * implementations. In order to create an unmodifiable Map, subclass
 * AbstractMap and implement the <code>entrySet</code> (usually via an
 * AbstractSet).  To make it modifiable, also implement <code>put</code>,
 * and have <code>entrySet().iterator()</code> support <code>remove</code>.
 * <p>
 */
AbstractMap = Class.extend(AbstractCollection).implement(Map);

AbstractMap.KEYS = 0;
AbstractMap.VALUES = 1;
AbstractMap.ENTRIES = 2;

/**
 * The main constructor, for use by subclasses.
 */
AbstractMap.Constructor(
	function(){
		this.keys = null;
		this.values = null;
	}
);


/**
 * Empty the map.
 */
AbstractMap.prototype.clear = function(){
	this.entrySet().clear();
};

/**
 * Check if map has the key.
 */
AbstractMap.prototype.containsKey = function(key){
	var itr = this.entrySet().iterator();
	var pos = this.size();
	while(--pos >= 0)
		if(AbstractCollection.equals(key, itr.next().getKey()))
			return true;
	return false;
};

/**
 * Check if map has the value
 */
AbstractMap.prototype.containsValue = function(value){
	var itr = this.entrySet().iterator();
	var pos = this.size();
	while(--pos >= 0)
		if(AbstractCollection.equals(value, itr.next().getValue()))
			return true;
	return false;
};

/**
 * Equals method overridden
 */
AbstractMap.prototype.equals = function(o){
	return (o == this &&
			this.entrySet().equals(o.entrySet()));
};

/**
 * Get the value of the key
 */
AbstractMap.prototype.get = function(key){
	var entries = this.entrySet().iterator();
	var pos = this.size();
	while(--pos >= 0){
		var entry = entries.next();
		if(AbstractCollection.equals(key, entry.getKey()))
			return entry.getValue();

	}
	return null;
};

/**
 * Check if map is empty.
 */
AbstractMap.prototype.isEmpty = function(){
	return this.size() == 0;
};

/**
 * Get the Set of keys of the map
 */
AbstractMap.prototype.keySet = function(){
	var outer = this;
	if(this.keys == null){
		var NewAbs = Class.extend(AbstractSet);
		NewAbs.prototype.size = function(){
			return outer.size();
		};

		NewAbs.prototype.contains = function(key){
			return outer.containsKey(key);
		};

		NewAbs.prototype.iterator  = function(){
			var absSet = this;
			return new function(){
				var mapIterator = outer.entrySet.iterator();

				this.hasNext = function(){
					return mapIterator.hasNext();
				};

				this.next = function(){
					return mapIterator.next().getKey();
				};

				this.remove = function(){
					mapIterator.remove();
				};
			};
		}
		this.keys = new NewAbs();
	}
	return this.keys;
};

/**
 * Push elemnts into the map
 */
AbstractMap.prototype.put = function(o){
	throw new UnsupportedOperationException();
};

/**
 * push a collection of key,value pairs into the map
 */
AbstractMap.prototype.putAll = function(map){
	var entries = map.entrySet().iterator();
	var pos = map.size();
	while(--pos >= 0){
		var entry = entries.next();
		this.put(entry.getKey(), entry.getValue());
	}
};

/**
 * Remove an element
 */
AbstractMap.prototype.remove = function(key){
	var entries = this.entrySet().iterator();
	var pos = this.size();
	while(--pos >= 0){
		var entry = entries.next();
		if(AbstractCollection.equals(key, entry.getKey())){
			// Must get the value before we remove it from iterator.
			var r = entry.getValue();
			entries.remove();
			return r;
		}
	}
	return null;
};

/**
 * Size of the map
 */
AbstractMap.prototype.size = function(o){
	return this.entrySet().size();
};

/**
 * ToString overriden
 */
AbstractMap.prototype.toString = function(){
	var entries = this.entrySet().iterator();
	var r = new String("{");
	for(var pos = this.size(); pos > 0; pos--){
		var entry = entries.next();
		r += entry.getKey() + "=" + entry.getValue();
		if(pos > 1)
			r += ",";
	}
	r += "}";
	return r;
};

/**
 * Get a collection of values
 */
AbstractMap.prototype.values = function(){
	var outer = this;
	if(this.vals == null){
		var NewAbs = Class.extend(AbstractCollection);

		NewAbs.prototype.size = function(){
			return outer.size();
		};

		NewAbs.prototype.contains = function(value){
			return outer.containsValue(value);
		};

		NewAbs.prototype.iterator  = function(){
			var absSet = this;
			return new function(){
				var mapIterator = outer.entrySet.iterator();

				this.hasNext = function(){
					return mapIterator.hasNext();
				};

				this.next = function(){
					return mapIterator.next().getValue();
				};

				this.remove = function(){
					mapIterator.remove();
				};
			};
		}
		this.vals = new NewAbs();
	}
	return this.values;
};



/**
 * Class BasicMapEntry
 */

AbstractMap.BasicMapEntry = Class.define().implement(Map.Entry);

AbstractMap.BasicMapEntry.Constructor(
	function(key, value){
		this.key = key;
		this.value = value;
	}
);

AbstractMap.BasicMapEntry.prototype.equals = function(obj){
	return (AbstractCollection.equals(key, e.getKey())
               && AbstractCollection.equals(value, e.getValue()));
};

AbstractMap.BasicMapEntry.prototype.getKey = function(){
	return this.key;
};

AbstractMap.BasicMapEntry.prototype.getValue = function(){
	return this.value;
};

AbstractMap.BasicMapEntry.prototype.setValue = function(newValue){
	var r = this.value;
	this.value = newValue;
	return r;
};

AbstractMap.BasicMapEntry.prototype.toString = function(){
	return this.key + "=" + this.value;
};

/////////////////////////////////////////////////////////////////////
//////				Class AbstractSet                       ////////
/////////////////////////////////////////////////////////////////////
/**
 * An abstract implementation of Set to make it easier to create your own
 * implementations. In order to create a Set, subclass AbstractSet and
 * implement the same methods that are required for AbstractCollection
 * (although these methods must of course meet the requirements that Set puts
 * on them - specifically, no element may be in the set more than once). This
 * class simply provides implementations of equals() and hashCode() to fulfil
 * the requirements placed on them by the Set interface.
 */
AbstractSet = Class.extend(AbstractCollection).implement(Set);

AbstractSet.Constructor(
	function(){

	}
);

AbstractSet.prototype.equals = function(o){
	return (o == this ||
			o.size() == this.size()
			&& this.containsAll(o));
};

/**
 * Remove elemnts belonging toa  collection from the set
 */
AbstractSet.prototype.removeAll = function(collection){
	var oldSize = this.size();
	var count = collection.size();
	var i;
	if(oldSize < count){
		for(i = this.iterator(), count = oldSize; count > 0; count--)
			if(collection.contains(i.next()))
				i.remove();
	}else
		for(i = collection.iterator(); count > 0; count--)
			this.remove(i.next());
	return oldSize != this.size();
};