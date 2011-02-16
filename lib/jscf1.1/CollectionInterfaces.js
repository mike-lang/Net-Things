/*
    This file contains all the core collection interfaces.

    The JavaScript Collections Framework hierarchy consists of two distinct interface trees:

    * The first tree starts with the Collection interface, which provides for the basic
        functionality used by all collections, such as add and remove methods.
        Its subinterfaces — Set, List, and Queue — provide for more specialized collections.

      The Set interface does not allow duplicate elements. This can be useful for storing collections such as a
        deck of cards or student records. The Set interface has a subinterface, SortedSet,
        that provides for ordering of elements in the set.

      The List interface provides for an ordered collection, for situations in which you need precise
        control over where each element is inserted. You can retrieve elements from a List by their exact position.

      The Queue interface enables additional insertion, extraction, and inspection operations.
        Elements in a Queue are typically ordered in on a FIFO basis.

    * The second tree starts with the Map interface, which maps keys and values similarly to a Hashtable.

      Map's subinterface, SortedMap, maintains its key-value pairs in ascending
      order or in an order specified by a Comparitor.

    These interfaces allow collections to be manipulated independently of the details of their representation.
*/

/*
 *  Implementing this interface allows an object to be the target of the "foreach" statement
**/

Iterable = Interface.define();

Iterable.declareMethod(new Method("iterator", ""));

/* An object that generates a series of elements, one at a time.
 * Successive calls to the nextElement method return successive elements of the series.
 */


Iterator = Interface.define();

Iterator.declareMethod(new Method("hasNext", ""));
Iterator.declareMethod(new Method("next", ""));
Iterator.declareMethod(new Method("remove", ""));



/*
 * The Collection interface is the least common denominator that all collections implement
 * and is used to pass collections around and to manipulate them when maximum generality is
 * desired. Some types of collections allow duplicate elements, and others do not.
 * Some are ordered and others are unordered
 **/

Collection = Interface.extend(Iterable);

// Basic Operations
Collection.declareMethod(new Method("size", ""));
Collection.declareMethod(new Method("isEmpty", ""));
Collection.declareMethod(new Method("contains", "element"));
Collection.declareMethod(new Method("add", "element"));
Collection.declareMethod(new Method("remove", "element"));

// Bulk Operations
Collection.declareMethod(new Method("containsAll", "collection"));
Collection.declareMethod(new Method("addAll", "collection"));
Collection.declareMethod(new Method("removeAll", "collection"));
Collection.declareMethod(new Method("retainAll", "collection"));
Collection.declareMethod(new Method("clear", ""));

// Array Operations
Collection.declareMethod(new Method("toArray", ""));



/*
    A Set  is a Collection  that cannot contain duplicate elements.
   It models the mathematical set abstraction. The Set interface contains
   only methods inherited from Collection and adds the restriction that
   duplicate elements are prohibited. Set also adds a stronger contract
   on the behavior of the equals and hashCode operations, allowing Set
   instances to be compared meaningfully even if their implementation types
   differ. Two Set instances are equal if they contain the same elements.
*/

Set = Interface.extend(Collection);


/*
    A List  is an ordered Collection (sometimes called a sequence).
    Lists may contain duplicate elements. In addition to the operations inherited from Collection,
    the List interface includes operations for the following:

    * Positional access — manipulates elements based on their numerical position in the list
    * Search — searches for a specified object in the list and returns its numerical position
    * Iteration — extends Iterator semantics to take advantage of the list's sequential nature
    * Range-view — performs arbitrary range operations on the list
*/

List = Interface.extend(Collection);

// Positional Access
List.declareMethod(new Method("get", "index"));
List.declareMethod(new Method("set", "index, element"));
List.declareMethod(new Method("add", "index, element"));
List.declareMethod(new Method("remove", "index"));

// Search
List.declareMethod(new Method("indexOf", "obj"));
List.declareMethod(new Method("lastIndexOf", "obj"));

// Iteration
List.declareMethod(new Method("listIterator", ""));
List.declareMethod(new Method("listIterator", "index"));

// Range-view
List.declareMethod(new Method("subList", "from, to"));

