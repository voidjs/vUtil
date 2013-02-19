(function (exports) {
	//方法补丁...
	if(typeof Object.create!=='function'){
		Object.create = function(o){
			function F(){};
			F.prototype = o;
			return new F();
		}
	}
	var getElementsByClassName = function(searchClass){
			var els = document.getElementsByTagName('*'),
				elsLen = els.length,
				classElements = [],
				pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");
	        for (i = 0, j = 0; i < elsLen; i++) {
	                if ( pattern.test(els[i].className) ) {
	                        classElements[j] = els[i];
	                        j++;
	                }
	        }
	        return classElements;
	}
	//函数库正文
	var location = window.location,
		navigator = window.navigator,
		_vUtil = window.vUtil,
		_$ = window.$,
		core_push = Array.prototype.push,
		core_slice = Array.prototype.slice,
		core_indexOf = Array.prototype.indexOf,
		core_toString = Object.prototype.toString,
		core_hasOwn = Object.prototype.hasOwnProperty,
		core_trim = String.prototype.trim;
	var	Class = function () {
			var klass = function(){
				return klass.init.apply(this,arguments);
			}
			klass.fn = klass.prototype;
			klass.init = function(){
				var instance =  Object.create(klass.prototype);
				instance.init.apply(instance,arguments);
				return instance;
			}
			klass.extend = function(obj){
				for(var key in obj){
					klass[key] = obj[key];
				}
			}
			klass.include = function(obj){
				for(var key in obj){
					klass.fn[key] = obj[key];
				}
			}
			klass.extend({
				proxy:function(fn){
					var self = this;
					return (function(){
						return fn.apply(self,arguments);
					})
				}
			});
			klass.fn.proxy = klass.proxy;
			klass.fn.include = klass.include;
			klass.fn.init=function(){};
			return klass;
		};
	vUtil = new Class;
	//vUtil实例方法
	vUtil.include({
		constructor:vUtil,
		init:function(selector,context){
			var doms = [];
			if(!selector){
				return this;
			}
			else if(selector.nodeType){
				this.length=1;
				this[0]=selector;
				return this;
			}
			else if(document.querySelectorAll){
				doms = document.querySelectorAll(selector);
				for(var i=0;i<doms.length;i++){
					this.push(doms[i]);
				}
				return this;
			}
			else if(window.jQuery){
				doms = jQuery(selector);
				for(i=0;i<doms.length;i++){
					this.push(doms[i]);
				}
				return this;
			}
			else if(typeof selector ==='string'){					
				if(selector.charAt(0) =='#'){
					doms = document.getElementById(selector.slice(1));
				}
				else if(selector.charAt(0) =="."){
					doms = getElementsByClassName(selector.slice(1));
				}
				else{
					doms = document.getElementsByTagName(selector);
				}
				for(var i=0;i<doms.length;i++){
					this.push(doms[i]);
				}
				return this;
			}

		},
		size:function(){
			return this.length;
		},
		toArray:function(){
			return core_slice.call(this);
		},
		get:function(i){
			return i ==null?
					this.toArray():
					(i<0?this[this.length+i]:this[i]);
		},
		eq:function(i){
			i=+i;
			return i==-1?
				this.slice(i):
				this.slice(i,i+1);
		},
		each:function(objs,callback){
			var name,
				i=0,
				len=objs.length;
			if(objs){
				for(;i<len;i++){
					if(callback.call(objs[i],i,objs[i]) ===false)
						break;
				}
			}
			else{
				for(;i<len;i++){
					if(callback.call(objs[i],i,objs[i]) ===false)
						break;
				}
			}

		},
		attr:function(attr,value){
			if(attr&&typeof attr==='string'){
				if(value){
					var i=0,val;
					for(;i<this.length;i++){
						
						if(typeof value==='function'){
							var dom = this[i];
							val = value.call(dom,vUtil(this[i]).attr(attr));
						}
						else
							val = value;
						if(typeof val !=='undefined')
							this[i].setAttribute(attr,val);
					}
					return this;
				}
				else{
					var attrs = [], i=0,curAttr;
					for(;i<this.length;i++){
						if(curAttr=this[i].getAttribute(attr))
						attrs.push(curAttr);
					}
					if(attrs.length>1)
						return attrs;
					else
						return attrs[0];
				}
			}
		},
		length: 0,
		push: core_push,
		sort: [].sort,
		slice:core_slice,
		plice: [].splice
	});
	//vUtil类方法
	vUtil.extend({
		Class:Class,
		isFunction:function(obj){
			return typeof(obj) ==='function';
		},
		isObject:function(obj){
			return typeof(obj)==='object';
		},
		isString:function(obj){
			return typeof(obj)==='string';
		},
		isUndefined:function(obj){
			return typeof(obj)==='undefined';
		},
		ajax:function(op){
			var option = {
				url:'',
				type:'POST',
				dataType:'text',
				data:'',
				success:function(data){

				},
				error:function(err){

				}
			}
			vUtil.merge(option,op);
			var url =option.url,data = option.data,sendData='',xmlhttp;
			if(!url) return;
			if (window.XMLHttpRequest)
			  {// code for IE7+, Firefox, Chrome, Opera, Safari
			  xmlhttp=new XMLHttpRequest();
			  }
			else
			  {// code for IE6, IE5
			  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
			  }
			if(!vUtil.isUndefined(xmlhttp)&&option.url!==''){
				
				if(data!=''){
					
					if(vUtil.isObject(data)){
						var j = 0,key;
						for(key in data){
							if(j>0){
								sendData+='&'+key+'='+data[key];
							}
							else{
								sendData+= key+'='+data[key];
							}
							j++;
						}
					}

				}
				
				if(option.type=='POST'){
					sendData = encodeURIComponent(sendData);
					xmlhttp.open('POST',url,true);
					xmlhttp.send(sendData);
				}
				else if(option.type=='GET'){
					url+='?'+sendData;
					xmlhttp.open('GET',url,true);
					xmlhttp.send();
				}
				var status = 0;
				xmlhttp.onreadystatechange = function(){
					if (xmlhttp.readyState==4){
						status = xmlhttp.status;
						if(status >= 200 && status < 300 || status === 304 ){
							res = xmlhttp.responseText;
							if(option.dataType=='xml'){
								res = xmlhttp.responseXML;
							}
							if(option.dataType=='json'){
								res = vUtil.parseJSON(res);
							}
							option.success(res);
						}
					    
					}
				}
			}
		},
		parseJSON:function(data){
			if(!data||typeof data!=='string'){
				return null;
			}
			if ( window.JSON && window.JSON.parse ) {
				return window.JSON.parse( data );
			}
			else {
				return(new Function('return'+data));
			}
		},
		clone : function(obj){
			var objClone;
			if (obj.constructor == Object){
				objClone = new obj.constructor();
			}else{
				objClone = new obj.constructor(obj.valueOf());
			}
			for(var key in obj){
				if ( objClone[key] !== obj[key] ){
					if ( typeof(obj[key]) === 'object' ){
						objClone[key] = this.clone(obj[key]);
					}else{
						objClone[key] = obj[key];
					}
				}
			}
			objClone.toString = obj.toString;
			objClone.valueOf = obj.valueOf;
			return objClone;
		},
		merge:function(obj1,obj2){
			var key;
			for(key in obj2){
				if(typeof obj1[key]!=='undefined'){
					obj1[key] = obj2[key];
				}
			}
		},
		fitter:function(obj){
			var key,o ={};
			for(key in obj){
				if(obj[key]&&(obj[key].length>0||typeof obj[key] ==='number')){
					o[key] = obj[key];
				}
			}
			return o;
		},
		curryList:function(arr,fn){
			var args = [];
			var tempFN = function(){
				args.push(arguments[0]);
				if(args.length>=arr.length) fn(args);
			}
			return tempFN;
		}
	});	
	vUtil.fn.init.prototype = vUtil.fn;
	exports.vUtil  = vUtil;
})(window);