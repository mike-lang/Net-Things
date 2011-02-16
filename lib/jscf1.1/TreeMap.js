/**
 * This class provides a red-black tree implementation of the SortedMap
 * interface.  Elements in the Map will be sorted by either a user-provided
 * Comparator object, or by the natural ordering of the keys.
*/
TreeMap = Class.extend(AbstractMap).implement(SortedMap);

TreeMap.RED = -1;
TreeMap.BLACK = 1;

TreeMap.prototype.root = null;
TreeMap.prototype.currentSize = 0;
TreeMap.prototype.entries = null;
TreeMap.prototype.modCount = 0;
TreeMap.prototype.comparatr = null;

TreeMap.Node = Class.extend(AbstractMap.BasicMapEntry);
// Note the spelling of parent is parant as parent is reserved in JS DOM
TreeMap.Node.prototype.left = null;
TreeMap.Node.prototype.right = null;
TreeMap.Node.prototype.parant = null;

TreeMap.Node.Constructor(
	function(key, value, color){
		TreeMap.Node.superClass.call(this, key, value);
		this.color = color;
	}
);

TreeMap.nil  = new TreeMap.Node(null, null, TreeMap.BLACK);
TreeMap.nil.parant = TreeMap.nil;
TreeMap.nil.left = TreeMap.nil;
TreeMap.nil.right = TreeMap.nil;

TreeMap.Node.prototype.left = TreeMap.nil;
TreeMap.Node.prototype.right = TreeMap.nil;
TreeMap.Node.prototype.parant = TreeMap.nil;


TreeMap.Constructor(
	function(){
		TreeMap.call(this, null);
	}
);

TreeMap.Constructor(
	function(arg){
		if(arg && arg.put){ // Its a Map
			TreeMap.call(this, null);
			this.putAll(arg);
		}else if(arg == null || arg.compare){ // Its a Comparator
			this.comparatr = arg;
			this.fabricateTree(0);
		}else if(arg.comparator){
			TreeMap.call(this, arg.comparator());
			var pos = arg.size();
			var itr = arg.entrySet().iterator();

			this.fabricateTree(pos);
			var node = this.firstNode();

			while(--pos >= 0){
				var me = itr.next();
				node.key = me.getKey();
				node.value = me.getValue();
				node = this.successor(node);
			}
		}
	}
);

TreeMap.prototype.clear = function(){
	if(this.currentSize > 0){
		this.modCount++;
		this.root = TreeMap.nil;
		this.currentSize = 0;
	}
};

TreeMap.prototype.comparator = function(){
	return this.comparatr;
};

TreeMap.prototype.containsKey = function(key){
	return this.getNode(key) != TreeMap.nil;
};

TreeMap.prototype.containsValue = function(value){
	var node = this.firstNode();
	while(node != TreeMap.nil){
		if(AbstractCollection.equals(value, node.value))
			return true;
		node = this.successor(node);
	}
	return false;
};

TreeMap.prototype.entrySet = function(){
	var outer = this;
	if(this.entries == null){
		var Entries = Class.extend(AbstractSet);

		Entries.prototype.size = function(){
			return outer.size();
		};

		Entries.prototype.iterator = function(){
			return new outer.TreeIterator(outer,AbstractMap.ENTRIES);
		};

		Entries.prototype.clear = function(){
			outer.clear();
		};

		Entries.prototype.contains = function(obj){
			if( !obj.getKey)
				return false;

			var me = obj;
			var n = outer.getNode(me.getKey());
			return n != TreeMap.nil && AbstractCollection.equals(me.getValue(), n.value);
		};

		Entries.prototype.remove = function(obj){
			if( !obj.getKey)
				return false;

			var me = obj;
			var n = outer.getNode(me.getKey());
			if(n != TreeMap.nil && AbstractCollection.equals(me.getValue(), n.value)){
				outer.removeNode(n);
				return true;
			}
			return false;
		};

		this.entries = new Entries();
	}
	return this.entries;
};

TreeMap.prototype.firstKey = function(){
	if(this.root == TreeMap.nil)
		throw new NoSuchElementException();
		return this.firstNode().key;
};

TreeMap.prototype.get = function(key){
	return this.getNode(key).value;
};

TreeMap.prototype.headMap = function(toKey){
	return new this.SubMap(this,TreeMap.nil, toKey);
};

