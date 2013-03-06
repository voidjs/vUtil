vUtil
=====

个人的一个方法类库，参照jQuery的实现方式编写，核心为vUtil.Class,一个javascript的Class，模仿基于Class的面向对象方式。具有
继承，重载，静态方法，扩展等特性。
--------------------------------------------------------------
### 示例:
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
		
		var tom = new Tom;
		tom.breath();
		tom.setConstant('type','i am a cat');
		alert(tom.getConstant('type'));//i am a cat
		alert(cat.getConstant('type'));//i am a cat
