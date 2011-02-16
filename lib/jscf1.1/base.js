// Class to represent a method
Method = function(name, params, body){
	this.name = name || "dummyMethod";
	this.params = params || "dummy";
	this.body = body || "";
};

// create the function from definition
Method.prototype.create = function(){
	return window.eval( this.name + "=" + "function" + "(" + this.params + ")" + "{" + this.body + "}" );
};

// invoke the function
Method.prototype.invoke = function(thisObj, args){
	var fun = this.create();
	fun.apply(thisObj, args);
};

// Getter/Setter
Method.prototype.getName = function(name){
	return this.name;
};

Method.prototype.setName = function(name){
	if(name)
		this.name = name;
};

Method.prototype.getParams = function(){
	return this.params;
};

Method.prototype.setParams = function(params){
	if(params)
		this.params = params;
};

Method.prototype.getBody = function(){
	return this.body;
};

Method.prototype.setBody = function(body){
	if(body)
		this.body = body;
};

// Class to represent a variable
Variable = function(variable){
	this.variable = variable;
};

// create the variable from definition
Variable.prototype.create = function(){
	return window.eval("var " + this.variable + ";");
};

// set a value to the var
Variable.prototype.setValue = function(value){
	var myVar = this.create();
	myVar = value;
};

// get the value of the var
Variable.prototype.getValue = function(){
	var myVar = this.create();
	return myVar;
};

// getter
Variable.prototype.getVariable = function(){
	return this.variable;
};

// setter
Variable.prototype.setVariable = function(variable){
	if(variable)
		this.variable = variable;
};

// Define Class object - Acts as a template for creating other classes
Class = function(){
};

Class.initOverload = function(){
	return function(){
		var theFun = arguments.callee;
		theFun.me = this;
		var meth = theFun.getMethod(arguments);
		if(meth)
			return meth.apply(this, arguments)
		else
			throw new NoSuchMethodException("No method found");
	};
};

Class.init = function(cls){
    var newClass = cls;
    newClass.Static = newClass;
    newClass.method = newClass.prototype;
    newClass.member = newClass.prototype;
    newClass.override = newClass.prototype;
    return cls;
};

// Static method to create a new class
Class.define = function(){
	var newClass = function(){
		var constructr = arguments.callee.getConstructor(arguments);
		constructr.apply(this, arguments);
	};

    // Default no argument constructor
	newClass.Constructor(function(){});

	// provide any other constructor if any
	if(arguments[0] && arguments[0] instanceof Function){
		newClass.Constructor(arguments[0]);
	}
    return Class.init(newClass);
};

// Static method to create a new class and inherit a super class
Class.extend = function(superCls){
	var newClass = null;
	if(superCls && superCls instanceof Object){
		if(arguments[1])
			newClass = Class.define(arguments[1]);
		else
			newClass = Class.define();

		newClass.prototype = new superCls();
		newClass.prototype.constructor = newClass;
		newClass.superClass = function(){
			superCls.apply(this, arguments);
		};
		newClass.prototype.base = superCls.prototype;
    }
	return Class.init(newClass);
};

// Define Interface object - Acts as a template for creating interfaces
Interface = function(){
	this.vars = new Object();
	this.methods = new Object();
};

Interface.define = function(){
	return new Interface();
};

Interface.prototype.declareMethod = function(methodObj){
	this.methods["Method_" + methodObj.name + "_" + methodObj.params] = methodObj;
};

Interface.prototype.declareVariable = function(varObj){
	this.vars["Var_" + this.vars.length] = varObj;
};

Interface.extend = function(anInterface){
	// Inherit the variables
	var newInterface = Interface.define();
	for(var myVar in anInterface.vars){
		newInterface.vars[myVar] = anInterface.vars[myVar];
	}

	// Inherit the methods
	for(var myMeth in anInterface.methods){
		newInterface.methods[myMeth] = anInterface.methods[myMeth];
	}
	return newInterface;
};

/*******************************************************
  Extend functions capabilities
 *******************************************************/
Function.prototype.Constructor = function(funPtr){
    if(this.overLoadMap == null){
        this.overLoadMap = new Array();
    }
	this.overLoadMap["Function_" + funPtr.length] = funPtr;
};

Function.prototype.getConstructor = function(args){
	if(this.overLoadMap){
		return this.overLoadMap["Function_" + args.length];
	}
};

Function.prototype.getMethod = function(args){
	if(this.funLoadMap){
		var fun = this.funLoadMap["Function_" + args.length];
		return fun;
	}
};