TreeMap.prototype.keySet = function(){
	var outer = this;
	if(this.keys == null){
		var NewAbs = Class.extend(AbstractSet);

		NewAbs.prototype.size = function(){
			return outer.size();
		};

		NewAbs.prototype.clear = function(){
			return outer.clear();
		};

		NewAbs.prototype.contains = function(key){
			return outer.containsKey(key);
		};

		NewAbs.prototype.iterator  = function(){
			return new outer.TreeIterator(outer,AbstractMap.KEYS);
		};

		NewAbs.prototype.remove = function(obj){
			var n = outer.getNode(obj);
			if(n == TreeMap.nil)
				return false;
			outer.removeNode(n);
			return true;
		};
		this.keys = new NewAbs();
	}
	return this.keys;
};

TreeMap.prototype.lastKey = function(){
	if(this.root == TreeMap.nil)
		throw new NoSuchElementException("empty");
		return this.lastNode().key;
};

TreeMap.prototype.put = function(key, value){
	var current = this.root;
	var parnt = TreeMap.nil;
	var comparison = 0;

	while(current != TreeMap.nil){
		parnt = current;
		comparison = this.compare(key, current.key);
		if(comparison > 0)
			current = current.right;
		else if(comparison < 0)
			current = current.left;
		else
			return current.setValue(value);
	}

	var n = new TreeMap.Node(key, value, TreeMap.RED);
	n.parant = parnt;
	this.modCount++;
	this.currentSize++;
	if(parnt == TreeMap.nil){
		this.root = n;
		return null;
	}
	if(comparison > 0)
		parnt.right = n;
	else
		parnt.left = n;

	this.insertFixup(n);
	return null;
};

TreeMap.prototype.putAll = function(map){
	var itr = map.entrySet().iterator();
	var pos = map.size();
	while(--pos >= 0){
		var e = itr.next();
		this.put(e.getKey(), e.getValue());
	}
};

TreeMap.prototype.remove = function(key){
	var n = this.getNode(key);
	if(n == TreeMap.nil)
		return null;
	var result = n.value;
	this.removeNode(n);
	return result;
};

TreeMap.prototype.size = function(){
	return this.currentSize;
};

TreeMap.prototype.subMap = function(fromKey, toKey){
	return new this.SubMap(this, fromKey, toKey);
};

TreeMap.prototype.tailMap = function(fromKey){
	return new this.SubMap(this, fromKey, TreeMap.nil);
};

TreeMap.prototype.values = function(){
	var outer = this;
	if(this.vals == null){
		var NewAbs = Class.extend(AbstractCollection);
		NewAbs.prototype.size = function(){
			return outer.currentSize;
		};

		NewAbs.prototype.iterator = function(){
			return new outer.TreeIterator(outer, AbstractMap.VALUES);
		};

		NewAbs.prototype.clear = function(){
			outer.clear();
		};

		this.vals = new NewAbs();
	}
	return this.vals;
};

TreeMap.prototype.compare = function(obj1, obj2){
	return this.comparatr == null ?	obj1.compareTo(obj2):this.comparatr.compare(obj1, obj2);
};

