(function (exports) {
	//方法补丁...
	if(typeof Object.create!=='function'){
		Object.create = function(o){
			function F(){};
			F.prototype = o;
			return new F();
		}
	}
	Date.prototype.format = function(format) //author: meizz 
	{
		var o = {
			"M+": this.getMonth() + 1,
			//month 
			"d+": this.getDate(),
			//day 
			"h+": this.getHours(),
			//hour 
			"m+": this.getMinutes(),
			//minute 
			"s+": this.getSeconds(),
			//second 
			"q+": Math.floor((this.getMonth() + 3) / 3),
			//quarter 
			"S": this.getMilliseconds() //millisecond 
		};
		if (/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		for (var k in o) {
			if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}

		return format;
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
		core_trim = core_trim =Object.prototype.trim||function(){
			return this.replace(/^\s+/,'').replace(/\s+$/,'');
		};
	var 
		cssExpr = /-(\w)/,
		fitterCssStr = function(str){
			str = core_trim.call(str);
			return str.replace(cssExpr,function(){
				return arguments[1].toUpperCase();
			});
		};
	var	Class = function () {
			var klass = function(){
				return klass.init.apply(this,arguments);
			}
			klass.fn = klass.prototype;
			klass.parent = klass.fn.parent = klass;
			klass.init = function(){
				var instance = Object.create(klass.prototype);
				instance.init.apply(instance,arguments);
				if(!instance.inherited) instance._defaults =new Class;
				instance._attributes = {};
				if(typeof arguments[0]==='object'&&typeof arguments[0].defaults==='object'){
					instance.defaults(arguments[0].defaults);
				}
				return instance;
			}
			klass.inherite = function(parent){
				if(parent.proxyAll){
					parent.proxyAll(parent,true);
				}
				this.fn.inherited = true;
				this.fn.__proto__ = parent;
				this.fn.parent = parent;
				this.fn._defaults = parent._defaults;
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
					if(typeof arguments[0]!=='function'&&typeof arguments[1]==='function'){
						self = arguments[0];
						fn = arguments[1];
					}
					return (function(){
						return fn.apply(self,arguments);
					})
				},
				getSuper:function(){
					if(this.parent._self) return this.parent._self;
					return this.parent;
				},
				proxyAll:function(obj,flag){
					var proxyObj;
					if(flag === true){
						proxyObj = this._self = this._self|| {};
					}
					else
						proxyObj = this;
						for(var key in obj){
							if(typeof obj[key] ==='function'){
								proxyObj[key]=this.proxy(obj[key]);
							}
							else{
								proxyObj[key] = obj[key];
							}
						}
				}
			});
			klass.fn.proxy = klass.proxy;
			klass.fn.proxyAll = klass.proxyAll;
			klass.fn.include = klass.include;
			klass.fn.getSuper = klass.getSuper;
			klass.fn.extend = klass.extend;
			klass.fn.inherite = klass.inherite;
			var _events = {},_callbackList={};
			klass.include({
				init:function(){

				},
				fn:klass.fn,
				inherited:false,
				defaults:function(obj){
					this.include(obj);
					this._defaults.extend(obj);
				},
				set:function(attr,value){
					this._attributes[attr] = value;
					return this;
				},
				get:function(attr){
					return this._attributes[attr];
				},
				setConstant:function(attr,value){
					this._defaults[attr] = value;
				},
				getConstant:function(attr){
					return this._defaults[attr];
				},
				bindEvent:function(type,fn){
					if(typeof type!=='string'||!_events[type]) return this;
					_callbackList[type]=_callbackList[type]||[];
					_callbackList[type].push(fn);
					return this;
				},
				trigger:function(event){
					if(typeof event==='string'){
						var callbacks = _callbackList[event],len = callbacks.length,i=0,args = [].slice.call(arguments,1),rtValue = _events[event].apply(this,args); 
						if(len>0){
							for(;i<len;i++){
								callbacks[i].call(this,rtValue);
							}
						}
					}
				},
				addEvents:function(type,fn){
					var obj;
					if(typeof type==='string'&&typeof fn ==='function'){
						obj={
							type:fn
						}
					}
					else if(typeof type ==='object'){
						obj = type;
					}
					else return this;
					for(var key in obj){
						_events[key] = obj[key];
						this.fn[key] = function(){
							this.trigger(key);
						}
					}
				}

			});
			return klass;
		};
	vUtil = new Class;
	//vUtil实例方法
	vUtil.include({
		constructor:vUtil,
		init:function(selector,context){
			if(!selector){
				return this;
			}
			else if(selector.nodeType){
				this.push(selector);
				return this;
			}
			else if(typeof selector ==='string'){
				vSizzle(selector,context,this);
				return this;
			}
			else if(typeof selector ==='function'){
				window.onload = function(){
					selector();
				}
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
				core_slice.call(this,i):
				core_slice.call(this,i,i+1);
		},
		each:function(objs,callback){
			var name,
				i=0,
				len;
			if(typeof objs ==='function'){
				callback = objs;
				objs = this;
			}
			len = objs.length;
			if(len&&typeof callback==='function'){
				for(;i<len;i++){
					if(callback.call(objs[i],i,objs[i]) ===false)
						break;
				}
			}
			return this;
			

		},
		_creatEvent:function(e,rtObj){
			var Event = new vUtil.Class;
			Event.inherite(e);
			var event = new Event;
			event.include({
				preventDefault:function(){
					if(this.getSuper().preventDefault)
						this.getSuper().preventDefault();
					else{
						this.returnValue = false;
					}
				},
				stopPropagation:function(){
					if(this.getSuper().stopPropagation)
						this.getSuper().stopPropagation();
					else{
						this.getSuper().cancelBubble = true;
					}
				}
			})
			return event;
		},
		bind:function(type,fn){
			var obj = {},eventList=[],len = this.length,i=0,j=0,self = this;
			
			if(vUtil.isObject(type)){
				obj = type;
				for(var key in type){
					eventList.push(key);
				}
			}
			if(vUtil.isString(type)){
				eventList = type.split(/\s+/);
				for(i=0;i<eventList.length;i++){
					obj[eventList[i]] = eventHandler;
				}
			}
			var eventHandler = function(e){
					e = e||window.event;
					e = Event(e);
					fn.call(this,e);
					return e.returnValue;
			};
			for(i=0;i<len;i++){
				for(j=0;j<eventList.length;j++){
					(function(context){
						if(document.addEventListener){
							context.addEventListener(''+eventList[j],eventHandler,false);
						}
						else if(document.attachEvent){
							context.attachEvent('on'+eventList[j],self.proxy(context,eventHandler));
						}
						else{
							context['on'+eventList[j]] = eventHandler;
						}
					})(this[i]);
				}
			}
		},
		trigger:function(event){
			var len = this.length;
			if(document.dispatchEvent){
				var evt = document.createEvent('HTMLEvents');
				evt.initEvent(event,false,false);
				for(var i=0;i<len;i++){
					this[i].dispatchEvent(evt);
				}
			}
			else if(document.fireEvent){
				for(var i=0;i<len;i++){
					this[i].fireEvent('on'+event);
				}
			}
			return this;
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
			return this;
		},
		css:function(css,value){
			var cur,style;
			if(typeof css==='string'){
				css = fitterCssStr(css);
				if(!value){
					style = this[0].currentStyle||window.getComputedStyle(this[0],false);
					if(style){
						return style[css];
					}
				}
				else if(typeof value==='string'){
					for(var i=0;i<this.length;i++){
						this[i].style[css] = value;
					}
				}
			}
			else if(typeof css ==='object'){
				
				for(var i=0;i<this.length;i++){
					cur = this[i];
					vUtil.merge(cur.style,css);
					
				}
			}
			return this;
		},
		length: 0,
		 push: core_push,
		 sort: [].sort,
		splice: [].splicez
	});
	var _creatEvent = function(){
		var Event = new vUtil.Class;
		Event.include({
			init:function(e){
				this.inherite(e);
				var pageX,pageY,offsetX,offsetY;
				if(e.pageX||e.pageY){
					pageX = e.pageX;
					pageY = e.pageY;
				}
				else if(e.clientX||e.clientY){
					pageX = e.clientX+document.documentElement.scrollLeft+document.body.scrollLeft;
					pageY = e.clientY+document.documentElement.scrollTop+document.body.scrollTop;
				}
				if(e.offsetX||e.offsetY){
					offsetX = e.offsetX;
					offsetY = e.offsetY;
				}
				else if(e.layerX||e.layerY){
					offsetX = e.layerX;
					offsetY = e.layerY;
				}
				vUtil.merge(this,{
					oEvent:e,
					pageX:pageX,
					pageY:pageY,
					offsetX:offsetX,
					offsetY:offsetY
				});
			},
			preventDefault:function(){
				if(this.getSuper().preventDefault)
					this.getSuper().preventDefault();
				else{
					this.returnValue = false;
				}
			},
			stopPropagation:function(){
				if(this.getSuper().stopPropagation)
					this.getSuper().stopPropagation();
				else{
					this.getSuper().cancelBubble = true;
				}
			}
		})
		return Event;
	};
	
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
		isArray:function(obj){
			return core_toString.call(obj)==='[object Array]';
		},
		trim:core_trim,
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
				obj1[key] = obj2[key];
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
				if(args.length>=arr.length){
					args=[];
					fn(args);
				} 
			}
			return tempFN;
		}
	});
	(function(window){
		var
			chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?/g,
			blockExpr = /[ >+~]/,
			extraExpr = /^.+(\[.+)|(:.+)/,
			rquickExpr = /^(?:(#([\w-]+)|(\w+)|\.([\w-]+))[:\[]?.*\]?)$/,
			push = Array.prototype.push,
			support = {};
		function checkSuport(){
			support.qsa = (typeof document.querySelectorAll ==='function');
			support.getElementsByClassName = function(searchClass,context){
				context = context||document;
				var els = context.getElementsByTagName('*'),
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
			};
		}
		checkSuport();
		window.vSizzle = function(selector,context,results){
			context = context||document;
			results = results||[];
			var match,m,nodeType = context.nodeType,elem,rtElem,
			ret = selector.match(chunker),nodeList = [],i,j,temList;
			nodeList.push(context);
			if(!support.qsa&&ret){
				for(i =0;i<ret.length;i++){
					if(!blockExpr.test(ret[i])){
						temList = [];
						for(j=0;j<nodeList.length;j++){
							context = nodeList[j];
							var re = select(ret[i],context);
							push.apply(temList,re);						
						}
						nodeList = temList;
					}
				}
			}
			else{
				try{
					return push.apply(results,document.querySelectorAll(selector));
				}
				catch(err){

				}
				finally{
					return results;
				}
			}
			push.apply(results,nodeList);
			return results;
		};
		var select = function(selector,context,results){
			context = context||document;
			results = results||[];
			var match,m,nodeType = context.nodeType,elem,rtElem,temResult=[];
			if((match = rquickExpr.exec(selector))){
				if(m = match[2]){	
					if(context.nodeType==9){
						elem = context.getElementById(m);
					}
					else{
						elem = context.ownerDocument.getElementById(m);
					}
					if(elem&&elem.parentNode){
						temResult.push(elem);
					}
					
				}
				else if(m=match[3]){
					push.apply(temResult,context.getElementsByTagName(m));
				}
				else if(m=match[4]){
					if(context.getElementsByClassName){
						rtElem = context.getElementsByClassName(m);
					}
					else{
						rtElem = support.getElementsByClassName(m,context);
					}
					push.apply(temResult,rtElem);
				}
			}
			push.apply(results,extraSelect(temResult,match[0]));
			return results;

		}
		var extraSelect = function(doms,exsel,results){
			results = results||[];
			var match = exsel.match(extraExpr),temResult = [],
			attrExpr = /\[(\w+)=(\w+)\]/,
			fitterExpr = /:(\w+)/,
			len = doms.length,dom;
			if(match){
				if(match[1]){
					var  a = match[1].match(attrExpr);
					var key = a[1];
					var value = a[2];
					for(var i =0;i<len;i++){
						dom = doms[i];
						if(dom&&dom.getAttribute(key)===value){
							temResult.push(dom);
						}
					}
				}
				if(match[2]){
					var  f = match[2].match(fitterExpr);
				}
			}
			else{
				temResult = doms;
			}
			push.apply(results,temResult);
			return results;
		}
	})(window);
	var Event = _creatEvent();
	vUtil.fn.init.prototype = vUtil.fn;
	exports.vUtil  = vUtil;
})(window);