/*
    A Queue  is a collection for holding elements prior to processing.
    Besides basic Collection operations, queues provide additional insertion, removal,
    and inspection operations.
*/

Queue = Interface.extend(Collection);

Queue.declareMethod(new Method("element", ""));
Queue.declareMethod(new Method("offer", "obj"));
Queue.declareMethod(new Method("peek", ""));
Queue.declareMethod(new Method("poll", ""));
Queue.declareMethod(new Method("remove", ""));


/*
    A Map is an object that maps keys to values.
    A map cannot contain duplicate keys: Each key can map to at most one value. 
    The Map interface follows.
*/

Map = Interface.define();

// Basic Operations
Map.declareMethod(new Method("put", "key, value"));
Map.declareMethod(new Method("get", "key"));
Map.declareMethod(new Method("remove", "key"));
Map.declareMethod(new Method("containsKey", "key"));
Map.declareMethod(new Method("containsValue", "value"));
Map.declareMethod(new Method("size", ""));
Map.declareMethod(new Method("isEmpty", ""));

// Bulk Operations
Map.declareMethod(new Method("putAll", "map"));
Map.declareMethod(new Method("clear", ""));

// Collection Views
Map.declareMethod(new Method("keySet", ""));
Map.declareMethod(new Method("values", ""));
Map.declareMethod(new Method("entrySet", ""));

/*
    Interface for entrySet elements
*/

Map.Entry = Interface.define();

Map.Entry.declareMethod(new Method("getKey", ""));
Map.Entry.declareMethod(new Method("getValue", ""));
Map.Entry.declareMethod(new Method("setValue", "value"));

/*
    Comparable interfaces provide a natural ordering for a class,
    which allows objects of that class to be sorted automatically
*/

Comparable = Interface.define();

Comparable.declareMethod(new Method("compareTo", "obj"));


/*
    The compare method compares its two arguments, returning a negative integer,
    0, or a positive integer depending on whether the first argument is less than, equal to, or greater than the second
*/

Comparator = Interface.define();

Comparator.declareMethod(new Method("compare", "obj1, obj2"));


/*  A SortedSet is a Set that maintains its elements in ascending order,
    sorted according to the elements' natural order or according to a Comparator
    provided at SortedSet creation time. In addition to the normal Set operations,
    the SortedSet interface provides operations for the following:

    * Range view — allows arbitrary range operations on the sorted set
    * Endpoints — returns the first or last element in the sorted set
    * Comparator access — returns the Comparator, if any, used to sort the set
*/

SortedSet = Interface.extend(Set);

// Range-view
SortedSet.declareMethod(new Method("subSet", "fromElement, toElement"));
SortedSet.declareMethod(new Method("headSet", "toElement"));
SortedSet.declareMethod(new Method("tailSet", "fromElement"));

// Endpoints
SortedSet.declareMethod(new Method("first", "fromElement, toElement"));
SortedSet.declareMethod(new Method("last", "fromElement, toElement"));

// Comparator access
SortedSet.declareMethod(new Method("comparator", ""));

/*
    A SortedMap is a Map that maintains its entries in ascending order,
    sorted according to the keys' natural order, or according to a Comparator
    provided at the time of the SortedMap creation. Natural order and Comparators are
    discussed in the Object Ordering (in the Collections trail) section.
    The Map interface provides operations for normal Map operations and for the following:

    * Range view — performs arbitrary range operations on the sorted map
    * Endpoints — returns the first or the last key in the sorted map
    * Comparator access — returns the Comparator, if any, used to sort the map
*/

SortedMap = Interface.extend(Map);

// Range-view
SortedMap.declareMethod(new Method("subMap", "fromElement, toElement"));
SortedMap.declareMethod(new Method("headMap", "toElement"));
SortedMap.declareMethod(new Method("tailMap", "fromElement"));

// Endpoints
SortedMap.declareMethod(new Method("firstKey", "fromElement, toElement"));
SortedMap.declareMethod(new Method("lastKey", "fromElement, toElement"));

// Comparator access
SortedMap.declareMethod(new Method("comparator", ""));