TreeMap.prototype.deleteFixup = function(node, paren){
	while(node != this.root && node.color == TreeMap.BLACK){
		if(node == paren.left){
			var sibling = paren.right;
			if(sibling.color == TreeMap.RED){
				sibling.color = TreeMap.BLACK;
				paren.color = TreeMap.RED;
				this.rotateLeft(paren);
				sibling = paren.right;
			}

			if(sibling.left.color == TreeMap.BLACK && sibling.right.color == TreeMap.BLACK){
				sibling.color = TreeMap.RED;
				node = paren;
				paren = paren.parant;
			}else{
				if(sibling.right.color == TreeMap.BLACK){
					sibling.left.color = TreeMap.BLACK;
					sibling.color = TreeMap.RED;
					this.rotateRight(sibling);
					sibling = paren.right;
				}
				sibling.color = paren.color;
				paren.color = TreeMap.BLACK;
				sibling.right.color = TreeMap.BLACK;
				this.rotateLeft(paren);
				node = this.root;
			}
		}else{
		 	// Symmetric "mirror" of left-side case.
		 	var sibling = paren.left;
		 	// if (sibling == nil)
		 	//   throw new InternalError();
		 	if (sibling.color == TreeMap.RED){
				// Case 1: Sibling is red.
		 		// Recolor sibling and parent, and rotate parent right.
			 	sibling.color = TreeMap.BLACK;
				paren.color = TreeMap.RED;
			 	this.rotateRight(paren);
			 	sibling = paren.left;
		   	}

			if (sibling.right.color == TreeMap.BLACK && sibling.left.color == TreeMap.BLACK){
				// Case 2: Sibling has no red children.
				// Recolor sibling, and move to parent.
				sibling.color = TreeMap.RED;
				node = paren;
				paren = paren.paren;
			}else{
				if (sibling.left.color == TreeMap.BLACK){
					// Case 3: Sibling has red right child.
					// Recolor sibling and right child, rotate sibling left.
					sibling.right.color = TreeMap.BLACK;
				 	sibling.color = TreeMap.RED;
				 	this.rotateLeft(sibling);
				 	sibling = paren.left;
			   	}
				// Case 4: Sibling has red left child. Recolor sibling,
				// left child, and parent, and rotate parent right.
				sibling.color = paren.color;
				paren.color = TreeMap.BLACK;
				sibling.left.color = TreeMap.BLACK;
				this.rotateRight(paren);
				node = this.root; // Finished.
			  }
		   }
		}
		node.color = TreeMap.BLACK;
};

TreeMap.prototype.fabricateTree = function(count){
	if(count == 0){
		this.root = TreeMap.nil;
		this.currentSize = 0;
		return;
	}

	this.root = new TreeMap.Node(null, null, TreeMap.BLACK);
	this.currentSize  = count;
	var row = this.root;
	var rowsize;

	for (rowsize = 2; rowsize + rowsize <= count; rowsize <<= 1){
		var paren = row;
		var last = null;
		for (var i = 0; i < rowsize; i += 2){
			var left = new TreeMap.Node(null, null, TreeMap.BLACK);
			var right = new TreeMap.Node(null, null, TreeMap.BLACK);
			left.parant = paren;
			left.right = right;
			right.parant = paren;
			paren.left = left;
			var next = paren.right;
			paren.right = right;
			paren = next;
			if (last != null)
				last.right = left;
			last = right;
		}
		row = row.left;
	}
	// Now do the partial final row in red
	var overflow = count - rowsize;
	var paren = row;
	var i;
	for(i = 0; i < overflow; i+=2){
		var left = new TreeMap.Node(null,null, TreeMap.RED);
		var right = new TreeMap.Node(null,null, TreeMap.RED);
		left.parant = paren;
		right.parant = paren;
		var next = paren.right;
		paren.right = right;
		paren = next;
	}
	// Add a lone left node if necessary.
	if(i - overflow == 0){
		var left = new TreeMap.Node(null,null, TreeMap.RED);
		left.parant = paren;
		paren.left = left;
		paren = paren.right;
		left.parant.right = TreeMap.nil;
	}
	// Unlink the remaining nodes of the previous row.
	while(paren != TreeMap.nil){
		var next = paren.right;
		paren.right = TreeMap.nil;
		paren = next;
	}
};

TreeMap.prototype.firstNode = function(){
	var node = this.root;
	while(node.left != TreeMap.nil)
		node = node.left;
	return node;
};

TreeMap.prototype.getNode = function(key){
	var current = this.root;
	while(current != TreeMap.nil){
		var comparison = this.compare(key, current.key);
		if(comparison > 0)
			current = current.right;
		else if(comparison < 0)
			current = current.left;
		else
			return current;
	}
	return current;
};

TreeMap.prototype.highestLessThan = function(key){
	if(key == TreeMap.nil)
		return this.lastNode();
	var last = TreeMap.nil;
	var current = this.root;
	var comparison = 0;
	while(current != TreeMap.nil){
		comparison = this.compare(key, current.key);
		if(comparison > 0)
			current = current.right;
		else if(comparison < 0)
			current = current.left;
		else
			return this.predecessor(last);
	}
	return comparison <= 0 ? this.predecessor(last) : last;
};

