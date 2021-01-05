//var tit=$(window.frames["content"].document).find("title").html();
//$("footer.foot1",window.parent.document
//document.write("<script src='index_websocket.js.js'></script>");
//
//window.parent.webFunc;

var $ks_suggest_container = $('#ks-suggest-container');
var lastTime;
/* 适应窗口插件 */
function adaptive(bgDiv, data) {
	this.$bgDiv = bgDiv;
	this.$win_height = $(window.parent.document).height();
	this.$win_width = $(window.parent.document).width();
	this.$hnum = data.lessHeight || 0;
	this.$wnum = data.lessWidth || 0;
	if (this.$wnum == 0) {
		this.$bgDiv.css({
			"height" : (this.$win_height - this.$hnum) + "px"
		});
	} else {
		this.$bgDiv.css({
			"height" : (this.$win_height - this.$hnum) + "px",
			"width" : (this.$win_width - this.$wnum) + "px"
		});
	}
	$(window.parent.document).resize(function() {
		this.$bgDiv = bgDiv;
		this.$win_height = $(window.parent.document).height();
		this.$win_width = $(window.parent.document).width();
		this.$hnum = data.lessHeight || 0;
		this.$wnum = data.lessWidth || 0;
		if (this.$wnum == 0) {
			this.$bgDiv.css({
				"height" : (this.$win_height - this.$hnum) + "px"
			});
		} else {
			this.$bgDiv.css({
				"height" : (this.$win_height - this.$hnum) + "px",
				"width" : (this.$win_width - this.$wnum) + "px"
			});
		}
	})
}
// 使用
// $.adaptiveWH($('.manual-content'),{lessHeight:61});

jQuery.extend({
	adaptiveWH : function(bgDiv, data) {
		return new adaptive(bgDiv, data);
	}
});

// 获取默认表情(标准)
GetDefaultExp();
function GetDefaultExp() {
	// showCode 表情编码
	// showImg 表情图片路径
	// showMsg 表情中文描述
	ajaxExpJsona(1, function(icons) {
		// console.log("默认表情:",icons);
		var ExpJson = icons;
		var showCode = [], showImg = [], showMsg = [];
		if (ExpJson.elfcodeStr != '' || ExpJson.elfcodeStr != null) {
			// console.log('表情包',ExpJson.elfData);
			var expUl = $("<ul>", {
				"class" : "expUl clearfix"
			});
			var li;
			// 把json数据按"|"分割
			showCode = ExpJson.elfcodeStr.split("|");
			showImg = ExpJson.showImg.split("|");
			showMsg = ExpJson.showMsg.split("|");
			// 遍历分割后的数组生成dom
			$.each(showCode, function(index, value) {
				// li =`<li title="${showMsg[index]}" data-code="${value}"><img
				// src="./images/PNG/${showImg[index]}"/></li>`;//es6模板称号
				li = '<li title="' + showMsg[index] + '" data-code="' + value + '"><img src="./upload/ExpImages/' + showImg[index] + '"/></li>';
				expUl.append(li);
			});

			$('#standard_exp').append(expUl);
		}
	});
}

// 获取自定义表情
function GetCustomExp() {
	// showCode 表情编码
	// showImg 表情图片路径
	// showMsg 表情中文描述
	ajaxExpJsona(2, function(icons) {
		var ExpJson = icons;
		var showCode = [], showImg = [], showMsg = [];
		if (ExpJson.elfcodeStr != '' || ExpJson.elfcodeStr != null) {
			// console.log('表情包',ExpJson.elfData);
			var expUl = $("<ul>", {
				"class" : "expUl clearfix"
			});
			var li;
			// 把json数据按"|"分割
			showCode = ExpJson.elfcodeStr.split("|");
			showImg = ExpJson.showImg.split("|");
			showMsg = ExpJson.showMsg.split("|");
			// 遍历分割后的数组生成dom
			$.each(showCode, function(index, value) {
				// li =`<li title="${showMsg[index]}" data-code="${value}"><img
				// src="./images/PNG/${showImg[index]}"/></li>`;//es6模板称号
				li = '<li title="' + showMsg[index] + '" data-code="' + value + '"><img src="./upload/ExpImages/' + showImg[index] + '"/></li>';
				expUl.append(li);
			});
			$('#custom_exp').empty();
			$('#custom_exp').append(expUl);
		}
	});
}

