vUtil
=====

个人的一个方法类库，参照jQuery的实现方式编写.核心为vUtil.Class,一个javascript的Class，模仿基于Class的面向对象方式。具有继承，重载，静态方法，扩展等特性。
关于使用方式，方式基本与jQuery一致，由于出于体积考虑，不加入jQuery的sizzle选择器，只提供简单的选择器功能和浏览器自带选择器，如有加载jQuery则使用jQuery选择器
--------------------------------------------------------------

### 示例:
	<div class="div1" name="hi"></div>
	var div1 = vUtil('.div1').attr('name','hello');
	alert(div1.attr('name'));//hello
	//主要的Class类
	var Class = vUtil.Class;
		var Cat = new Class;
		Cat.extend({//extend方法为类设置方法，无需实例化，实例化后子类也不会拥有该方法
			showClassName:function(){
				alert('CatClass')
			}
		})
		Cat.include({//include方法为实例扩展方法
			breath:function(){
				alert('cat!');
			}
		})
		var Tom = new Class;
		var cat = new Cat;
		Tom.inherite(cat);
		Tom.include({
			breath:function(){
				alert('tom cat!');
				this.super().breath();// 调用父类breath方法，作用域绑定为父类。alert('cat!');
			}
		})
		cat.addEvents({//设置event事件
			add:function(obj){
				alert('add');
				return 1;
			}
		})
		cat.bindEvent('add',function(value){//绑定触发事件后的回调函数
			alert(value);
		})
		cat.bindEvent('add',function(value){
			alert(value+1);
		})
		cat.add();//调用add函数后触发回调,回调函数参数为event触发后的return值
		var tom = new Tom;
		tom.breath();
		tom.setConstant('type','i am a cat');
		alert(tom.getConstant('type'));//i am a cat
		alert(cat.getConstant('type'));//i am a cat