TreeMap.prototype.insertFixup = function(n){
	// Only need to rebalance when parent is a RED node, and while at least
	// 2 levels deep into the tree (ie: node has a grandparent). Remember
	// that nil.color == BLACK.
	while(n.parant.color == TreeMap.RED && n.parant.parant != TreeMap.nil){
		if(n.parant == n.parant.parant.left){
			var uncle = n.parant.parant.right;
			// Uncle may be nil, in which case it is BLACK.
			if(uncle.color == TreeMap.RED){
				n.parant.color = TreeMap.BLACK;
				uncle.color = TreeMap.BLACK;
				uncle.parant.color = TreeMap.RED;
				uncle = uncle.parant;
			}else{
				if(n == n.parant.right){
					// Case 2. Uncle is BLACK and x is right child.
					// Move n to parent, and rotate n left.
					n = n.parant;
					this.rotateLeft(n);
					n.parant.color = TreeMap.BLACK;
					n.parant.parant.color = TreeMap.RED;
					this.rotateRight(n.parant.parant);
				}
				// Case 3. Uncle is BLACK and x is left child.
				// Recolor parent, grandparent, and rotate grandparent right.
				n.parant.color = BLACK;
                n.parant.parant.color = RED;
                this.rotateRight(n.parant.parant);
			}
		}else{
		 	// Mirror image of above code.
		 	var uncle = n.parant.parant.left;
		 	// Uncle may be nil, in which case it is BLACK.
		 	if (uncle.color == TreeMap.RED){
				// Case 1: Uncle  is red. Change colors of parent, uncle,
		 		// and grandparent, and move n to grandparent.
		 		n.parant.color = TreeMap.BLACK;
			 	uncle.color = TreeMap.BLACK;
				uncle.parant.color = TreeMap.RED;
			 	n = uncle.parant;
		   	}else{
		   		if(n == n.parant.left){
		   			// Case 2. Uncle is BLACK and x is left child.
		   			// Move n to parent, and rotate n right.
                    n = n.parant;
                    this.rotateRight(n);
		   		}
		   		// Case 3. Uncle is BLACK and x is right child.
                // Recolor parent, grandparent, and rotate grandparent left.
                n.parant.color = TreeMap.BLACK;
                n.parant.parant.color = TreeMap.RED;
                this.rotateLeft(n.parant.parant);
		   	}
		}
	}
	this.root.color = TreeMap.BLACK;
};

TreeMap.prototype.lastNode = function(){
	// Exploit fact that nil.right == nil.
	var node = this.root;
	while (node.right != TreeMap.nil)
		node = node.right;
	return node;
};

  /**
 * Find the "lowest" node which is &gt;= key. If key is nil, return either
  * nil or the first node, depending on the parameter first.
  * Package visible for use by nested classes.
  *
  * @param key the lower bound, inclusive
  * @param first true to return the first element instead of nil for nil key
  * @return the next node
  */
TreeMap.prototype.lowestGreaterThan = function(key, first){
	if (key == TreeMap.nil)
    	return first ? this.firstNode() : TreeMap.nil;

   	var last = TreeMap.nil;
   	var current = this.root;
   	var comparison = 0;

	while (current != TreeMap.nil){
		last = current;
       	comparison = this.compare(key, current.key);
       	if (comparison > 0)
        	current = current.right;
       	else if (comparison < 0)
         	current = current.left;
       	else
         	return current;
    }
   	return comparison > 0 ? this.successor(last) : last;
};


TreeMap.prototype.predecessor = function(node){
	if (node.left != TreeMap.nil){
		node = node.left;
		while(node.right != TreeMap.nil)
			node = node.right;
		return node;
	}
	var paren = node.parant;
	// Exploit fact that nil.left == nil and node is non-nil.
	while(node == paren.left){
		node = paren;
		paren = node.parant;
	}
   	return paren;
};


TreeMap.prototype.putKeysLinear = function(keys, count){
	this.fabricateTree(count);
	var node = this.firstNode();

	while(--count >= 0){
		node.key = keys.next();
		node.value = "";
		node = this.successor(node);
	}
};

/**
  * Remove node from tree. This will increment modCount and decrement size.
  * Node must exist in the tree. Package visible for use by nested classes.
  *
  * @param node the node to remove
  */