/* 表情点击事件 */
var kg = 1;
var srTarget;
$("#expression").click(function(e) {
	e = e||window.event;
	$('#selectOp').addClass('hide');
	if (kg == 1) {
		$('.exp_box').show();
		srTarget = e.target;
		kg = 0;
	} else {
		$('.exp_box').hide();
		kg = 1;
	}
});
$(document).on('click', ':not(#expression,.custom,.standard)', function(e) {
	e = e||window.event;
	if (e.target !== srTarget) {
		$('.exp_box').hide();
		kg = 1;
		return;
	}
});
$('.exp_wrap').click(function(e) {
	e = e||window.event;
	e.stopPropagation();
})
// 标准表情自定义表情切换
$('.custom').click(function() {
	// GetCustomExp();
	$(this).addClass('exp_checked').siblings('span').removeClass('exp_checked');
	$('#standard_exp').addClass('hidden');
	$('#custom_exp').removeClass('hidden');
	if (!$('#custom_exp').html()) {
		GetCustomExp();
	}
	if(myBrowser() == 'FF'){
		$('.expUl li').css({'margin':'4px 9px'});
		$('#custom_exp li').css({'width':'36px'});
	}
});
$('.standard').click(function() {
	$(this).addClass('exp_checked').siblings('span').removeClass('exp_checked');
	$('#custom_exp').addClass('hidden');
	$('#standard_exp').removeClass('hidden');
});
/* 把表情code添加到input */
$(".exp_wrap").on('click', 'li', function(e) {
	e = e||window.event;
	e.stopPropagation();
	var dataCode = $(this).attr("data-code");
	var val = $(".form-control").val();
	$(".form-control").val(val + dataCode).focus();
	$('.exp_box').hide();
	kg = 1;
});
/* 图片上传弹出 */
$("#updatet").click(function() {
	$('#selectOp').addClass('hide');
	var key1 = $("#key").val();
	if (key1) {
		$(".zzt").fadeIn();
		$("#key").val("0");
		// $(this).css({
		// "background-color" : "rgb(221, 221, 221)"
		// });
	} else {
		$(".zzt").fadeOut();
		$("#key").val("1");
		// $(this).css({
		// "background-color" : "#eee"
		// });
	}

})
function IsPC() {
	var userAgentInfo = navigator.userAgent;
	var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
	var flag = true;
	for (var v = 0; v < Agents.length; v++) {
		if (userAgentInfo.indexOf(Agents[v]) > 0) {
			flag = false;
			break;
		}
	}
	return flag;
}
/* 点击发送 */
$("#send .btn").click(function() {
	sendMsg();
	$ks_suggest_container.removeClass('show');//隐藏提示框
	$('.form-box_focus').focus();
});

/***ctrl + enter换行****/
function getCaret(el) {
	if (el.selectionStart) {
		return el.selectionStart;
	}else if (document.selection) {
			el.focus();
			var r = document.selection.createRange();
		if (r == null) {
			return 0;
		}
		var re = el.createTextRange(),
		rc = re.duplicate();
		re.moveToBookmark(r.getBookmark());
		rc.setEndPoint('EndToStart', re);
		return rc.text.length;
	}  
	return 0;
}
//换行的同时 设置相应位置的光标
function set_text_value_position(obj, spos){
    var tobj = document.getElementById(obj);
    if(spos<0)
            spos = tobj.value.length;
    if(tobj.setSelectionRange){ //兼容火狐,谷歌
            setTimeout(function(){
                tobj.setSelectionRange(spos, spos);
                tobj.focus();}
                ,0);
    }else if(tobj.createTextRange){ //兼容IE
            var rng = tobj.createTextRange();
            rng.move('character', spos);
            rng.select();
    }
}



		

