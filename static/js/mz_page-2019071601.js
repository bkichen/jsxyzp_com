var isie = 0;
$(function(){
	var Sys = {};
	var ua = navigator.userAgent.toLowerCase();
	var s;
	(s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
	(s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
	(s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
	(s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
	(s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
	(s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
	if (Sys.ie){
		if(Sys.ie<10.0){
			isie = 1;
		}
	}
	$('body').click(function(){
		parent.$("#ks-suggest-container").removeClass('show');
	});
	var rightType = $('#rightType').val();
	//禁止用F5键   
	document.onkeydown = function(e){  
		e = window.event || e;  
		var keycode = e.keyCode || e.which;  
		if(keycode == 116){  
			if(window.event){// ie  
				try{e.keyCode = 0;}catch(e){}  
				e.returnValue = false;  
			}else{// firefox  
				e.preventDefault();  
			}  
		}  
	};
	
	$.ajax({
		type:"post",
		url:"webim_api/ibot/getHotQuestion",
		data:{
			//'sessionId':'a123',
			'userId':localStorage.getItem('focu_openId'),
			'platform':'zpmh',
			'question':''
		},
		dataType:"json",
		error:function(){  
      	alert("服务器异常!请稍候再试");
      },
      success:function(data){
		  //console.log(data);
      	if (data.code!=1||typeof(data)=="undefined") {
      		alert("当前还没有数据");
      	} else{
			var newData = '';
			if(rightType == 'IT'){//IT
				newData = data.data[0];
			}else if(rightType == 'HR'){//HR
				newData = data.data[1];
			}else if(rightType == 'ZP'){//ZP
				newData = data.data[2];
			}else if(rightType == 'XZ'){//XZ
				newData = data.data[0];
			}
			console.log(newData);
		
			// if(newData.list.length > 6){//左右展示
				// $('.content').prepend('<div class="list_box"><div class="nav1"><span class="nav1_icon"></span><p>'+ newData.title +'</p></div><ul></ul></div>');
				// var left_data = newData.list.slice(0,6);
				// for ( var i = 0; i <left_data.length; i++){	
					// var nav2 = $("<li>",{"title":left_data[i],"class":"nav2"}).text(left_data[i]);										
					// $(".list_box ul").append(nav2);			
				// }
				
				// var right_data  =newData.list.slice(6,newData.list.length);
				// $('.content').append('<div class="list_box list_box_r"><div class="nav1"><span class="nav1_icon"></span><p>'+ newData.title +'</p></div><ul></ul></div>');
				// for ( var i = 0; i <right_data.length; i++){	
					// var nav2 = $("<li>",{"title":right_data[i],"class":"nav2"}).text(right_data[i]);										
					// $(".list_box_r ul").append(nav2);			
				// }
			// }else{//左侧展示
				$('.content').prepend('<div class="list_box"><div class="nav1"><span class="nav1_icon"></span></div><ul></ul></div>');
				for ( var i = 0; i <newData.list.length; i++){	
					var nav2 = $("<li>",{"title":newData.list[i],"class":"nav2"}).html('<span>'+ (i+1)+'.</span>'+newData.list[i]);
					$(".list_box ul").append(nav2);			
				}
			//}
      	}
      }
	});
});

//发送当前文字
$('.content').on('click','.list_box li',function(){
	var tit = $(this).attr('title');//当前选中且需要发送给服务端的文字
	window.parent.sendMsg(tit);
	if(isie == 1){
		$("#form-box" , parent.document).focus();
	}
})

//显示浮框菜单列表信息
function showAnswer(txt,obj){
	$.ajax({
		type:"post",
		url:"webim_api/ibot/getHotQuestion",
		data:{
			//'sessionId':'a123',
			'userId':localStorage.getItem('focu_openId'),
			'platform':'web',
			'question':txt
		},
		dataType:"json",
		error:function(a,datastatus){   
        	alert("请求失败"+datastatus);
        },
        success:function(data2){  
			//console.log(data2);	        	      	
        	if (data2.code!=1||typeof(data2)=="undefined"){
        		alert("当前还没有数据");
        	}else{	       	
        		$(".nav3Box").html("");  
        		var nav3 = "";
				$.each(data2.data, function(i,cont2) {		
					nav3 += '<p class="nav3" title="'+cont2.question+'"><span class="count">'+cont2.question+'('+cont2.hits+'人使用)</span></p>';
				});
				
				$(".nav3Box").append(nav3);
				
				$(".nav3Box .nav3").unbind("click").bind("click",function(){ 
					var tit = this.title;//当前选中且需要发送给服务端的文字
					window.parent.sendMsg(tit);
				});  	
				
				setPosition(obj);	 	
				if($(".nav3Box").is(":visible")){
					setTimeout(function () {
						$(".nav3Box").css("display","none");
					}, 30000);  
				}
        	}	
		}        
	});	
}

//浮框菜单定位方法
function setPosition(obj){	
	var nav3Box = $(".nav3Box");
	var content = $(".content");   //left:24	top:0
	
	var x = obj.offset().left +  obj.width() - 30 ;    //25 使nav3box更靠近二级目录文字
	var y =  obj.offset().top  ; 
	
	var obj2Width = nav3Box.width()+2;   //3级框宽度  2是边框两个
	var obj2Height = nav3Box.height()+2;   //3级框高度
	
	var jiao = $("<span>",{"class":"jiao"});  
	
	if( (x+obj2Width)< $(".content_box").width() ){  
		$(".nav3Box").find(".jiao").remove();
		$(".nav3Box").find("p:first-child").append(jiao);
		nav3Box.css({"left":x+"px"});
		nav3Box.find(".jiao").css("left","-7px").removeClass("jiao_show_right");
	}else{ 
		$(".nav3Box").find(".jiao").remove();
		$(".nav3Box").find("p:first-child").append(jiao);
		nav3Box.css({"left": (obj.offset().left - obj2Width - content.offset().left)+"px"}); 
		nav3Box.find(".jiao").css("right","-7px").addClass("jiao_show_right");
	}
			
	if( (y+obj2Height)> $(window.top.document).find("#tab_banner").height()  ){  

		$(".nav3Box").find(".jiao").remove();
		$(".nav3Box").find("p:last-child").append(jiao);
		nav3Box.css({"top":(y-obj2Height+35)+"px"}); 
		nav3Box.find(".jiao").css("bottom","9px");
	}else{ 
		
		nav3Box.css({"top":y+"px"});
		nav3Box.find(".jiao").css("top","9px");
	}	
	
	nav3Box.css("display","block");
	nav3Box.bind("mouseleave" ,function(){
		$(this).css("display","none");
	});
}