TreeMap.prototype.removeNode = function(node){
	var splice;
	var child;

	this.modCount++;
	this.currentSize--;

   	// Find splice, the node at the position to actually remove from the tree.
   	if (node.left == TreeMap.nil){
    	// Node to be deleted has 0 or 1 children.
       	splice = node;
       	child = node.right;
    }else if (node.right == TreeMap.nil){
       	// Node to be deleted has 1 child.
       	splice = node;
       	child = node.left;
    }else{
       	// Node has 2 children. Splice is node's predecessor, and we swap
       	// its contents into node.
       	splice = node.left;
       	while (splice.right != TreeMap.nil)
        	splice = splice.right;
       	child = splice.left;
       	node.key = splice.key;
       	node.value = splice.value;
    }

   	// Unlink splice from the tree.
   	var paren = splice.parant;
   	if (child != TreeMap.nil)
     	child.parant = paren;
   	if (paren == TreeMap.nil) {
       	// Special case for 0 or 1 node remaining.
       	this.root = child;
       	return;
    }
   	if (splice == paren.left)
     	paren.left = child;
   	else
     	paren.right = child;

   	if (splice.color == TreeMap.BLACK)
     	this.deleteFixup(child, paren);
};

/**
  * Rotate node n to the left.
  *
  * @param node the node to rotate
  */
TreeMap.prototype.rotateLeft = function(node){
   	var child = node.right;
   	// if (node == nil || child == nil)
   	//   throw new InternalError();

   	// Establish node.right link.
   	node.right = child.left;
   	if (child.left != TreeMap.nil)
    	child.left.parant = node;

   	// Establish child->parent link.
   	child.parant = node.parant;
   	if (node.parant != TreeMap.nil){
       	if (node == node.parant.left)
         	node.parant.left = child;
       	else
         	node.parant.right = child;
    }else
     	this.root = child;

   	// Link n and child.
   	child.left = node;
   	node.parant = child;
};

 /**
  * Rotate node n to the right.
  *
  * @param node the node to rotate
  */
TreeMap.prototype.rotateRight = function(node){
   	var child = node.left;
   	// if (node == nil || child == nil)
   	//   throw new InternalError();

   	// Establish node.left link.
   	node.left = child.right;
   	if (child.right != TreeMap.nil)
     	child.right.parant = node;

   	// Establish child->parent link.
   	child.parant = node.parant;
   	if (node.parant != TreeMap.nil){
       	if (node == node.parant.right)
         	node.parant.right = child;
       	else
         	node.parant.left = child;
    }else{
     	this.root = child;
    }

   	// Link n and child.
   	child.right = node;
   	node.parant = child;
};

 /**
  * Return the node following the given one, or nil if there isn't one.
  * Package visible for use by nested classes.
  *
  * @param node the current node, not nil
  * @return the next node in sorted order
  */
TreeMap.prototype.successor = function(node){
   	if (node.right != TreeMap.nil){
       	node = node.right;
       	while (node.left != TreeMap.nil)
        	node = node.left;
       	return node;
    }

   	var paren = node.parant;
   	// Exploit fact that nil.right == nil and node is non-nil.
   	while (node == paren.right){
       	node = paren;
       	paren = paren.parant;
    }
   	return paren;
};

/**
 * Iterate over TreeMap's entries. This implementation is parameterized
 * to give a sequential view of keys, values, or entries.
 *
 * @author Khanm
*/

TreeMap.prototype.TreeIterator = Class.define().implement(Iterator);

TreeMap.prototype.TreeIterator.prototype.type = null;
TreeMap.prototype.TreeIterator.prototype.knownMod = TreeMap.prototype.modCount;
TreeMap.prototype.TreeIterator.prototype.last = null;
TreeMap.prototype.TreeIterator.prototype.nxt = null;
TreeMap.prototype.TreeIterator.prototype.clas = null;
TreeMap.prototype.TreeIterator.prototype.max = null;

TreeMap.prototype.TreeIterator.Constructor(
	function(clas, type){
		this.clas = clas;
		this.type = type;
		this.nxt = this.clas.firstNode();
		this.max = TreeMap.nil;
		this.knownMod = this.clas.modCount;
	}
);

TreeMap.prototype.TreeIterator.Constructor(
	function(clas, type, first, max){
		this.clas = clas;
		this.type = type;
		this.nxt = first;
		this.max = max;
		this.knownMod = this.clas.modCount;
	}
);

TreeMap.prototype.TreeIterator.prototype.hasNext = function(){
	if(this.knownMod != this.clas.modCount)
		throw new ConcurrentModificationException();
	return this.nxt != this.max;
};