$("#form-box").keydown(function(e) {
	var e = e || event;
	var keycode = e.keyCode || e.which;
	if (e.keyCode == 13) {
		e.preventDefault();// 不换行
		sendMsg();
		$("#form-box").val("");
		$ks_suggest_container.removeClass('show');
		return false; // 截取返回false就不会保存网页了
	}
});

/* 将一个符合URL格式的字符串变成链接 */
function replaceURLWithHTMLLinks(text) {
		text = " "+text;
	var exp = /[^"|]((https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
	return text.replace(exp, "<a style='display:inline' href='$1'>$1</a>");
}

//获取时间（时分）
function getTimeHMS() {
	var now = new Date();
	var h = now.getHours();// 得到小时
	if (h < 10)
		h = "0" + h;
	var m = now.getMinutes();// 得到分钟
	if (m < 10)
		m = "0" + m;
	var s = now.getSeconds();// 得到秒数
	if (s < 10)
		s = "0" + s;
	return h + ":" + m + ":" + s;
}


//服务端静态推送的内容
function serverMsg(){
	var html = '';
	html += '<li class="lim_operator clearfix">';
	html += '	<div class="lim_bubble">';
	html += '		<div class="lim_time show_left">'+ getTimeHMS() +'</div>';
	html += '		<div class="lim_dot ">';
	html += '			<div class="robotinfo">';
	html += '			您好，人工客服的服务时间为周一至周日 7:30-24:00，请您在客服服务时间咨询或点击<a href ="javascript:;" onclick="popLeave();">留言</a>，感谢您对魅族的理解与支持！';
	html += '			</div>';
	html += '		</div>';
	html += '	</div>';
	html += '	<div class="lim_tale">';
	html += '		<img src="./images/mz/op_h.png">';
	html += '		<div id="radiusborder"></div>';
	html += '		<p class="call_me" title=""></p>';
	html += '	</div>';
	html += '</li>';
	$(".container ul").append(html);
}


// 发送信息给服务端()
function sendMsg(text) {
	if (websocket.readyState != 1) {
		console.log("会话结束，重新登录！");
		clfn();
	}

	/* 传入参数 实现自动发送指定信息 */
	if (text) {
		$(".form-control").val(text);
	}

	kg = 1;

	// 输入的原始内容表情未转化
	var val = $(".form-control").val();
	var content = val;
	val = val.replace(/\n/g, "<br/>");
	if (val == "") {
		// showLog('内容不能为空');
		$(".form-control").focus();
	} else {
		if ($('.jiaz').text() == "暂无数据") {
			$('.jiaz').hide();
		}
		// var myDate = new Date().getTime();
		// var mytime = getTimes(myDate);

		// 发出信息的 时分秒
		/**var d = new Date();
		var my_hours = d.getHours();
		var my_minutes = d.getMinutes();
		var my_seconds = d.getSeconds();
		var mytime = my_hours + ":" + my_minutes + ":" + my_seconds;**/
		var regg = /([0-9]{1,2}:[0-9]{1,2})?(:[0-5]{0,1}[0-9]{1})/ig;
		var mytime = getTimes(parseInt(new Date().getTime()) + timeDiffccs).match(regg).join('');
		var timestamp = Date.parse(new Date());
		// 已把表情code转化
		var cnt;

		var regreg = new RegExp("(\\(|\\)|\\[|\\]|\\*|\\?|\\+|\\$|\\/)", "g");
		var sessionExp = JSON.parse(sessionStorage.getItem('expjson'));
		if (sessionExp == null) {
			ajaxExpJsona([ 1, 2 ], function(icons) {
				var tStr_new = "(" + icons.elfcodeStr.replace(regreg, "\\$1") + ")";
				tStr_new.replace(new RegExp("\\/", "g"), "\\/");
				var regx_new = new RegExp(tStr_new, "g");
				cnt = val.replace(regx_new, function(word) {
					return '<img src="' + icons.faceMap[word] + '" style="max-width:80px;max-height:80px;"/>';
				});
				sessionStorage.setItem("expjson", JSON.stringify(icons));
			});
		} else {
			var tStr = "(" + sessionExp.elfcodeStr.replace(regreg, "\\$1") + ")";
			tStr.replace(new RegExp("\\/", "g"), "\\/");
			var regx = new RegExp(tStr, "g");
			cnt = val.replace(regx, function(word) {
				return '<img src="' + sessionExp.faceMap[word] + '" style="max-width:80px;max-height:80px;"/>';
			});
		}

		// 将文本里面的超链接改为新窗口打开
		cnt = replaceURLWithHTMLLinks(cnt);
		var reg = new RegExp('(<a)(\\s)(.*?</a>)', 'gmi');
		cnt = cnt.replace(reg, '$1 target="_blank" $3');
		var $content = $(".container ul");
		var html = "";

		html += '<li class="lim_visitor clearfix">';
		html += '	<div class="lim_bubble">';
		html += '		<div class="lim_time show_right">' + mytime + '</div>';
		html += '		<div class="lim_dot ">' + cnt + '</div>';
		html += '	</div>';
		html += '	<div class="lim_tale user_img">';
		html += '		<div id="radiusborder"></div>';
		html += '		<p class="call_me" title="我">我</p>';
		html += '	</div>';
		html += '</li>';

		$content.append(html);
		$(".container").scrollTop($(".container")[0].scrollHeight);
		
		var myydate = new Date().getDay();//获取当前星期X(0-6,0代表星期天)
		//周一至周日 07:30-24:00
		if(cnt == '芝麻开门' && myydate <= 6 && getTimeHMS() < '07:30:00'){
			serverMsg();
			$(".form-control").val("");
			$(".container").scrollTop($(".container")[0].scrollHeight);
			return;
		}
		
		// var openId="oiACnjrKTKt60AdalrrNqoQz7Hac";
		// var openId=getQueryString("openId");
		var openId = window.localStorage.getItem("focu_openId");

		// var pwd="123456";
		var pwd = getQueryString("pwd");
		var username = getQueryString("username");
		var openUn = getQueryString("openUn") || "";
		var originId = getQueryString("originId") || "";
		var msgId = getQueryString("msgId") || "";
		var request = JSON.stringify({
			"method" : "IM_CCS_SendMsg",
			"openId" : openId,
			"uuid" : guid(),
			"msgId" : msgId,
			"msgType" : "text",
			"content" : content,
			"cTime" : timestamp
		});
		if (websocket.readyState == 1) {
			websocket.send(request);
		} else {
			//localStorage.setItem("sendMsg" + openId, request);
			alert('网络重连中,消息发送失败！',content);
		}
		$(".form-control").val("");
		console.log('发送的信息',cnt);
		console.log(typeof cnt);
	}
}

function getTimes(nS) {
	var date = new Date(parseInt(nS));
	var year = date.getFullYear();
	var mon = date.getMonth() + 1;
	if (mon < 10) {
		mon = "0" + mon;
	}
	var day = date.getDate();
	if (day < 10) {
		day = "0" + day;
	}
	var hours = date.getHours();
	if (hours < 10) {
		hours = "0" + hours;
	}
	var minu = date.getMinutes();
	if (minu < 10) {
		minu = "0" + minu;
	}
	var sec = date.getSeconds();
	if (sec < 10) {
		sec = "0" + sec;
	}

	return year + '-' + mon + '-' + day + ' ' + hours + ':' + minu + ':' + sec;
}
function guid() {
	function S4() {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	}
	return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
}

var savedPictureContent;
/** 截屏按钮弹出框* */
function ShowScreenshots(content) {
	// console.log("---------jq-----",content);
	savedPictureContent = content;
	$("#jqimgPreview").attr("src", "data:image/png;base64," + content);
	var key1 = $("#key").val();
	if (key1) {
		$(".jqt").fadeIn();

		$("#jqsubmitimg").removeAttr("disabled");
		$("#key").val("0");
		$(this).css({
			"background-color" : "rgb(221, 221, 221)"
		});
	} else {
		$(".jqt").fadeOut();
		$("#jqsubmitimg").removeAttr("disabled");
		$("#key").val("1");
		$(this).css({
			"background-color" : "#eee"
		});
	}
}
/* 截屏按钮弹出框关闭 */
$(".jqt,#jqclosebtn").click(function(e) {
	e.stopPropagation();
	$(".jqt").fadeOut();
	$("#speak").contents().find("#updatet").css({
		"background-color" : "#eee"
	});
	$("#speak").contents().find("#key").val("0");
	$('#jqimgPreview').show();
})

/** 截屏图片弹窗点击上传图片* */
$("#jqsubmitimg").click(function() {
	// console.log("------tp--------", savedPictureContent);
	//var myDate = new Date().getTime();
	//var mytime = getTimes(myDate);
	var regg = /([0-9]{1,2}:[0-9]{1,2})?(:[0-5]{0,1}[0-9]{1})/ig;
	var mytime = getTimes(parseInt(new Date().getTime()) + timeDiffccs).match(regg).join('');
	var timestamp = Date.parse(new Date());
	var workno = getQueryString("workno");// 坐席工号
	var originId = getQueryString("originId") || '';
	var agentId = getQueryString("agentId");
	// $('#agentId1',window.parent.document).val(agentId);
	// encodeURIComponent(savedPictureContent)
	var formData = new FormData();
	formData.append('mediaData', savedPictureContent);
	// formData.append('vdnId', "1");
	formData.append('openId', openId);
	// formData.append('msgType', 'image');
	formData.append('originId', originId);
	// formData.append('agentId', agentId);

	$.ajax({
		url : 'webim_api /visitor/uploadPic2Server',
		type : 'post',
		data : formData,
		cache : false,
		contentType : false,
		processData : false,
		success : function(data) {
			console.log('上传成功返回。');
			console.log(data);
			if (data['retCode'] != 1) {
				// alertLog.close();
				$("#jqsubmitimg").removeAttr("disabled");
				showLog(data['retMsg']);
				return;
			}
			var html = "";
			// 所上传的图片的路径
			var path = data['path'];
			console.log("========", path);
			var msgId = getQueryString("msgId") || "";
			var request = JSON.stringify({
				"method" : "IM_CCS_SendMsg",
				"openId" : openId,
				"uuid" : guid(),
				"msgId" : msgId,
				"msgType" : 'image',
				"content" : path,
				"cTime" : timestamp
			});
			try {
				websocket.send(request);
			} catch (err) {
				showLog("网络重连中,发送失败！", 300, 1500);
				return;
			}
			// 插入截图信息结构
			html += '<li class="lim_visitor clearfix">';
			html += '	<div class="lim_bubble">';
			html += '		<div class="lim_time show_right">' + mytime + '</div>';
			html += '		<div class="lim_dot ">';
			html += '		<img class="djfd" style="height:100px;display:block;margin: 0 auto;" src="' + path + '">';
			html += '		</div>';
			html += '	</div>';
			html += '	<div class="lim_tale user_img">';
			html += '		<div id="radiusborder"></div>';
			html += '		<p class="call_me" title="我">我</p>';
			html += '	</div>';
			html += '</li>';
			$(".container ul").append(html);
			// component();
			// window.parent.component();
			$(".container").scrollTop($(".container")[0].scrollHeight);
			location.href = "#topmaod";

			$("#speak").contents().find("#updatet").css({
				"background-color" : "#eee"
			});
			$("#speak").contents().find("#key").val("0");
			$('#jqimgPreview').css("display", 'block');
			// alertLog.close();
			// }
		},
		error : function(msg) {
			console.log('上传失败。错误信息如下：');
			console.log(msg);
			showLog("上传失败");
			$("#jqsubmitimg").removeAttr("disabled");
		}
	})

});

// 右侧tab列 点击关闭
function tabClose(title) {
	$("div[name='" + title + "']").removeClass('active').remove();
	$("li[title='" + title + "']").removeClass('active').remove();
	$('.tab_cont_right>div:first').removeClass('active').addClass('active');
	$('#tab>li:first').removeClass('active').addClass('active');
}
// 右侧tab切换显示
$('#tab').on('click', 'li', function() {
	var index = $(this).index();
	$(this).addClass('active').siblings().removeClass('active');
	$('.tab_cont_right .iframetabDiv').eq(index).addClass('active').siblings().removeClass('active');
});
// 发送指令切换
$('#shortcutkey').click(function() {
	$('#shortKeyMenu').toggleClass('showHide');
});
$('#shortKeyMenu li').click(function() {
	$(this).addClass('active').siblings().removeClass('active');
	if ($(this).index() == 1) {
		$('#enter_text').html('Ctrl+Enter');
	} else {
		$('#enter_text').html('Enter');
	}
	$('#shortKeyMenu').removeClass('showHide');
});
// 字体大小设置
$('#fontSize').click(function() {
	$('#selectOp').toggleClass('hide');
})
$('#selectOp').hover(function() {
	$('#selectOp').removeClass('hide');
}, function() {
	$('#selectOp').addClass('hide');
});
$('#selectOp li').click(function() {
	if ($(this).attr('data-size') == 14) {
		$('#form-box').css({
			'font-size' : '14px'
		});
		$('#fontSize').css({
			'background-position' : '0 1px'
		})
	} else if ($(this).attr('data-size') == 16) {
		$('#form-box').css({
			'font-size' : '16px'
		});
		$('#fontSize').css({
			'background-position' : '-26px 1px'
		})
	} else {
		$('#form-box').css({
			'font-size' : '18px'
		});
		$('#fontSize').css({
			'background-position' : '-52px 1px'
		})
	}
	$('#selectOp').removeClass('hide');
});
var hoverType;
// 输入框匹配
$('#ks-suggest-ol').on('mouseover', 'li', function() {
	$(this).addClass('ks-selected').siblings().removeClass('ks-selected');
	hoverType = 2;
})
var showHide = true;
// 当键盘键被松开时发送Ajax获取数据
$('#form-box').keyup(function(event) {
	if(event.keyCode == "37" || event.keyCode == "39"){
		return;
	}
	if(event.keyCode == "38"){
		var activeNum = $("#ks-suggest-ol .ks-selected").length;
		if(activeNum < 1){
			$("#ks-suggest-ol li:last").addClass("ks-selected");
		}else{
			if($("#ks-suggest-ol li:first").hasClass("ks-selected")){
				$("#ks-suggest-ol .ks-selected").removeClass("ks-selected");
				$("#ks-suggest-ol li:last").addClass("ks-selected");
			}else{
				$("#ks-suggest-ol .ks-selected").removeClass("ks-selected").prev().addClass("ks-selected");
			}
		}
		$("#form-box").val($("#ks-suggest-ol .ks-selected span").text());
		stopDefault(event);
		return;
	}
	if(event.keyCode == "40"){
		var activeNum = $("#ks-suggest-ol .ks-selected").length;
		if(activeNum < 1){
			$("#ks-suggest-ol li:first").addClass("ks-selected");
		}else{
			if($("#ks-suggest-ol li:last").hasClass("ks-selected")){
				$("#ks-suggest-ol .ks-selected").removeClass("ks-selected");
				$("#ks-suggest-ol li:first").addClass("ks-selected");
			}else{
				$("#ks-suggest-ol .ks-selected").removeClass("ks-selected").next().addClass("ks-selected");
			}
		}
		$("#form-box").val($("#ks-suggest-ol .ks-selected span").text());
		stopDefault(event);
		return;
	}
	var keywords = $(this).val();
	if (keywords == '') {
		$ks_suggest_container.removeClass('show');//隐藏提示框
		$('#send').removeClass('send_active');
		showHide = false;
		return false;
	}else{
		showHide = true;
	}
	$('#send').addClass('send_active');
	$.ajax({
		type : "post",
		url : "webim_api/ibot/getSuggestedQuestionsDet",
		data : {
			'input' : keywords
		},
		dataType : 'json',
		success : function(data) {
			if(showHide ==true){
				if (data.data != '' && data.data.length>1) {
					$('#ks-suggest-ol').empty();
					$ks_suggest_container.addClass('show');
					var new_data;
					data.data.length > 10 ? new_data = data.data.slice(0, 10) : new_data = data.data;// 防止后台返回的数据太多,故进行截取限制
					$.each(new_data, function(indx, conte) {
						$('#ks-suggest-ol').append('<li><span class="ks-suggest-key">' + conte.Question + '</span></li>');
					});
				}else{
					$ks_suggest_container.removeClass('show');//隐藏提示框
				}
			}

		},
		error : function() {
			$ks_suggest_container.removeClass('show');
		}
	});
});

// 只有在进入提示框的时候并且移出或者输入框失去焦点的时候才隐藏搜索提示框
//$('#ks-suggest-container').hover(function() {
//
//}, function() {
//	if (hoverType === 2 || $("#form-box").is(":focus") == false) {
//		$('#ks-suggest-container').removeClass('show');
//	}
//})
//将上面方法修改为鼠标点击区域外时，隐藏搜索提示框
$(document).click(function(e){
	var target = $(e.target) //获取点击事件的对象
	if(!target.is("#ks-suggest-container")){//判断点击区域是否在 搜索提示框 
		if(!target.is("#form-box")){//判断点击区域是否在 搜索输入框
			if($("#ks-suggest-container").is(":visible")){//判断区域是否已经隐藏
				$('#ks-suggest-container').removeClass('show');
			}
		}else{ //点击在搜索输入框时
			var textData = $("#form-box").val();
			if(textData.length > 0){//判断搜索框是否有内容
				$('#ks-suggest-container').addClass('show');
			}
		}
	}
})

// 点击搜索数据复制给搜索框
$('.ks-suggest-content').on('click', 'li', function() {
	var word = $(this).text();
	$('#form-box').val(word);
	$ks_suggest_container.removeClass('show');
	$('.form-box_focus').val("").focus().val(word);
	// $('#').trigger('click');触发搜索事件
});

// 图片放大功能
$(".m-message").on('click', '.djfd', function() {
	if ($(this).height() >= $(this).width()) {
		$("#img_picturec").attr("src", $(this).attr("src")).css({
			"width" : ($(this).width() * ($(window).height() / $(this).height())) + "px",
			"height" : $(window).height() + "px",
			"margin-left" : ($(window).width() - ($(this).width() * ($(window).height() / $(this).height()))) / 2 + "px",
			"margin-top" : "0"
		});
	} else if ($(this).height() < $(this).width()) {
		if (($(this).width() - $(this).height()) > 20) {
			if (($(this).width() * ($(window).height() / $(this).height())) > $(window).width()) {
				$("#img_picturec").attr("src", $(this).attr("src")).css({
					"width" : ($(window).width()) + "px",
					"height" : ($(this).height() * ($(window).width() / $(this).width())) + "px",
					"margin-top" : ($(window).height() - ($(this).height() * ($(window).width() / $(this).width()))) / 2 + "px",
					"margin-left" : "0"
				});
			} else {
				$("#img_picturec").attr("src", $(this).attr("src")).css({
					"width" : ($(this).width() * ($(window).height() / $(this).height())) + "px",
					"height" : $(window).height() + "px",
					"margin-left" : ($(window).width() - ($(this).width() * ($(window).height() / $(this).height()))) / 2 + "px",
					"margin-top" : "0"
				});
			}
		} else {
			if (($(this).height() * ($(window).width() / $(this).width())) > $(window).height()) {
				$("#img_picturec").attr("src", $(this).attr("src")).css({
					"width" : ($(this).width() * ($(window).height() / $(this).height())) + "px",
					"height" : $(window).height() + "px",
					"margin-left" : ($(window).width() - ($(this).width() * ($(window).height() / $(this).height()))) / 2 + "px",
					"margin-top" : "0"
				});
			} else {
				$("#img_picturec").attr("src", $(this).attr("src")).css({
					"width" : ($(window).width()) + "px",
					"height" : ($(this).height() * ($(window).width() / $(this).width())) + "px",
					"margin-top" : ($(window).height() - ($(this).height() * ($(window).width() / $(this).width()))) / 2 + "px",
					"margin-left" : "0"
				});
			}

		}

	}
	$(".imgpicture").fadeIn();
});

// 意见建议
function submitForm() {
	var nameVal = $("#name").val();
	var emailVal = $("#email").val();
	var phoneVal = $("#phone2").val();
	var content = $("#feed_show").val();
	if (nameVal == "") {
		$.messager.alert("提示", '姓名不能为空！', "warning");
	} else if (emailVal == "" && phoneVal == "") {
		$.messager.alert("提示", '邮箱地址、电话号码必须填一个！', "warning");
	} else if (emailVal != "" && /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/.test(emailVal) == false) {
		$.messager.alert("提示", '邮箱格式出错！', "warning");
	} else if (phoneVal != "" && /^0?(13|14|15|18)[0-9]{9}$/.test(phoneVal) == false) {
		$.messager.alert("提示", '移动电话号码格式出错！', "warning");
	} else if (content == "") {
		$.messager.alert("提示", '留言内容不能为空！', "warning");
	} else {
		$.ajax({
			type : "post",
			dataType: "json",
			async : true,
			data : {
				"openId" : openId,
				"leaveName" : nameVal,
				"email" : emailVal,
				"tel" : phoneVal,
				"content" : content,
				"accessUrl" : document.referrer || ""
			},
			url : "api/LeaveMessage/addLeaveMessage",
			success : function(json) {
				if (json['retCode'] != 1) {
					showLog(json['retMsg']);
				} else {
					console.log('提交成功');
					$('#leaveWordForm').hide();
					$('#content-wrap-suc').show();
				}
			},
			error : function() {
				showLog('网络异常,请稍后再试！');
			}
		})
	}
}
function close_submitForm() {
	$('.content_left').show();
	$('#opinion').hide();
}

function myBrowser(){  
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
  
    var isOpera = userAgent.indexOf("Opera") > -1;  
  
    if (isOpera) {  
  
        return "Opera"  
  
    }; //判断是否Opera浏览器  
  
    if (userAgent.indexOf("Firefox") > -1) {  
  
        return "FF";  
  
    } //判断是否Firefox浏览器  
  
    if (userAgent.indexOf("Chrome") > -1){  
  
		return "Chrome";  
  
	}  //判断是否Chrome浏览器  
  
    if (userAgent.indexOf("Safari") > -1) {  
  
        return "Safari";  
  
    } //判断是否Safari浏览器  
  
    if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {  
  
        return "IE";  
  
    }; //判断是否IE浏览器  
  
}
if(myBrowser() == 'FF'){
	$('.expUl li').css({'margin':'4px 9px'});
	$('#custom_exp li').css({'width':'36px'});
}