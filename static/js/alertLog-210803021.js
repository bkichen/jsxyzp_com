
//使用方法；在想要调用的页面引入当前的文件：alertLog.js

//使用时，先new Dialog();创建一个弹框对象然后，这个对象调用init()方法就可以创建弹框了
//在当前的div中生成,默认为空，自动生成div
/* var alertLog=new Dialog();
	var alertLog=new Dialog();
	alertLog.init({
		iNow:false,         //序数
			w: 400,             //宽度
			h: 150,             //高度
			dir: 'center',      //弹出框以什么位置弹出
			title: '标题',      //标题文字 
			titH:38,            //标题栏高度
			titFontSize:14,		//标题文字大小
			titWeight:'600',     //标题的粗细
			btnboxH:40,         //按钮高度
			btnboxMw:10,        //底下按钮边框    
			boxId:'alertLogin1', //id
			marK: true,     //遮罩显示
			marKop:'0.2',   //遮罩的透明度
			oMarkId:'mark',//  背景遮罩的id
			isbtn:true,     //按钮显示
			alertlog:false,  //作为提示框
			zindex:100,		//zindex层次
			time:false,  //默认1.5秒隐藏[false,true,number=>1000]
			btnName:['取消','保存'],  //按钮名字
			btnId:['close','ok'],  //按钮id
			content:'请输入要填写的内容',  //主体内容
			skin:0,              //风格颜色
			closebtn:true,       //右上角删除按钮
			adsorption:0,        //拖拽吸附的像素
			dislocation:13,      //iframe偏移像素
			radius:0,           //圆角
			btnEvent:[           //对应按钮的id的按钮的事件
				{
					close:true,
					fn:function(){   //回调
						return false;   //返回true会关闭弹框
					}
				},
				{
					ok:true,
					fn:function(){  //回调函数
						return false;  //返回true会关闭弹框
					}
				}
			],
			drag:true,         //拖拽
			dragSize:false,     //拖拽弹出框的大小
			contentBg:'#fff',   //内容部分背景颜色
			skinType:skinColor,
			animation:false,  //动画效果
			animationTime:500, //动画时长
			contentId:""      //主体内容id
	});
} */
/*

下面为组件源码

 */