TreeMap.prototype.TreeIterator.prototype.next = function(){
	if(this.knownMod != this.clas.modCount)
		throw new ConcurrentModificationException();
	if(this.nxt == this.max)
		throw new NoSuchElementException();
	this.last = this.nxt;
	this.nxt = this.clas.successor(this.last);

	if(this.type == AbstractMap.VALUES)
		return this.last.value;
	else if(this.type == AbstractMap.KEYS)
		return this.last.key;
	return this.last;
};

TreeMap.prototype.TreeIterator.prototype.remove = function(){
	if(this.last == null)
		throw new IllegalStateException();
	if(this.knownMod != this.clas.modCount)
		throw new ConcurrentModificationException();

	this.clas.removeNode(this.last);
	this.last = null;
	this.knownMod++;
};

TreeMap.prototype.SubMap = Class.extend(AbstractMap).implement(SortedMap);

TreeMap.prototype.SubMap.prototype.minKey = null;
TreeMap.prototype.SubMap.prototype.maxKey = null;
TreeMap.prototype.SubMap.prototype.keys = null;
TreeMap.prototype.SubMap.prototype.entries = null;
TreeMap.prototype.SubMap.prototype.obj = null;

TreeMap.prototype.SubMap.Constructor(
	function(clas, minKey, maxKey){
		this.clas = clas;
		if (minKey != TreeMap.nil && maxKey != TreeMap.nil && this.clas.compare(minKey, maxKey) > 0)
			throw new IllegalArgumentException("fromKey > toKey");
		this.minKey = minKey;
		this.maxKey = maxKey;
	}
);

TreeMap.prototype.SubMap.prototype.keyInRange = function(key){
	return ((this.minKey == TreeMap.nil || this.clas.compare(key, this.minkey) >= 0)
		&& (this.maxKey == nil || this.clas.compare(key, this.maxKey) < 0));
};

TreeMap.prototype.SubMap.prototype.clear = function(){
	var next = this.clas.lowestGreaterThan(this.minKey, true);
	var max = this.clas.lowestGreaterThan(this.maxKey, false);
	while(next != max){
		var current = next;
		next = this.clas.successor(current);
		this.clas.removeNode(current);
	}
};

TreeMap.prototype.SubMap.prototype.comparator = function(){
	this.clas.comparatr;
};

TreeMap.prototype.SubMap.prototype.containsKey = function(){
	return this.keyInRange(key) && this.clas.containsKey(key);
};

TreeMap.prototype.SubMap.prototype.containsValue = function(value){
	var node = this.clas.lowestGreaterThan(this.minKey, true);
    var max = this.clas.lowestGreaterThan(this.maxKey, false);
    while (node != max){
        if (AbstractCollection.equals(value, node.getValue()))
          return true;
        node = this.clas.successor(node);
    }
     return false;
   }

TreeMap.prototype.SubMap.prototype.entrySet = function(){
	if (this.entries == null){
		// Create an AbstractSet with custom implementations of those methods
       	// that can be overriden easily and efficiently.
       	var AbsSet = Class.extend(AbstractSet);
       	var outer = this;
       	AbsSet.prototype.size = function(){
       		return outer.clas.currentSize;
       	};

       	AbsSet.prototype.iterator = function(){
       		var first = outer.clas.lowestGreaterThan(this.minKey, true);
           	var max = outer.clas.lowestGreaterThan(this.maxKey, false);
           	return new outer.clas.TreeIterator(outer.clas, AbstractMap.ENTRIES, first, max);
       	};

       	AbsSet.prototype.clear = function(){
       		return outer.clas.clear();
       	};

       	AbsSet.prototype.contains = function(obj){
       		if( !(obj instanceof Object) )
       			return false;

       		var me = obj;
       		var key = me.getKey();
       		if(! outer.clas.keyInRange(key))
       			return false;
       		var n = outer.clas.getNode(key);
       		return n != TreeMap.nil && AbstractCollection.equals(me.getValue(), n.value);
       	};

       	AbsSet.prototype.remove = function(obj){
       		if( !(obj instanceof Object) )
       			return false;

       		var me = obj;
       		var key = me.getKey();
       		if(! outer.clas.keyInRange(key))
       			return false;
       		var n = outer.clas.getNode(key);
       		if (n != TreeMap.nil && AbstractCollection.equals(me.getValue(), n.value)){
       			outer.clas.remove(n);
       			return true
       		}
       		return false;
       	};
		this.entries = new AbsSet();
	}
	return this.entries;
};