Function.prototype.overload = function(funPtr){
    if(this.funLoadMap == null){
        this.funLoadMap = new Array();
    }
	this.funLoadMap["Function_" + funPtr.length] = funPtr;
};

Function.prototype.equals = function(funPtr){
	return this.toString() == funPtr.toString();
};

Function.prototype.clone = function(funPtr){
	return this;
};

Function.prototype.hashCode = function(funPtr){
	return this.toString().hashCode();
};

Function.prototype.type = function(){
	return "function";
};
/*******************************************************
  Extend Array capabilities
 *******************************************************/
Array.prototype.clone = function(){
	var newArray  = new Array();
	for(i = 0; i < this.length; i++)
		newArray[i] = this[i];
	return newArray;
};

Array.prototype.equals = function(arr){
	if(arr.length != this.length)
		return false;

	for(i = 0; i < this.length; i++)
		if( !this[i].equals(arr[i]))
			return false;
	return true;
};

Array.prototype.hashCode = function(){
	var hashcode = 0;
	for(var i = 0; i < this.length; i++){
		if(this[i] && this[i] != null)
			hashcode = hashcode * 31 + this[i].hashCode();
	}

	return hashcode;
};

Array.prototype.type = function(){
	return "array";
};

/////////////////////////////////////////////////////////////////////
//////				Extend Number class's capabilities       ////////
/////////////////////////////////////////////////////////////////////
Number.prototype.toOctal = function(){
    return this.toString(8);
};

Number.prototype.toHexadecimal = function(){
    return this.toString(16);
};

Number.prototype.toNumber = function(){
    return this.toString();
};

Number.prototype.toBinary = function(){
    return this.toString(2);
};

Number.prototype.hashCode = function(){
	if(this.toString().indexOf(".") < 0)
		return this;
	else
		return this.toString().hashCode();
};

Number.prototype.type = function(){
   return "Number";
};

/////////////////////////////////////////////////////////////////////
//////				Extend String class's capabilities       ////////
/////////////////////////////////////////////////////////////////////
String.prototype.compareTo = function(str){
    if(str > this)
        return -1;
    else if(str < this)
        return 1;
    else
        return 0;
};

String.prototype.compareToIgnoreCase = function(str){
    if(str.toLowerCase() > this.toLowerCase())
        return -1;
    else if(str.toLowerCase() < this.toLowerCase())
        return 1;
    else
        return 0;
};

String.prototype.endsWith = function(str){
    var reg = new RegExp(str + "$");
    return reg.exec(this) != null ? true : false;
};

String.prototype.startsWith = function(str){
    var reg = new RegExp("^" + str);
    return reg.exec(this) != null ? true : false;
};

String.prototype.equals = function(str){
    return str == this ?  true: false;
};

String.prototype.equalsIgnoreCase = function(str){
    return str.toLowerCase() == this.toLowerCase() ?  true: false;
};

String.prototype.regionMatches = function(str){
    var reg = new RegExp(str);
    return reg.exec(this) != null ? true : false;
};

String.prototype.trim = function(){
    return this.replace(/\s$/, '').replace(/^\s/, '');
};

String.prototype.getChars = function(start, end){
    var chars = new Array();
    for(var i = start; i < end; i++)
        chars.push(this.charAt(i));
    return chars;
};

String.prototype.toString = function(){
   return this;
};

String.prototype.hashCode = function(){
	if(this.cachedCode && this.cachedCode != 0)
		return this.cachedCode;

	var hashcode = 0;
	for(var i = 0; i < this.length; i++)
		hashcode = hashcode * 31 + this.charCodeAt(i);

	return this.cachedCode = hashcode;
};

String.prototype.type = function(){
   return "String";
};

String.prototype.compareTo = function(obj){
	if(this > obj)
		return 1;
	else if(this < obj)
		return -1;
	else return 0;
};

/////////////////////////////////////////////////////////////////////
//////				Extend Object class's capabilities       ////////
/////////////////////////////////////////////////////////////////////


/**
 * Extend the functionalities of the Object class of JavaScript
 */

Object.prototype.equals = function(obj){
    var eq = true;
    if(obj instanceof Object){
    	// Check if properties length matches
    	if(this.properties().length != obj.properties().length)
    		return false;
    	// Check if all properties are same or not
    	var props = this.properties().sort();
    	var objProps = obj.properties().sort();
    	for(var i = 0; i < props.length; i++){
    		if(props[i] != objProps[i])
    			return false;
    	}
    	// Check if all the values are same
        for(var prop in this){
            if(typeof(this[prop]) == "object"){
                eq = eq && this[prop].equals(obj[prop]);
            }else{
                if(obj[prop] != this[prop])
                    eq = eq && false;
                else
                    eq = eq && true;
            }
        }
    }else{
        return this == obj;
    }
    return eq;
};

