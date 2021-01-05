/*
 * IE Alert! jQuery plugin
 * version 1
 * author: David Nemes http://nmsdvid.com
 * http://nmsdvid.com/iealert/
 */

(function($){
$("#goon").on("click", function(){
		$("#ie-alert-overlay").hide();	
		$("#ie-alert-panel").hide();						  
});
function initialize($obj, support, title, text){
		
		var panel = "<span>"+ title +"</span>"
				  + "<p> "+ text +"</p>"
			      + "<div class='browser'>"
			      + "<ul>"
			      + "<li><a class='firefox' href='http://www.firefox.com.cn/' target='_blank'></a></li>"
			      + "<li><a class='safari' href='https://www.apple.com/cn/safari/' target='_blank'></a></li>"
			      + "<li><a class='opera' href='https://www.opera.com/zh-cn' target='_blank'></a></li>"
				  + "<li><a class='chrome' href='http://xiazai.sogou.com/detail/34/8/6262355089742005676.html?uID=oBTOl-aWQ8C1bEkT&w=2295' target='_blank'></a></li>"
			      + "<ul>"
			      + "</div>"; 

		var overlay = $("<div id='ie-alert-overlay'></div>");
		var iepanel = $("<div id='ie-alert-panel'>"+ panel +"</div>");

		var docHeight = $(document).height();

		overlay.css("height", docHeight + "px");
	
		$obj.prepend(iepanel);
		$obj.prepend(overlay);
		
	
		$("#ie-alert-panel").css("background-position","-626px -116px");
		$obj.css("margin","0");
}; //end initialize function


	$.fn.iealert = function(options){
		var defaults = { 
			support: "ie8",  // ie8 (ie6,ie7,ie8), ie7 (ie6,ie7), ie6 (ie6)
			title: "\u4F60\u77E5\u9053\u4F60\u7684Internet Explorer\u662F\u8FC7\u65F6\u4E86\u5417?", // title text
			text: "\u4E3A\u4E86\u5F97\u5230\u6211\u4EEC\u7F51\u7AD9\u6700\u597D\u7684\u4F53\u9A8C\u6548\u679C,\u6211\u4EEC\u5EFA\u8BAE\u60A8\u5347\u7EA7\u5230\u6700\u65B0\u7248\u672C\u7684Internet Explorer\u6216\u9009\u62E9\u53E6\u4E00\u4E2Aweb\u6D4F\u89C8\u5668.\u4E00\u4E2A\u5217\u8868\u6700\u6D41\u884C\u7684web\u6D4F\u89C8\u5668\u5728\u4E0B\u9762\u53EF\u4EE5\u627E\u5230.<br /><span style='color:#F53536;    display:inline;font-size:14px;'>\u82e5\u4f7f\u7528\u641c\u72d7\u6d4f\u89c8\u5668\u6216\u8005\u0033\u0036\u0030\u6d4f\u89c8\u5668\u7684\u7528\u6237\u5efa\u8bae\u5207\u6362\u9ad8\u901f\u6a21\u5f0f.</span><br /><!--<h1 id='goon' style='font-size:20px;cursor:pointer;'>>>>\u7EE7\u7EED\u8BBF\u95EE</h1>-->"
		};
		
		
		var option = $.extend(defaults, options);

		
		

			return this.each(function(){
				
					var $this = $(this);  
					initialize($this, option.support, option.title, option.text);
				
			});		       
	
	};
})(jQuery);