TreeMap.prototype.SubMap.prototype.firstKey = function(){
	var node = this.clas.lowestGreaterThan(this.minKey, true);
	if(node == TreeMap.nil || ! this.clas.keyInRange(node.key))
		throw new NoSuchElementException();
	return node.key;
};

TreeMap.prototype.SubMap.prototype.headMap = function(toKey){
	if (! this.clas.keyInRange(toKey))
    	throw new IllegalArgumentException("key outside range");
    return new this.clas.SubMap(this.minKey, toKey);
};

TreeMap.prototype.SubMap.prototype.keySet = function(){
	if (this.keys == null){
		// Create an AbstractSet with custom implementations of those methods
       	// that can be overriden easily and efficiently.
       	var AbsSet = Class.extend(AbstractSet);
       	var outer = this;
       	AbsSet.prototype.size = function(){
       		return outer.clas.size();
       	};

       	AbsSet.prototype.iterator = function(){
       		var first = outer.clas.lowestGreaterThan(outer.minKey, true);
           	var max = outer.clas.lowestGreaterThan(outer.maxKey, false);
           	return new outer.clas.TreeIterator(outer.clas, AbstractMap.KEYS, first, max);
       	};

       	AbsSet.prototype.clear = function(){
       		return outer.clas.clear();
       	};

       	AbsSet.prototype.contains = function(key){
       		if(! outer.clas.keyInRange(key))
       			return false;
       		return  outer.clas.getNode(key);
       	};

       	AbsSet.prototype.remove = function(key){
       		if(! outer.clas.keyInRange(key))
       			return false;
       		var n = outer.clas.getNode(key);
       		if (n != TreeMap.nil){
       			outer.clas.remove(n);
       			return true
       		}
       		return false;
       	};
		this.keys = new AbsSet();
	}
	return this.keys;
};

TreeMap.prototype.SubMap.prototype.lastKey = function(){
	var node = this.clas.highestLessThan(this.minKey, true);
	if(node == TreeMap.nil || ! this.clas.keyInRange(node.key))
		throw new NoSuchElementException();
	return node.key;
};

TreeMap.prototype.SubMap.prototype.put = function(key, value){
	if(! this.clas.keyInRange(key))
		throw new IllegalArgumentException("Key outside range");
	return this.clas.put(key, value);
};

TreeMap.prototype.SubMap.prototype.remove = function(key){
	if(this.clas.keyInRange(key))
		return this.clas.remove(key);
	return null;
};

TreeMap.prototype.SubMap.prototype.size = function(){
	var node = this.clas.lowestGreaterThan(this.minKey, true);
	var max = this.clas.lowestGreaterThan(this.maxKey, false);
	var count = 0;
	while(node != max){
		count++;
		node = this.clas.successor(node);
	}
	return count;
};

TreeMap.prototype.SubMap.prototype.subMap = function(fromKey, toKey){
	if (! this.clas.keyInRange(fromKey) || ! this.clas.keyInRange(toKey))
    	throw new IllegalArgumentException("key outside range");
    return new this.clas.SubMap(fromKey, toKey);
};

TreeMap.prototype.SubMap.prototype.values = function(){
	if (this.values == null){
		// Create an AbstractSet with custom implementations of those methods
       	// that can be overriden easily and efficiently.
       	var AbsSet = Class.extend(AbstractCollection);
       	var outer = this;
       	AbsSet.prototype.size = function(){
       		return outer.clas.size();
       	};

       	AbsSet.prototype.iterator = function(){
       		var first = outer.clas.lowestGreaterThan(this.minKey, true);
           	var max = outer.clas.lowestGreaterThan(this.maxKey, false);
           	return new outer.clas.TreeIterator(outer.clas, AbstractMap.VALUES, first, max);
       	};

       	AbsSet.prototype.clear = function(){
       		return outer.clas.clear();
       	};

       	AbsSet.prototype.contains = function(key){
       		if(! outer.clas.keyInRange(key))
       			return false;
       		return  outer.clas.getNode(key);
       	};
		this.values = new AbsSet();
	}
	return this.values;
};