/**
 * Any object can implement any interface
 */
Object.prototype.implement = function(anInterface){
	// Inherit the variables
	for(var myVar in anInterface.vars){
		var myVariable = anInterface.vars[myVar];
		if(myVariable.create){
			if(!this.prototype[myVariable.variable])
                this.prototype[myVariable.variable] = myVariable.create();
		}
	}

	// Inherit the methods
	for(var myMeth in anInterface.methods){
		var method = anInterface.methods[myMeth];
		if(method.create && !this.prototype[method.name]){
			this.prototype[method.name] = method.create();
		}
	}
	return this;
};

/**
 *
 */
Object.prototype.inherit = function(obj){
    for (var property in obj) {
        this[property] = obj[property];
    }
};

/**
 *
 */
Object.prototype.clone = function(){
    var newObj = new Object();
	for(var prop in this) {
        if(this[prop] instanceof Object){
	        newObj[prop] = this[prop].clone();
        }else{
	        newObj[prop] = this[prop];
        }
	}
	return newObj;
};

Object.prototype.hashCode = function(){
    var hashcode = 0;
    var props = this.properties().sort();
	for(var i = 0; i < props.length; i++)
		if(this.hasOwnProperty(props[i]))
	        hashcode = hashcode * 31 + this[props[i]].hashCode() + props[i].hashCode();
	return hashcode;
};

Object.prototype.type = function(){
   return "Object";
};

Object.prototype.properties = function(){
    var props = new Array();
	for(var prop in this)
		props.push(prop);
	return props;
};

// Class System
System = Class.define();

System.arraycopy = function(src, srcStart, dest, destStart, len){
	if(srcStart >= destStart)
		for(var i = 0; i < len; ++i)
			dest[destStart + i] = src[srcStart + i];
	else
		for(var i = len - 1; i >= 0; --i)
			dest[destStart + i] = src[srcStart + i];
};

/*
class Exception to handle all the Exceptions
*/
Exception = Class.define();

Exception.Constructor(
	function(message){
		this.message = message;
	}
);

IllegalArgumentsException = Class.extend(Exception);

IllegalArgumentsException.Constructor(
	function(description){
		IllegalArgumentsException.superClass.call(this, "No Arguments or Illegal arguments used to invoke a method");
		this.description = (description ? description : "");
		this.errorNumber = 1;
	}
);

NullPointerException = Class.extend(Exception);

NullPointerException.Constructor(
	function(description){
		NullPointerException.superClass.call(this, "Invalid use of null reference.");
		this.description = (description ? description : "");
		this.errorNumber = 2;
	}
);

ArrayIndexOutOfBoundsException = Class.extend(Exception);

ArrayIndexOutOfBoundsException.Constructor(
	function(description){
		ArrayIndexOutOfBoundsException.superClass.call(this, "Array Index is out-of-bounds.");
		this.description = (description ? description : "");
		this.errorNumber = 3;
	}
);

ClassCastException = Class.extend(Exception);

ClassCastException.Constructor(
	function(description){
		ClassCastException.superClass.call(this, "Invalid Cast.");
		this.description = (description ? description : "");
		this.errorNumber = 4;
	}
);

UnsupportedOperationException = Class.extend(Exception);

UnsupportedOperationException.Constructor(
	function(description){
		UnsupportedOperationException.superClass.call(this, "An unsupported operation was encountered.");
		this.description = (description ? description : "");
		this.errorNumber = 5;
	}
);

ConcurrentModificationException = Class.extend(Exception);

ConcurrentModificationException.Constructor(
	function(description){
		ConcurrentModificationException.superClass.call(this, "Collection was modified concurrently.");
		this.description = (description ? description : "");
		this.errorNumber = 6;
	}
);

NoSuchElementException = Class.extend(Exception);

NoSuchElementException.Constructor(
	function(description){
		NoSuchElementException.superClass.call(this, "No such element exists.");
		this.description = (description ? description : "");
		this.errorNumber = 7;
	}
);

IllegalStateException = Class.extend(Exception);

IllegalStateException.Constructor(
	function(description){
		IllegalStateException.superClass.call(this, "Iterator is in illegal state.");
		this.description = (description ? description : "");
		this.errorNumber = 8;
	}
);

NoSuchValueException = Class.extend(Exception);

NoSuchValueException.Constructor(
	function(description){
		NoSuchValueException.superClass.call(this, "No such value exists.");
		this.description = (description ? description : "");
		this.errorNumber = 9;
	}
);