(function(){
	var Dialog=function(dom) {
		this.data={};
		this.settings = {//默认参数
			iNow:false,         //序数
			w: 400,             //宽度
			h: 150,             //高度
			dir: 'center',      //弹出框以什么位置弹出
			title: '标题',      //标题文字 
			titH:38,            //标题栏高度
			titFontSize:12,		//标题文字大小
			titWeight:'600',     //标题的粗细
			btnboxH:40,         //按钮高度
			btnboxMw:10,        //底下按钮边框    
			boxId:'alertLogin1', //id
			marK: true,     //遮罩显示
			markClick:true,
			marKop:'0.2',   //遮罩的透明度
			oMarkId:'mark',//  背景遮罩的id
			isbtn:true,     //按钮显示
			alertlog:false,  //作为提示框
			zindex:2000,		//zindex层次
			time:false,  //默认1.5秒隐藏[false,true,number=>1000]
			btnName:['取消','保存'],  //按钮名字
			btnId:['close','ok'],  //按钮id
			content:'请输入要填写的内容',  //主体内容
			skin:0,              //风格颜色
			closebtn:true,       //右上角删除按钮
			adsorption:0,        //拖拽吸附的像素
			dislocation:4,      //iframe偏移像素
			radius:5,           //圆角
			btnEvent:[           //对应按钮的id的按钮的事件
				{
					close:true,
					fn:function(){   //回调
						return false;   //返回true会关闭弹框
					}
				},
				{
					ok:true,
					fn:function(){  //回调函数
						return false;  //返回true会关闭弹框
					}
				}
			],
			drag:true,         //拖拽
			dragSize:false,     //拖拽弹出框的大小
			contentBg:'#fff',   //内容部分背景颜色
			skinType:skinColor,
			animation:false,  //动画效果
			animationTime:500, //动画时长
			callback:function(This){},
			contentId:""      //主体内容id
		}
	}
	Dialog.prototype.json = {};
	Dialog.prototype.init = function (opt) {
		extend(this.settings, opt);
		if (this.json[this.settings.iNow] == undefined) {
			this.json[this.settings.iNow] = true;
		}
		if (this.json[this.settings.iNow]) {
			this.create();
			this.fnClose();
			this.resize(this.onsetData);
			if (this.settings.marK===true) {
				this.createMark();
			}
			if(this.settings.animation===true){
				this.animation();
			}
			if(this.settings.drag===true){
				this.dragDrop();
			}
			if(this.settings.dragSize===true&&this.settings.dir=='center'){
				this.dragDropSize();
			}
			if(this.settings.alertlog===true){
				this.settings.animation=false;
			}
			if(this.settings.isbtn===true){
				for(var ia=0;ia<this.settings.btnEvent.length;ia++){
					if(this.settings.btnEvent[ia]){
						var This = this;
						var name = document.getElementById(this.settings.btnId[ia]);
						name.index=ia;
						name.onclick = function () {
							var asi=This.settings.btnEvent[this.index];
							var fn=asi['fn'];
							var ins=This.settings.btnId[this.index];
							if(typeof fn !='function' || fn=='undefined' ||fn==null ){

							}else if(asi[ins] == false){

							}else{
								var refn=fn();
								if(refn==false){

								}else{
									document.body.removeChild(This.oLogin);
									document.body.removeChild(This.oMark);
								}
							}
							This.json[This.settings.iNow] = true;
						}
					}
				}
			}
			this.settings.callback(this);
			this.json[this.settings.iNow] = false;
		}
	}
	Dialog.prototype.create = function () {
		var that=this;
		this.oLogin = document.createElement('div');
		if(document.getElementById(this.settings.boxId)){
			var lastid=this.settings.boxId;
			var numl=lastid.substr(-1,1);
			if(isNaN(numl)){
				this.settings.boxId=this.settings.boxId+'1';
			}else{
				this.settings.boxId=this.settings.boxId.substr(0,this.settings.boxId.length-1).toString()+(parseInt(numl)+1);
			}
		}
		this.oLogin.id = this.settings.boxId;
		this.oLogin.style.overflow='auto';
		this.oLogin.style.borderRadius=this.settings.radius+"px";
		this.oLogin.style.border=' 1px solid '+this.settings.skinType[this.settings.skin].borderColor;
		this.oLogin.style.position='fixed';
		this.oLogin.style.backgroundColor=this.settings.skinType[this.settings.skin].bg;
		this.oLogin.style.zIndex=this.settings.zindex+1;
		
		if(this.settings.skin > this.settings.skinType.length-1){
			this.settings.skin=0;
		}
		var strr='';
		if(this.settings.isbtn===true){
			strr='<div class="alertLogBottom" style="height:'+(this.settings.btnboxH-1)+'px;border-radius:0 0 '+this.settings.radius+'px '+this.settings.radius+'px;border-top:1px solid '+this.settings.skinType[this.settings.skin].borderColor+';margin:0 3px;line-height:'+(this.settings.btnboxH-1)+'px;background-color:'+this.settings.skinType[this.settings.skin].bottomBg+';">';
				for(var ib=0;ib<this.settings.btnName.length;ib++){
					strr+="<button class='alertLogButton' id='"+this.settings.btnId[ib]+"' style='border-radius:3px;border:1px solid "+this.settings.skinType[this.settings.skin].btnBorderColor+";background-color: "+this.settings.skinType[this.settings.skin].btnBg+"; padding:2px "+(this.settings.btnboxMw)+"px;margin-top:5px;line-height:"+(this.settings.btnboxH-14)+"px;height:"+(this.settings.btnboxH-10)+"px;display:block;float:right;margin-right:10px;cursor: pointer;color:"+this.settings.skinType[this.settings.skin].btnColor+";'>"+this.settings.btnName[ib]+"</button>";
				}
			strr+='</div>';
		}
		function ht(that){
			if(that.settings.closebtn){
			return '<span class="alertLogClose" style="display: block;float: left;float: right;background-color:'+that.settings.skinType[that.settings.skin].closeBg+';color:'+that.settings.skinType[that.settings.skin].closeColor+';height: 18px;font-family: cursive;line-height: 18px;margin-top: '+((that.settings.titH-18)/2)+'px;margin-right: 5px;cursor: pointer;width: 18px;text-align: center;">X</span>'
			}else{
				return "";
			}
		}
		var obj2html="";
		var obj2id="";
		var obj2Tagname="";
		function clonefn(contentDom1,_this){
			var obj2=document.getElementById(contentDom1)||"";
			if(obj2){
				obj2html=obj2.innerHTML;
				obj2id=contentDom1;
				obj2Tagname=obj2.tagName;
				var a=document.createElement("input");
				a.id=contentDom1+"CloneDomPasteData";
				a.type="hidden";
				a.txthtml=obj2.innerHTML;
				a.txtid=contentDom1;
				a.txttagname=obj2.tagName;
				document.body.appendChild(a);
				function removeElement(_element){
				 var _parentElement = _element.parentNode;
				 if(_parentElement){
						_parentElement.removeChild(_element);
				 }
				}
				removeElement(obj2);
			}else{
				var indata=document.getElementById(contentDom1+"CloneDomPasteData");
				obj2html=indata.txthtml;
				obj2id=indata.txtid;
				obj2Tagname=indata.txttagname;
			}
			var obj3=document.getElementById(_this.settings.boxId).children[1];
			obj3.innerHTML="<"+obj2Tagname+" id="+obj2id+">"+obj2html+"<"+obj2Tagname+">";
		}
		var martb=1;
		if(this.settings.alertlog){
			this.settings.titH=0;
			martb=1;
		}else{
			martb=0;
		}
		var none=this.settings.alertlog?"display:none;":"display:block;";
		var dragtrue=this.settings.drag?"cursor: move;":"";
		this.oLogin.innerHTML = '<div class="alertLogTitle" style="'+dragtrue+'line-height:'+this.settings.titH+'px;font-size:'+this.settings.titFontSize+'px;border-bottom:1px solid '+this.settings.skinType[this.settings.skin].borderColor+';height: '+this.settings.titH+'px;background-color: '+this.settings.skinType[this.settings.skin].titBg+';overflow: hidden;'+none+'">'
									+'<span class="alertLogtxt" style="font-weight:'+this.settings.titWeight+';text-overflow:ellipsis;line-height: '+this.settings.titH+'px;height: '+this.settings.titH+'px;display: block;float: left;color:'+this.settings.skinType[this.settings.skin].titColor+';text-indent:10px;white-space:nowrap;overflow:hidden;">'
									+ this.settings.title
									+'</span>'
									+ ht(this)
								+'</div>'
								+'<div class="alertLogContent" id="alertLogContent" style="margin:'+martb+'px 3px;padding:5px;background-color:'+this.settings.contentBg+';">'+(this.settings.contentId==""?this.settings.content:"")+'</div>' +strr;
		document.body.appendChild(this.oLogin);
		if(this.settings.isbtn===false){
			document.getElementById("alertLogContent").style.borderRadius="0 0 "+this.settings.radius+"px "+this.settings.radius+"px";
		}
		if(this.settings.alertlog){
			document.getElementById("alertLogContent").style.borderRadius=this.settings.radius+"px";
			this.oLogin.style.backgroundColor=this.settings.contentBg;
			if(this.settings.time != false && this.settings.time > 1){
				var This=this;
				this.time1=setTimeout(function(){
					if(This.oLogin){
						document.body.removeChild(This.oLogin);
					}
					if(This.settings.marK){
						document.body.removeChild(This.oMark);
					}
					This.json[This.settings.iNow] = true;
				},this.settings.time);
			}
		}
		if(this.settings.contentId!=""){
			clonefn(this.settings.contentId,this);
		}else{

		}
		var arrdom=document.getElementsByTagName("input");
		for(var i=0;i<arrdom.length;i++){
			if(arrdom[i].type != "button" && arrdom[i].type != "submit" && arrdom[i].type != "reset"){
				arrdom[i].onclick=function(){
					this.focus();
					console.log(this);
				}
			}
		}
		this.setData();
	}
	Dialog.prototype.setData = function () {
		setD(this);
	}
	function autoContent(_this){
		if(_this.settings.isbtn){
			getByClass(_this.oLogin,'alertLogContent')[0].style.height=(_this.settings.h-_this.settings.titH-_this.settings.dislocation-_this.settings.btnboxH)+'px';
		}else{
			getByClass(_this.oLogin,'alertLogContent')[0].style.height=(_this.settings.h-_this.settings.titH-_this.settings.dislocation)+'px';
		}
		getByClass(_this.oLogin,'alertLogContent')[0].style.overflow='auto';
		if(typeof _this.settings.w=='string'&&_this.settings.w.charAt(_this.settings.w.length - 1)  =='%'&&_this.settings.dir == 'center'){
			getByClass(_this.oLogin,'alertLogtxt')[0].style.width=parseInt(_this.settings.w)+10+'%';
		}else{
			getByClass(_this.oLogin,'alertLogtxt')[0].style.width=(_this.settings.w-30)+'px';
		}
	};
	Dialog.prototype.onsetData = function (_this) {
		setD(_this);
	}
	function setD(_this){
		if( typeof _this.settings.w=='string'&&_this.settings.w.charAt(_this.settings.w.length - 1)  =='%'&&_this.settings.dir == 'center'){
			_this.oLogin.style.width = _this.settings.w;
		}else{
			_this.oLogin.style.width = _this.settings.w + 'px';
		}
		_this.oLogin.style.height = _this.settings.h + 'px';
		autoContent(_this);
		var Mw=Math.floor((viewWidth() - _this.oLogin.offsetWidth) / 2);
		var Mh=Math.floor((viewHeight() - _this.oLogin.offsetHeight) / 2);
		var Vw=(viewWidth() - _this.oLogin.offsetWidth);
		var Vh=(viewHeight() - _this.oLogin.offsetHeight);
		if (_this.settings.dir == 'center') {
			if(typeof _this.settings.w=='string'&&_this.settings.w.charAt(_this.settings.w.length - 1)  =='%'){
				_this.oLogin.style.left = parseFloat((100-parseInt(_this.settings.w))/2).toFixed(2)+'%';
			}else{
				_this.oLogin.style.left = Mw + 'px';
			}
			_this.oLogin.style.top = Mh + 'px';
		} else if (_this.settings.dir == 'right-bottom') {
			_this.oLogin.style.left = Vw + 'px';
			_this.oLogin.style.top = Vh + 'px';
		}else if (_this.settings.dir == 'left-bottom') {
			_this.oLogin.style.left = (Vw-Vw) + 'px';
			_this.oLogin.style.top = Vh + 'px';
		}else if (_this.settings.dir == 'left-top') {
			_this.oLogin.style.left = (Vw-Vw) + 'px';
			_this.oLogin.style.top = (Vh-Vh) + 'px';
		}
		else if (_this.settings.dir == 'right-top') {
			_this.oLogin.style.left = Vw + 'px';
			_this.oLogin.style.top = (Vh-Vh) + 'px';
		}
		else if (_this.settings.dir == 'right') {
			_this.oLogin.style.left = Vw + 'px';
			_this.oLogin.style.top = Mh + 'px';
		}
		else if (_this.settings.dir == 'left') {
			_this.oLogin.style.left = (Vw-Vw) + 'px';
			_this.oLogin.style.top = Mh + 'px';
		}
		else if (_this.settings.dir == 'center-top') {
			_this.oLogin.style.left = Mw + 'px';
			_this.oLogin.style.top = (Vh-Vh) + 'px';
		}
		else if (_this.settings.dir == 'center-bottom') {
			_this.oLogin.style.left = Mw + 'px';
			_this.oLogin.style.top = Vh + 'px';
		}
	}
	Dialog.prototype.resize=function(fn){
		var _this=this;
		window.onresize=function(){
			fn(_this);
		}
	}
	Dialog.prototype.fnClose = function () {
		var This = this;
		if(this.settings.closebtn){
			var oClose = getByClass(this.oLogin,'alertLogClose')[0];
			oClose.onclick = function () {
				if(This.oLogin){
					document.body.removeChild(This.oLogin);
				}
				if (This.settings.marK) {
					document.body.removeChild(This.oMark);
				}
				clearTimeout(This.time1);
				This.json[This.settings.iNow] = true;
			}
		}else{

		}
		if(this.settings.alertlog==true&&this.settings.time==false){
			var markDom=document.getElementById('mark');
			if(markDom){
				markDom.onclick = function () {
					if(This.settings.markClick){
						if(This.oLogin){
							document.body.removeChild(This.oLogin);
						}
						if (This.settings.marK) {
							document.body.removeChild(This.oMark);
						}
						clearTimeout(This.time1);
						This.json[This.settings.iNow] = true;
					}
					else{
						
					}
				}
			}
		}
	}
	Dialog.prototype.close=function(){
		var This=this;
		if(This.oLogin){
			document.body.removeChild(This.oLogin);
		}
		if (This.settings.marK) {
			document.body.removeChild(This.oMark);
		}
		clearTimeout(This.time1);
		This.json[This.settings.iNow] = true;
	}
	Dialog.prototype.hide=function(_this){
		_this.style.display="none";
	}
	Dialog.prototype.show=function(_this){
		_this.style.display="block";
	}
	Dialog.prototype.createMark = function () {
		var oMark = document.createElement('div');
		oMark.style.width='100%';
		oMark.style.height='100%';
		oMark.style.position='absolute';
		oMark.style.top='0';
		oMark.style.left='0';
		oMark.style.zIndex=this.settings.zindex;
		oMark.style.backgroundColor='#000';
		oMark.style.filter = 'alpha(opacity='+(this.settings.marKop*100)+')';
		oMark.style.opacity = this.settings.marKop;
		if(document.getElementById(this.settings.oMarkId)){
			var lastid=this.settings.oMarkId;
			var numl=lastid.substr(-1,1);
			if(isNaN(numl)){
				this.settings.oMarkId=this.settings.oMarkId+'1';
			}else{
				this.settings.oMarkId=this.settings.oMarkId.substr(0,this.settings.oMarkId.length-1).toString()+(parseInt(numl)+1);
			}
		}
		oMark.id = this.settings.oMarkId;
		document.body.appendChild(oMark);
		this.oMark = oMark;
	}
	Dialog.prototype.animation = function () {
		var _this=this;
		var fx='';
		var tar='';
		if(this.settings.dir == 'center'){
			fx='opacity';
			this.oLogin.style.opacity=0.05;
			this.oLogin.style.filter = 'alpha(opacity=5)';
			tar=100;
		}
		else if(this.settings.dir=='left-bottom'){
			fx='left';
			tar=0;
			this.oLogin.style.left=-(this.oLogin.offsetWidth)+'px';
		}else if(this.settings.dir=='right-bottom'){
			document.body.style.overflow='hidden';
			this.oLogin.style.left='inherit';
			this.oLogin.style.right=-(this.oLogin.offsetWidth)+'px';
			fx='right';
			tar=0;
		}
		else if(this.settings.dir=='right-top' || this.settings.dir=='left-top'||this.settings.dir=='center-top'){
			fx='top';
			this.oLogin.style.top=-(this.oLogin.offsetHeight)+'px';
			tar=0;
		}
		else if(this.settings.dir=='left'||this.settings.dir=='right'){
			fx='top';
			this.oLogin.style.top=-(this.oLogin.offsetHeight)+'px';
			tar=Math.floor((viewHeight() - this.oLogin.offsetHeight) / 2);
		}
		else if(this.settings.dir=='center-bottom'){
			document.body.style.overflow='hidden';
			this.oLogin.style.top='auto';
			this.oLogin.style.bottom=-(this.oLogin.offsetHeight)+'px';
			fx='bottom';
			tar=0;
		}
		setTimeout(function(){
			startMove(_this.oLogin,fx,tar,function(){
				document.body.style.overflow='auto';
			});
		},this.settings.animationTime);
	}
	Dialog.prototype.dragDrop=function(){
		var dragbtn=getByClass(this.oLogin,'alertLogtxt')[0];
		var disX=0;
		var disY=0;
		var _this=this;
		dragbtn.onmousedown = function (ev) {
				var ev = ev || window.event;
				if (dragbtn.setCapture) {/*//全局捕获*/
					dragbtn.setCapture();
				}
				disX = ev.clientX - _this.oLogin.offsetLeft;
				disY = ev.clientY - _this.oLogin.offsetTop;
				document.onmousemove = function (ev) {
					var ev = ev || window.event;
					var L=ev.clientX - disX;
					var T=ev.clientY - disY;
					var xifu=_this.settings.adsorption;
					if(L<0||L<xifu){
						L=0;
					}else if(L>viewWidth()-_this.oLogin.offsetWidth||L>viewWidth()-_this.oLogin.offsetWidth-xifu){
						L=viewWidth()-_this.oLogin.offsetWidth;
					}
					if(T<0||T<xifu){
						T=0;
					}else if(T>viewHeight()-_this.oLogin.offsetHeight||T>viewHeight()-_this.oLogin.offsetHeight-xifu){
						T=viewHeight()-_this.oLogin.offsetHeight;
					}
					_this.oLogin.style.left = L + 'px';
					_this.oLogin.style.top = T + 'px';
				};
				document.onmouseup = function () {
					if (dragbtn.releaseCapture) { /*//释放全局捕获*/
						dragbtn.releaseCapture();
					}
					document.onmouseup = document.onmousemove = null;
				}
				return false;
			}
	}
	Dialog.prototype.dragDropSize=function(){
		var _this=this;
		var lk=5;
		this.oLogin.onmouseover=function(ev){
			var ev=ev||event;
			var disX=ev.clientX;
			var thL=this.offsetLeft;
			var thW=this.offsetWidth;
			var disY=ev.clientY;
			var thT=this.offsetTop;
			var thH=this.offsetHeight;

			if(disX>thL&&disX<thL+lk){
				_this.oLogin.style.cursor='w-resize';
			}
			if(disX>thL+thW-lk){
				_this.oLogin.style.cursor='w-resize';
			}
			if(disY>thT&&disY<thT+lk){
				_this.oLogin.style.cursor='s-resize';
			}
			if(disY>thT+thH-lk){
				_this.oLogin.style.cursor='s-resize';
			}
			if(disY>thT+thH-lk&&disX>thL+thW-lk){
				_this.oLogin.style.cursor='se-resize';
			}
			if(disY>thT&&disY<thT+lk&&disX>thL&&disX<thL+lk){
				_this.oLogin.style.cursor='se-resize';
			}
			if(disX>thL&&disX<thL+lk&&disY>thT+thH-lk){
				_this.oLogin.style.cursor='ne-resize';
			}
			document.onmouseout=function(){
				_this.oLogin.style.cursor='default';
			}
			return false;
		}
		this.oLogin.onmousedown=function(ev){
			var ev=ev||event;
			var disX=ev.clientX;
			var thL=this.offsetLeft;
			var thW=this.offsetWidth;
			var disY=ev.clientY;
			var thT=this.offsetTop;
			var thH=this.offsetHeight;
			if(disX>thL&&disX<thL+lk){
				_this.oLogin.style.cursor='w-resize';
				document.onmousemove=function(ev){
					var ev=ev||event;
					var edx=(ev.clientX-disX);
					_this.oLogin.style.width=thW-edx+'px';
					_this.oLogin.style.left=thL+edx+'px';
					_this.settings.w=thW-edx;
					getByClass(_this.oLogin,'alertLogtxt')[0].style.width=(_this.settings.w-30)+'px';
				};
			}
			if(disX>thL+thW-lk){
				_this.oLogin.style.cursor='w-resize';
				document.onmousemove=function(ev){
					var ev=ev||event;
					var edx=(ev.clientX-disX);
					_this.oLogin.style.width=thW+edx+'px';
					_this.settings.w=thW+edx;
					getByClass(_this.oLogin,'alertLogtxt')[0].style.width=(_this.settings.w-30)+'px';
				};
			}
			if(disY>thT&&disY<thT+lk){
				_this.oLogin.style.cursor='s-resize';
				document.onmousemove=function(ev){
					var ev=ev||event;
					var edy=(ev.clientY-disY);
					_this.oLogin.style.height=thH-edy+'px';
					_this.oLogin.style.top=thT+edy+'px';
					_this.settings.h=thH-edy;
					if(_this.settings.isbtn){
						getByClass(_this.oLogin,'alertLogContent')[0].style.height=(_this.settings.h-_this.settings.titH-_this.settings.dislocation-_this.settings.btnboxH)+'px';
					}else{
						getByClass(_this.oLogin,'alertLogContent')[0].style.height=(_this.settings.h-_this.settings.titH-_this.settings.dislocation)+'px';
					}
				};
			}
			if(disY>thT+thH-lk){
				_this.oLogin.style.cursor='s-resize';
				document.onmousemove=function(ev){
					var ev=ev||event;
					var edy=(ev.clientY-disY);
					_this.oLogin.style.height=thH+edy+'px';
					_this.settings.h=thH+edy;
					if(_this.settings.isbtn){
						getByClass(_this.oLogin,'alertLogContent')[0].style.height=(_this.settings.h-_this.settings.titH-_this.settings.dislocation-_this.settings.btnboxH)+'px';
					}else{
						getByClass(_this.oLogin,'alertLogContent')[0].style.height=(_this.settings.h-_this.settings.titH-_this.settings.dislocation)+'px';
					}
				};
			}
			if(disY>thT+thH-lk&&disX>thL+thW-lk){
				_this.oLogin.style.cursor='se-resize';
				document.onmousemove=function(ev){
					var ev=ev||event;
					var edy=(ev.clientY-disY);
					var edx=(ev.clientX-disX);
					_this.oLogin.style.width=thW+edx+'px';
					_this.settings.w=thW+edx;
					_this.oLogin.style.height=thH+edy+'px';
					_this.settings.h=thH+edy;
					if(_this.settings.isbtn){
						getByClass(_this.oLogin,'alertLogContent')[0].style.height=(_this.settings.h-_this.settings.titH-_this.settings.dislocation-_this.settings.btnboxH)+'px';
					}else{
						getByClass(_this.oLogin,'alertLogContent')[0].style.height=(_this.settings.h-_this.settings.titH-_this.settings.dislocation)+'px';
					}
					getByClass(_this.oLogin,'alertLogtxt')[0].style.width=(_this.settings.w-30)+'px';
				};
			}
			if(disY>thT&&disY<thT+lk&&disX>thL&&disX<thL+lk){
				_this.oLogin.style.cursor='se-resize';
				document.onmousemove=function(ev){
					var ev=ev||event;
					var edy=(ev.clientY-disY);
					var edx=(ev.clientX-disX);
					_this.oLogin.style.width=thW-edx+'px';
					_this.oLogin.style.left=thL+edx+'px';
					_this.settings.w=thW-edx;
					_this.oLogin.style.height=thH-edy+'px';
					_this.oLogin.style.top=thT+edy+'px';
					_this.settings.h=thH-edy;
					if(_this.settings.isbtn){
						getByClass(_this.oLogin,'alertLogContent')[0].style.height=(_this.settings.h-_this.settings.titH-_this.settings.dislocation-_this.settings.btnboxH)+'px';
					}else{
						getByClass(_this.oLogin,'alertLogContent')[0].style.height=(_this.settings.h-_this.settings.titH-_this.settings.dislocation)+'px';
					}
					getByClass(_this.oLogin,'alertLogtxt')[0].style.width=(_this.settings.w-30)+'px';
				};
			}
			if(disX>thL&&disX<thL+lk&&disY>thT+thH-lk){
				_this.oLogin.style.cursor='ne-resize';
				document.onmousemove=function(ev){
					var ev=ev||event;
					var edy=(ev.clientY-disY);
					var edx=(ev.clientX-disX);
					_this.oLogin.style.height=thH+edy+'px';
					_this.settings.h=thH+edy;
					_this.oLogin.style.width=thW-edx+'px';
					_this.oLogin.style.left=thL+edx+'px';
					_this.settings.w=thW-edx;
					if(_this.settings.isbtn){
						getByClass(_this.oLogin,'alertLogContent')[0].style.height=(_this.settings.h-_this.settings.titH-_this.settings.dislocation-_this.settings.btnboxH)+'px';
					}else{
						getByClass(_this.oLogin,'alertLogContent')[0].style.height=(_this.settings.h-_this.settings.dislocation-_this.settings.titH)+'px';
					}
					getByClass(_this.oLogin,'alertLogtxt')[0].style.width=(_this.settings.w-30)+'px';
				};
			}
			document.onmouseup=function(){
				_this.oLogin.style.cursor='default';
				document.onmousemove=document.onmouseup=null;
			};
			return false;
		}
	}
	function extend(obj1, obj2) {
		for (var attr in obj2) {
			obj1[attr] = obj2[attr];
		}
	}
	function viewWidth() {
		return document.documentElement.clientWidth;
	}
	function viewHeight() {
		return document.documentElement.clientHeight;
	}
	function startMove(obj, attr, iTarget, fn) {
		clearInterval(obj.timer);
		obj.timer = setInterval(function () {
			var iCur = 0;
			if (attr == 'opacity') {
				iCur = parseFloat(getStyle(obj, attr)) * 100;
			} else {
				iCur = parseInt(getStyle(obj, attr));
			}
			var iSpeed = (iTarget - iCur) / 8;
			iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
			if (iCur == iTarget) {
				clearInterval(obj.timer);
				fn && fn();
			} else {
				if (attr == 'opacity') {
					obj.style.filter = 'alpha(opacity=' + (iCur + iSpeed) + ')';
					obj.style[attr] = (iCur + iSpeed) / 100;
				}
				obj.style[attr] = iCur + iSpeed + 'px';
			}
		}, 30);
	};
	function getStyle(obj, attr) {
		return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, false)[attr];
	};
	function getByClass(oParent,sClass){
		var aEle=oParent.getElementsByTagName('*');
		var aResult=[];
		for(var i=0;i<aEle.length;i++){
			if(aEle[i].className==sClass){
				aResult.push(aEle[i]);
			}
		}
		return aResult;
	}
	function isIE () {
	  var myNav = navigator.userAgent.toLowerCase();
	  return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
	}
	var skinColor=[          //风格颜色数组
				{
					bg:'#f7f7f7',   //box背景颜色
					borderColor:'#95B8E7', //描边的颜色
					titBg:'#edf4ff',//标题背景颜色
					titColor:'#0E2D5F',//标题文字的颜色
					btnBg:'#fff',  //bottom按钮背景颜色
					btnBorderColor:'#777',//bottom按钮描边颜色
					btnColor:'#000',//bottom按钮文字颜色
					bottomBg:'#edf4ff',//bottom背景颜色
					closeBg:'red',  //右上角按钮的背景颜色
					closeColor:'#fff'  //右上角按钮文字颜色
				},{
					bg:'#f7f7f7',   //box背景颜色
					borderColor:'#ccc', //描边的颜色
					titBg:'#91b4e5',//标题背景颜色
					titColor:'#fff',//标题文字的颜色
					btnBg:'#91b4e5',  //bottom按钮背景颜色
					btnBorderColor:'#91b4e5',//bottom按钮描边颜色
					btnColor:'#fff',//bottom按钮文字颜色
					bottomBg:'#fff',//bottom背景颜色
					closeBg:'#fff',  //右上角按钮的背景颜色
					closeColor:'#91b4e5'  //右上角按钮文字颜色
				},{
					bg:'#f7f7f7',   //box背景颜色
					borderColor:'#ccc', //描边的颜色
					titBg:'red',//标题背景颜色
					titColor:'#fff',//标题文字的颜色
					btnBg:'red',  //bottom按钮背景颜色
					btnBorderColor:'red',//bottom按钮描边颜色
					btnColor:'#fff',//bottom按钮文字颜色
					bottomBg:'#fff',//bottom背景颜色
					closeBg:'#fff',  //右上角按钮的背景颜色
					closeColor:'red'  //右上角按钮文字颜色
				},{
					bg:'#f7f7f7',   //box背景颜色
					borderColor:'#ccc', //描边的颜色
					titBg:'yellow',//标题背景颜色
					titColor:'#000',//标题文字的颜色
					btnBg:'yellow',  //bottom按钮背景颜色
					btnBorderColor:'yellow',//bottom按钮描边颜色
					btnColor:'#000',//bottom按钮文字颜色
					bottomBg:'#fff',//bottom背景颜色
					closeBg:'#000',  //右上角按钮的背景颜色
					closeColor:'yellow'  //右上角按钮文字颜色
				},{
					bg:'#f7f7f7',   //box背景颜色
					borderColor:'#ccc', //描边的颜色
					titBg:'blue',//标题背景颜色
					titColor:'#fff',//标题文字的颜色
					btnBg:'blue',  //bottom按钮背景颜色
					btnBorderColor:'blue',//bottom按钮描边颜色
					btnColor:'#fff',//bottom按钮文字颜色
					bottomBg:'#fff',//bottom背景颜色
					closeBg:'#fff',  //右上角按钮的背景颜色
					closeColor:'blue'  //右上角按钮文字颜色
				},{
					bg:'#f7f7f7',   //box背景颜色
					borderColor:'#ccc', //描边的颜色
					titBg:'green',//标题背景颜色
					titColor:'#fff',//标题文字的颜色
					btnBg:'green',  //bottom按钮背景颜色
					btnBorderColor:'green',//bottom按钮描边颜色
					btnColor:'#fff',//bottom按钮文字颜色
					bottomBg:'#fff',//bottom背景颜色
					closeBg:'#fff',  //右上角按钮的背景颜色
					closeColor:'green'  //右上角按钮文字颜色
				},{
					bg:'#f7f7f7',   //box背景颜色
					borderColor:'#ccc', //描边的颜色
					titBg:'#431e5f',//标题背景颜色
					titColor:'#fff',//标题文字的颜色
					btnBg:'#431e5f',  //bottom按钮背景颜色
					btnBorderColor:'#431e5f',//bottom按钮描边颜色
					btnColor:'#fff',//bottom按钮文字颜色
					bottomBg:'#fff',//bottom背景颜色
					closeBg:'#fff',  //右上角按钮的背景颜色
					closeColor:'#431e5f'  //右上角按钮文字颜色
				},{
					bg:'#f7f7f7',   //box背景颜色
					borderColor:'#ccc', //描边的颜色
					titBg:'#cea527',//标题背景颜色
					titColor:'#fff',//标题文字的颜色
					btnBg:'#cea527',  //bottom按钮背景颜色
					btnBorderColor:'#cea527',//bottom按钮描边颜色
					btnColor:'#fff',//bottom按钮文字颜色
					bottomBg:'#fff',//bottom背景颜色
					closeBg:'#fff',  //右上角按钮的背景颜色
					closeColor:'#cea527'  //右上角按钮文字颜色
				},{
					bg:'#f7f7f7',   //box背景颜色
					borderColor:'#ccc', //描边的颜色
					titBg:'#d735e6',//标题背景颜色
					titColor:'#fff',//标题文字的颜色
					btnBg:'#d735e6',  //bottom按钮背景颜色
					btnBorderColor:'#d735e6',//bottom按钮描边颜色
					btnColor:'#fff',//bottom按钮文字颜色
					bottomBg:'#fff',//bottom背景颜色
					closeBg:'#fff',  //右上角按钮的背景颜色
					closeColor:'#d735e6'  //右上角按钮文字颜色
				},{
					bg:'#f7f7f7',   //box背景颜色
					borderColor:'#ccc', //描边的颜色
					titBg:'#ef7007',//标题背景颜色
					titColor:'#fff',//标题文字的颜色
					btnBg:'#ef7007',  //bottom按钮背景颜色
					btnBorderColor:'#ef7007',//bottom按钮描边颜色
					btnColor:'#fff',//bottom按钮文字颜色
					bottomBg:'#fff',//bottom背景颜色
					closeBg:'#fff',  //右上角按钮的背景颜色
					closeColor:'#ef7007'  //右上角按钮文字颜色
				}
			];
	window.Dialog=Dialog;
})();