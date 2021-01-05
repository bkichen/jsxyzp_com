//禁止用F5键   
document.onkeydown = function(e) {
	e = window.event || e;
	var keycode = e.keyCode || e.which;
	if (keycode == 116) {
		if (window.event) {// ie
			try {
				e.keyCode = 0;
			} catch (e) {
			}
			e.returnValue = false;
		} else {// firefox
			e.preventDefault();
		}
	}
}
var evaluateIsHidden = false;//访客端是否显示主动推送的评价按钮
var msg;// 获取访客端信息
var country="";
var city="";
var province="";
var imIp="";
var operator="";
var initFlag;
var webFunc;
var openId = window.localStorage.getItem("focu_openId") || "";
// 获取访客端信息接口（IM访客端->CCS服务)
function GetVisitorLocalImg() {
	$.ajax({
		type : "post",
		async : false,
		// contentType:"application/json;charset=UTF-8",
		// dataType : "application/json",
		url : "webim_api/visitor/im_getVisitorLocalImg",
		data : {
			"opendId" : openId,
		},
		success : function(json) {
			if (json['retCode'] != 1) {
				console.log(json['retMsg']);
				return;
			}
			msg = json['msg'][0];
			if (msg['country']) {
				country = msg['country'];
			} else {
				country = "";
			}
			city = msg['city'];
			province = msg['province'];
			imIp = msg['ip'];
			operator = msg['operator'];// 运营商
		}
	})
}
function Time(d1) {
	var date2 = new Date(); // 结束时间
	var date3 = date2.getTime() - d1; // 时间差的毫秒数
	// 计算出相差天数
	var days = Math.floor(date3 / (24 * 3600 * 1000))

	// 计算出小时数

	var leave1 = date3 % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
	var hours = Math.floor(leave1 / (3600 * 1000))
	// 计算相差分钟数
	var leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
	var minutes = Math.floor(leave2 / (60 * 1000))
	// 计算相差秒数
	var leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
	var seconds = Math.round(leave3 / 1000)
	return seconds;
}
function setTime() {
	localStorage.setItem("startTime", new Date().getTime());
	localStorage.removeItem('workno');
}
/**if (localStorage.getItem("startTime")) {
	var oldTime = localStorage.getItem("startTime");
	var newTime = new Date().getTime();
	var ct = Time(oldTime);
	localStorage.setItem("startTime", new Date().getTime());
	console.log(Time(oldTime));
	if (ct <= 3) {
		var dialog = new Dialog();
		dialog.init({
			iNow : 3,
			w : 400,
			dir : 'center-top',
			h : 150,
			zindex : 999999,
			title : "要重新加载该网站吗",
			boxId : "alertTip",
			content : '系统可能不会保存您所做的更改',
			btnName : [ '取消', '重新加载' ],
			btnEvent : [ {
				close : true,
				fn : function() {
					localStorage.setItem("startTime", new Date().getTime());
					return true;
				}
			}, {
				ok : true,
				fn : function() {
					localStorage.removeItem("startTime");
					location.reload();
					return false;
				}
			} ]
		})
	}
} else {
	localStorage.setItem("startTime", new Date().getTime());
}**/

//GetVisitorLocalImg();
var token = ''; // token
var loginOne = false; // 登录失败为：true,登录成功默认为：false
var loginOneMsg = ""; // 登录成功或失败的返回消息
var vdnId = "1", groupName = "", agentName = "", skillId = "", skillName = "", agentId = "", sessionId = "";
var entry = false;// 是否设置缓存 默认false 没点击
var opendKey = 1;// 是否只加载聊天内容和需要设置缓存 1否 0是
var headImgUrl = "./images/mz/v_h.png"; // 默认访客头像路径
var agentHeadImgUrl = "./images/1.jpg"; // 默认坐席头像路径
var systemHeadImgUrl = "./images/mz/op_h.gif"; // 系统头像路径
var pageIndex = 1; // 默认第一页
var totalPage = 1; // 总页
var initDataTime = (new Date()).valueOf();
var pageSize = 1;
var pageInit = true;// 页面初始化 true 是
var firstLogin = true;
var timeDiffccs = 0;// 服务器时间梭减去坐席端页面时间梭
//var m_workNo = Request("workNo");
//var m_vdnId = Request("vdnId");

var websocket;
// 下面四个参数要在jsp理获取吧
// var openId="oiACnjrKTKt60AdalrrNqoQz7Hac";
// var openId=getQueryString("openId");
//var pwd = getQueryString("pwd");
var pwd = "";
var nickName = window.localStorage.getItem("focu_nickName") || "";

var username = decodeURIComponent(getQueryString("username"));

if (username == 'null' || username == null || username == 'undefined') {
	username = '';
}

window.keydown = function() {
	$("#speak")[0].contentWindow.sendMsg();
};
//{{ 保存访问的端口号 add by xw 2019-06-20
savePort();
function savePort(){
	var port = window.location.port;
	$.ajax({
		url:"webim_api/fileupload/im_savePort",
		type:"post",
		data:{
			"port":port
		},
		success:function (data) {
			console.log("保存端口："+port+",成功")
        }
	});
}


//}}
$(function() {
	/* 内容自适应 */
	// $.adaptiveWH($('.container'),{lessHeight:160});
	$('#speak').attr('src', 'mz_speak.html?openId=' + openId + '&pwd=' + pwd + '&username=' + encodeURIComponent(username) + '&timeDiff=' + timeDiffccs);

	window.onbeforeunload = function() {

		// alert("===onbeforeunload===");
		//if (event.clientX > document.body.clientWidth && event.clientY < 0 || event.altKey) {
		//	alert("你关闭了浏览器");
		//} else {
		//	alert("你正在刷新页面");
		//}
	}
	var startTime = new Date().getTime();
	console.log("startTime", startTime);
	var timeDiff;
	var stopTime = new Date().getTime();
	timeDiff = stopTime + 60;
	
	//var workno = getQueryString("workno");
	var workno = guid();
	if(workno==null){
		workno = localStorage.getItem("workno");
	}

	// 页面一刷新就拉取历史消息
	// websocket连接初始化函数
	function WebSocketfn() {
		// 验证websocket连接是否出问题
		try {
			if ('WebSocket' in window) {
				// alert("WebSocket");
				websocket = new WebSocket("ws://" + window.location.host + "/FS_WEB_CCS/webim_api/socket/message");
			} else if ('MozWebSocket' in window) {
				// alert("MozWebSocket");
				websocket = new MozWebSocket("ws://FS_WEB_CCS/webim_api/socket/message");
			} else {
				// alert("SockJS");
				websocket = new SockJS("http://" + window.location.host + "/FS_WEB_CCS/webim_api/socket/message");
			}
		} catch (err) {
			// showLog()方法为提示框，提示内容为文本内容
			showLog("断线重连中，请稍后", 300, 1500);
		}
	}

	// 重连函数
	window.clfn = function() {
		// websocket为不连接时
		if (websocket.readystate !== 1) {
			console.log("连接断开正在重连中！");
			// 重新连接websocket
			WebSocketfn();
			pageInit = false;
			initEventHandle();
            savePort();
		}
	}
	
	/*if(workno==null || workno ==""){
		//调用第三方调取workno工号接口
		$.ajax({
			type : "post",
			async : false,
			url : "worknoTokenServlet",
			success : function(json) {
				workno = json;
			}
		})
	}
	console.log("访客端工号"+workno);
	if(workno=='null' || workno==null || workno == ""){
		console.log("工号为空，不能登录");
		showLog("Portal登录超时，请重新登录后再打开会话框获取服务", 300, 1500);
		return;
	}
	*/

	// 首次连接websocket
	WebSocketfn();
	
	
	
	initEventHandle();
	// websocket状态函数
	function initEventHandle() {
		websocket.onopen = function(evnt) {
			console.log("链接服务器成功!")
			if (pageInit) {
				var request = JSON.stringify({
					"method" : "IM_CCS_Login",
					"openId" : openId,
					"nickName" : nickName,
					"imIp" : imIp,
					"country" : country,
					"province" : province,
					"city" : city,
					// "imAccSource": window.location.href,
					"imAccSource" : document.referrer,
					"imWd" : "",
					"operator" : operator,
					"imIntoTime" : startTime,
					"imKeepTime" : timeDiff,
					"time": new Date().getTime(),
					"flag" : 0,
					"workno" : workno
				});
				websocket.send(request);
				console.log("k", request);
			} else {
				// websocket.send(JSON.stringify({
				// "method" : "IM_CCS_ReConnet",
				// "openId" : openId
				// }));
				// console.log("webscoket链接服务器--重连--");
				var request = JSON.stringify({
					"method" : "IM_CCS_Login",
					"openId" : openId,
					"nickName" : nickName,
					"imIp" : imIp,
					"country" : country,
					"province" : province,
					"city" : city,
					// "imAccSource": window.location.href,
					"imAccSource" : document.referrer,
					"imWd" : "",
					"operator" : operator,
					"imIntoTime" : startTime,
					"imKeepTime" : timeDiff,
					"time": new Date().getTime(),
					"flag" : 1,
					"workno" : workno
				});
				websocket.send(request);

				// 若有因WebSocket断掉未发送出去的信息重新发送并删除该缓存
				var request = localStorage.getItem("sendMsg" + openId);
				if (request != undefined && request != null) {
					websocket.send(request);
					localStorage.removeItem("sendMsg" + openId);
				}
			}
		};

		websocket.onmessage = function(event) {
			var json = JSON.parse(event.data);
			// 坐席登录返回
			console.log("lllk", json['method']);
			if (json['method'] == "IM_CCS_LoginAck") {

				if (json['retCode'] != 1) {
					showLog("登录失败," + json['retMsg']);
					loginOne = true;
					loginOneMsg = json['retMsg'];
					// 关闭websocket
					websocket.close();
					return;
				} else {
					if (firstLogin) {
						// showLog("登录成功！");
					}
					timeDiffccs = json['timeDiff'];
					// 得到坐席id
					openId = json['openId'];
					//openId = workno;
					nickName = json['nickName']
					//nickName = workno;
					// 得到token
					token = json['token'];
					// window.localStorage["id"] = openId;
					window.localStorage.setItem("focu_openId", openId);
					window.localStorage.setItem("focu_nickName", nickName);

					firstLogin = false;
				}

			}
			// 请求获取访客历史信息列表返回
			if (json["method"] == "IM_CCS_RequestHisMsgAck") {
				console.log("访客历史信息列表", json);
				pageInit = false;
				if (json['retCode'] == 1) {
					console.log("访客历史信息列表", json);
					if (json['data'] == "" || json['data'] == null) {
						$(".jiaz button").remove();
					} else {
						totalPage = json['totalPage'];
						// pageIndex=json['pageSize'];
						loading(json);
						if (totalPage == pageIndex) {
							$(".jiaz button").remove();
						} else {
							pageIndex++;
						}
					}
				} else {
					console.log("访客历史信息列表", json["retMsg"]);
				}
			}

			// IM信息发送返回
			if (json["method"] == "IM_CCS_SendMsgAck") {
				console.log("发送返回", json["retMsg"]);
				if (json['retCode'] != 1) {
					showLog("发送信息失败");
				}

			}

			// IM信息接收
			if (json["method"] == "IM_CCS_ReceiveMsgEvt") {
				console.log("信息接收", json);
				var request = JSON.stringify({
					"uuid" : json["uuid"],
					"method" : "IM_CCS_ReceiveMsgEvtAck",
					"retCode" : 1, // 返回值代码
					"retMsg" : "成功!"
				});
				//显示隐藏评价按钮
				if(json['agentUn']){
					evaluateIsHidden = true;
				}
				if(evaluateIsHidden){
					$('#openEvaluate').removeClass('hide');
				}
				if(json['content'].indexOf('会话已结束') > -1 || !evaluateIsHidden){
					$('#openEvaluate').addClass('hide');
				}
				websocket.send(request);
				console.log("接收", json);
				getNewMsg(json);

			}

			// 弹出满意度窗口
			if (json["method"] == "IM_CCS_SatQuestEvt") {
				console.log("弹窗", json['method']);
				console.log('弹窗拿回的数据:', json);
				var openid_ = json.openId;
				layer.open({
					type : 2,
					area : [ '500px', '700px' ],
					fixed : false, // 不固定
					scrollbar : false,
					title : false,
					closeBtn : 0,
					content : 'Satisfaction.html?'+ (new Date()).getTime() +'&openId=' + openid_
				});
			}

			// P4状态
			if (json["method"] == "IM_CCS_OpenNewWindowEvt") {
				console.log("p4", json['method']);
				console.log('p4数据:', json);
				p4Iframe(json.title, json.url);
			}

			// 解决未解决
			if (json["method"] == "IM_CCS_RobotSolveRequestAck") {
				console.log('解决未解决返回数据:', json);
				getNewMsg(json);

			}
		};
		websocket.onerror = function(evnt) {
			console.log(evnt);
			console.log('网络出错！');
			// showLog("网络异常,请稍后再试!");
		};
		websocket.onclose = function(evnt) {
			// console.log(evnt);
			console.log("onclose", websocket.readyState);
			// websocket.readyState = 0;
			console.log("与服务器断开了链接!");
			evaluateIsHidden = false;
			// 如果不是主动退出会话(系统说'会话已结束，欢迎您再次使用线上客服！')则需要重连
			if ($(".container ul li:last-child span:first-child").text() != "" || $(".container ul li:last-child").find(".text").text() != "当前人工咨询会话已结束，您还可以继续咨询智能客服或直接关闭会话窗口！") {
				console.log("是否进入重新链接!");
				// showLog("链接已断,正在重连中,请稍后再试！", 300, 1500);
				// if (websocket.readyState == 3) {
				// showLog("与服务器断开了链接!");
				// }
				clfn();
			}
		}
	}

	var xhr = null;
	/** 语音，图片，视频等弹出控制方法* */
	// function component()跟这个一样dianjfn
	function component() {
		$(".djfd").click(function() {
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
		$(".imgpicture").click(function() {
			$(".imgpicture").fadeOut();
		})
		// 打开视频
		$(".video-box").click(function() {
			var meido = document.getElementById("video");
			meido.src = $(this).attr("data-videourl");
			$("#video source").attr("src", $(this).attr("data-videourl"));
			$(".videoture").fadeIn();
		})
		// 关闭视频
		$("#videocolse").click(function() {
			var meido = document.getElementById("video");
			meido.pause();
			$(".videoture").fadeOut();
		})
		// 语音初始化
		// RongIMLib.RongIMVoice.init();
		// 语音播放
		$(".audio-box").each(function() {
			/*
			 * $(this).click(function() { console.log(RongIMLib);
			 * RongIMLib.RongIMVoice.stop();
			 * $(".audio-box").removeClass("active").attr("data-key", "1"); var
			 * that = $(this); var _this = this; var timer = null; if
			 * ($(this).attr("data-key") === "1") {
			 * $(this).addClass("active").attr("data-key", "0"); //
			 * alert($(this).attr("data-audiourl")); // $("#audio").attr("src",
			 * $(this).attr("data-audiourl")); // var audio =
			 * document.getElementById("audio"); var url =
			 * $(this).attr("data-audiourl"); clearTimeout(timer);
			 * RongIMLib.RongIMVoice.play(url);
			 * RongIMLib.RongIMVoice.fetchDataLength(url, function(data) { var a =
			 * data; var time = Math.ceil(a.length / 1024); timer =
			 * setTimeout(function() {
			 * $(".audio-box").removeClass("active").attr("data-key", "1");
			 * clearTimeout(timer); }, (time + 2) * 1000); }); // if (audio.src) { //
			 * $(this).addClass("active").attr("data-key", "0"); //
			 * audio.play(); // audio.addEventListener("canplay", function() { // //
			 * console.log(_this); // var sc = parseInt(audio.duration); //
			 * _this.timer = setTimeout(function() { //
			 * $(".audio-box").removeClass("active").attr("data-key", "1"); // },
			 * sc * 1000); // }); // } } else if ($(this).attr("data-key") ===
			 * "0") { clearTimeout(timer); RongIMLib.RongIMVoice.stop();
			 * $(".audio-box").removeClass("active").attr("data-key", "1"); } })
			 */
			$(this).click(function() {
				xhr = null;
				$(".audio-box").removeClass("active").attr("data-key", "1");
				var url = $(this).attr("data-audiourl");
				xhr = new XMLHttpRequest();
				xhr.open('GET', url);
				xhr.responseType = 'blob';
				xhr.onload = function() {
					playAmrBlob(this.response);
				};
				xhr.send();
			})
		})
		try {
			$(".container").scrollTop($(".container")[0])
		} catch (e) {
			console.log('在iframe时，无法获得scrollHeight.');
			// console.log(e)
		}
	}

	/** 初始化，插入消息方法* */
	function loading(json) {
		// 成功回调函数
		var uuid = json["uuid"];
		var data = json["data"];
		console.log("data", json["data"]);
		var html = "";

		for (var i = 0; i < data.length; i++) {
			// 记录ID
			var id = data[i]["recId"];
			// var openId1 = data[i]["openId"];
			// 会话类型
			var sessiontype = data[i]["sessiontype"] || data[i]["sessionType"];
			// 信息类型
			var msgtype = data[i]["msgtype"] || data[i]["msgType"];
			/*******************************************************************
			 * var file = $("#file")[0].files[0]; var filename =
			 * file.name.substring(file.name.lastIndexOf('.'));
			 ******************************************************************/
			// 坐席呢称
			var agentUn;
			if (data[i]["agentUn"]) {
				agentUn = data[i]["agentUn"];
			} else {
				agentUn = '';
			}
			// agentHeadImg
			var agentHeadImg = data[i]["agentHeadImg"];
			// 内容
			var cnt = data[i]["content"];
			// 创建时间
			var st = data[i]["createTime"];
			// console.log("1st=", st);
			// st = getTime(st);

			// 只显示时分秒
			var regg = /([0-9]{1,2}:[0-9]{1,2})?(:[0-5]{0,1}[0-9]{1})/ig;
			st = st.match(regg).join('');
			// 头像路径
			var imgUrl = agentHeadImg ? agentHeadImg : sessiontype == 1 ? headImgUrl : agentUn ? agentHeadImgUrl : systemHeadImgUrl;
			console.log(cnt);
			if(typeof cnt == 'object'){
				cnt = JSON.stringify(cnt);
			}

			if (cnt != "" || cnt != null) {
				var regreg = new RegExp("(\\(|\\)|\\[|\\]|\\*|\\?|\\+|\\$|\\/)","g");
				var sessionExp = JSON.parse(sessionStorage.getItem('expjson'));
				if (cnt.indexOf('class="cut_off_line"') > -1) {
					if(sessionExp ==null){
						ajaxExpJsona([1,2],function(icons){
							var tStr_new= "(" +icons.elfcodeStr.replace(regreg,"\\$1")+")";
							tStr_new.replace(new RegExp("\\/","g"),"\\/");
							var regx_new = new RegExp(tStr_new,"g");
							cnt = cnt.replace(regx_new,function(word){
								return '<img src="' + icons.faceMap[word] + '" style="width:30px;height:30px;"/>';
							})
						});
						
					}else{
						var tStr= "(" +sessionExp.elfcodeStr.replace(regreg,"\\$1")+")";
						tStr.replace(new RegExp("\\/","g"),"\\/");
						var regx = new RegExp(tStr,"g");
						cnt = cnt.replace(regx,function(word){
							return '<img src="' + sessionExp.faceMap[word] + '" style="width:30px;height:30px;"/>';
						});
					}
				} else {// 自动返回的信息
					if(sessionExp ==null){
						ajaxExpJsona([1,2],function(icons){
							var tStr_new= "(" +icons.elfcodeStr.replace(regreg,"\\$1")+")";
							tStr_new.replace(new RegExp("\\/","g"),"\\/");
							var regx_new = new RegExp(tStr_new,"g");
							cnt = cnt.replace(regx_new,function(word){
								return '<img src="' + icons.faceMap[word] + '" style="max-width:80px;max-height:80px;"/>';
							})
						});
						
					}else{
						var tStr= "(" +sessionExp.elfcodeStr.replace(regreg,"\\$1")+")";
						tStr.replace(new RegExp("\\/","g"),"\\/");
						var regx = new RegExp(tStr,"g");
						cnt = cnt.replace(regx,function(word){
							return '<img src="' + sessionExp.faceMap[word] + '" style="max-width:80px;max-height:80px;"/>';
						});
					}
				}
			}

			if (msgtype == "image" || msgtype == "imgmsg") {
				// 服务端消息
				if (sessiontype == 2 || sessiontype == 3) {

					html += '<li class="lim_operator clearfix">';
					html += '	<div class="lim_bubble">';
					html += '		<div class="lim_time show_left">' + st + '</div>';
					html += '		<div class="lim_dot ">';
					html += '			<div class="robotinfo">';
					html += '				<img class="djfd" style="height:100px;display:block;" src="' + cnt + '">';
					html += '			</div>';
					html += '		</div>';
					html += '	</div>';
					html += '	<div class="lim_tale">';
					html += '		<img src="' + imgUrl + '">';
					html += '		<div id="radiusborder"></div>';
					html += '		<p class="call_me" title="">' + agentUn + '</p>';
					html += '	</div>';
					html += '</li>';

				} else {
					// 客户端消息
					html += '<li class="lim_visitor clearfix">';
					html += '	<div class="lim_bubble">';
					html += '		<div class="lim_time show_right">' + st + '</div>';
					html += '		<div class="lim_dot ">';
					html += '			<img class="djfd" style="height:100px;display:block;" src="' + cnt + '">';
					html += '		</div>';
					html += '	</div>';
					html += '	<div class="lim_tale user_img">';
					html += '		<div id="radiusborder"></div>';
					if (sessiontype == 1) {
						html += '<p class="call_me" title="">' + agentUn + '</p>';
					}
					html += '	</div>';
					html += '</li>';
				}

				// 内容为文本
			} else if (msgtype == "text") {
				cnt = cnt.replace(/\\n/g, "<br/>");
				// 将文本里面的超链接改为新窗口打开
				cnt = replaceURLWithHTMLLinks(cnt);
				var reg = new RegExp('(<a)(\\s)(.*?</a>)', 'gmi');
				cnt = cnt.replace(reg, '$1 target="_blank" $3');

				// 服务端消息
				if (sessiontype == 2 || sessiontype == 3) {

					html += '<li class="lim_operator clearfix">';
					html += '	<div class="lim_bubble">';
					html += '		<div class="lim_time show_left">' + st + '</div>';
					html += '		<div class="lim_dot ">';
					html += '			<div class="robotinfo">' + cnt;
					html += '			</div>';
					html += '		</div>';
					html += '	</div>';
					html += '	<div class="lim_tale">';
					html += '		<img src="' + imgUrl + '">';
					html += '		<div id="radiusborder"></div>';
					html += '		<p class="call_me" title="">' + agentUn + '</p>';
					html += '	</div>';
					html += '</li>';

				} else {
					// 客户端消息
					html += '<li class="lim_visitor clearfix">';
					html += '	<div class="lim_bubble">';
					html += '		<div class="lim_time show_right">' + st + '</div>';
					html += '		<div class="lim_dot ">' + cnt;
					html += '		</div>';
					html += '	</div>';
					html += '	<div class="lim_tale user_img">';
					html += '	<div id="radiusborder"></div>';
					if (sessiontype == 1) {
						html += '<p class="call_me" title="">' + agentUn + '</p>';
					}
					html += '	</div>';
					html += '</li>';
				}

				// 内容为视频
			} else if (msgtype == "video" || msgtype == "shortvideo" || msgtype == "videomsg") {
				// 服务端消息
				if (sessiontype == 2 || sessiontype == 3) {

					html += '<li class="lim_operator clearfix">';
					html += '	<div class="lim_bubble">';
					html += '		<div class="lim_time show_left">' + st + '</div>';
					html += '		<div class="lim_dot ">';
					html += '			<div class="robotinfo">';
					html += '				<div class="video-box" data-videourl="' + cnt + '">';
					html += '				<div class="zz"></div><video width="200" height="120"><source src="' + cnt + '" type="" media=""></source></video>';
					html += '			</div>';
					html += '		</div>';
					html += '	</div>';
					html += '	<div class="lim_tale">';
					html += '		<img src="' + imgUrl + '">';
					html += '		<div id="radiusborder"></div>';
					html += '		<p class="call_me" title="">' + agentUn + '</p>';
					html += '	</div>';
					html += '</li>';
				} else {
					// 客户端消息

					html += '<li class="lim_visitor clearfix">';
					html += '	<div class="lim_bubble">';
					html += '		<div class="lim_time show_right">' + st + '</div>';
					html += '		<div class="lim_dot ">';
					html += '			<div class="video-box" data-videourl="' + cnt + '">';
					html += '			<div class="zz"></div><video width="200" height="120"><source src="' + cnt + '" type="" media=""></source></video>';
					html += '		</div>';
					html += '	</div>';
					html += '	<div class="lim_tale user_img">';
					html += '		<div id="radiusborder"></div>';
					if (sessiontype == 1) {
						html += '<p class="call_me" title="">' + agentUn + '</p>';
					}
					html += '	</div>';
					html += '</li>';
				}

				// 内容为音频
			} else if (msgtype == "voice" || msgtype == "musicmsg") {
				// 服务端消息
				if (sessiontype == 2 || sessiontype == 3) {

					html += '<li class="lim_operator clearfix">';
					html += '	<div class="lim_bubble">';
					html += '		<div class="lim_time show_left">' + st + '</div>';
					html += '		<div class="lim_dot ">';
					html += '			<div class="robotinfo">';
					if (filename == '.mp3') {
						html += '<div class="zz"><audio class="audioM" src="' + cnt + '" data-level="1"  controls="controls" preload  hidden  data-key="1"></audio></div>'

						html += '<span class="sp-bofan" ><div class="audio-mp3" data-level="1" data-audiourl="' + cnt + '""></span></div>';
					} else {
						html += '<div class="audio-box" data-key="1" data-audiourl="' + cnt + '">';
						html += '</div>';
					}
					html += '			</div>';
					html += '		</div>';
					html += '	</div>';
					html += '	<div class="lim_tale">';
					html += '		<img src="' + imgUrl + '">';
					html += '		<div id="radiusborder"></div>';
					html += '		<p class="call_me" title="">' + agentUn + '</p>';
					html += '	</div>';
					html += '</li>';
				} else {
					// 客户端消息

					html += '<li class="lim_visitor clearfix">';
					html += '	<div class="lim_bubble">';
					html += '		<div class="lim_time show_right">' + st + '</div>';
					html += '		<div class="lim_dot ">';
					if (filename == '.mp3') {
						html += '<div class="zz"><audio class="audioM" src="' + cnt + '" data-level="1"  controls="controls" preload  hidden  data-key="1"></audio></div>';
						html += '<span class="sp-bofan" ><div class="audio-mp3" data-level="1" data-audiourl="' + cnt + '""></span></div>';
					} else {
						html += '<div class="audio-box" data-key="1" data-audiourl="' + path + '"></div>';
					}

					html += '		</div>';
					html += '	</div>';
					html += '	<div class="lim_tale user_img">';
					html += '		<div id="radiusborder"></div>';
					if (sessiontype == 1) {
						html += '<p class="call_me" title="">' + agentUn + '</p>';
					}
					html += '	</div>';
					html += '</li>';
				}
			}
		}
		if (pageInit) {
			$(".container ul").html(html);
			component();
			try {
				$(".container").scrollTop($(".container")[0]);
			} catch (e) {
				console.log('在iframe时，无法获得scrollHeight.');
				console.log(e)
			}
			pageInit = false;
		} else {
			$(".container ul").prepend(html);
			component()
			location.href = "#topmaod";
			var spanBFs = document.getElementsByClassName("sp-bofan");
			$.each(spanBFs, function(i, span) {
				$(span).unbind("click").bind({
					click : function(event) {
						bf(event);
						event.stopPropagation();
					}
				});
			});
		}
	}

	/* 图片上传弹出框关闭 */
	$(".zzt,#closebtn").click(function() {
		$(".zzt").fadeOut();
		$("#speak").contents().find("#updatet").css({
			"background-color" : "#eee"
		});
		$("#speak").contents().find("#key").val("0");
		// $('#imgPreview').css("display", 'block');
		$('#imgPreview').show();
		// $('#imgPreview').attr("src","");
	})
	/** 图片同步预览* */
	function setImagePreview(avalue) {
		var docObj = document.getElementById("file");
		var imgObjPreview = document.getElementById("imgPreview");
		if (docObj.files && docObj.files[0]) {
			// 火狐下，直接设img属性
			imgObjPreview.style.display = 'block';
			imgObjPreview.style.width = '140px';
			imgObjPreview.style.height = '150px';
			// imgObjPreview.src = docObj.files[0].getAsDataURL();

			// 火狐7以上版本不能用上面的getAsDataURL()方式获取，需要一下方式
			imgObjPreview.src = window.URL.createObjectURL(docObj.files[0]);
		} else {
			// IE下，使用滤镜
			docObj.select();
			var imgSrc = document.selection.createRange().text;
			var localImagId = document.getElementById("imgPreview");
			// 必须设置初始大小
			localImagId.style.width = "140px";
			localImagId.style.height = "150px";
			// 图片异常的捕捉，防止用户修改后缀来伪造图片
			try {
				localImagId.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
				localImagId.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgSrc;
			} catch (e) {
				showLog("您上传的图片格式不正确，请重新选择!");
				return false;
			}
			imgObjPreview.style.display = 'none';
			document.selection.empty();
		}
		return true;
	}
	// 上传的图片改变时
	$("#file").change(function() {
		var file = $(this)[0].files[0];
		var f = $(this)[0];
		// console.log(file);
		if(file){
			var filename = file.name.substring(file.name.lastIndexOf('.'));
			if (filename == '.jpg' || filename == '.jpeg' || filename == '.png' || filename == '.gif') {
				$("#yltp").show();
				$("#wjmc,#wjlx").hide();
				setImagePreview(f);
				$("#filetype1").html(file.type);
			} else {
				$("#yltp").hide();
				$("#wjmc").show();
				$("#previews1").html(file.name);
				$("#filetype1").html(file.type);
			}
		}else{
			$("#yltp").hide();
		}
	});
	$("#file,.zzt-bg").click(function(event) {
		event.stopPropagation();
	})
	/* 图片点击上传 */
	$("#submitimg")
			.click(
					function() {
						//var myDate = new Date().getTime();
						//var mytime = getTime(myDate);
						var regg = /([0-9]{1,2}:[0-9]{1,2})?(:[0-5]{0,1}[0-9]{1})/ig;
						var mytime = getTimes(parseInt(new Date().getTime()) + timeDiffccs).match(regg).join('');
						var timestamp = Date.parse(new Date());

						if ($("#file").val() == "") {
							showLog("请先选择图片！");
						} else {
							// var html = "";
							$(this).attr("disabled", true);
							var file = $("#file")[0].files[0];
							var filename = file.name.substring(file.name.lastIndexOf('.'));
							// 判断图片类型
							if (filename == '.jpg' || filename == '.jpeg' || filename == '.png' || filename == '.gif') {
								var msgType = "image";
							} else if (filename == '.mp4') {
								var msgType = "video";
							} else if (filename == '.amr' || filename == '.mp3') {
								if (filename == '.mp3') {
									var x = document.createElement("AUDIO");
									x.setAttribute("id", "audio-box-time");
									x.setAttribute("src", $("#file").val());
									var audiotime = x.duration;
									if (audiotime > 60) {
										var msgType = "file";
										showLog('音频超出60秒');
									} else {

										var msgType = "voice";
									}
								} else {
									var msgType = "voice";
								}
							} else {
								var msgType = "file";
							}
							// 网页可以向坐席端发送下载文件
							// if (msgType == 'file') {
							// showLog('不能上传这种格式的文件');
							// $(this).removeAttr('disabled');
							// } else {
							var fd = new FormData();
							fd.append("openId", openId);
							fd.append("media", file);
							fd.append('msgType', msgType);
							// console.info(fd);
							// fd.append("nickname", username);
							// 先ajax数据到后台，然后返回路径等，下面插入的结构哪里应为ajax完后再执行
							var alertLog = new Dialog();
							alertLog
									.init({
										// 配置参数
										iNow : 2,
										w : '200',
										h : 50,
										skin : 1,
										marKop : '0.5',
										alertlog : true,
										time : false,
										isbtn : false,
										radius : 14,
										zIndex : 2222,
										content : '<div style="text-align:center;height:35px;"><img src="./images/loading.gif" style="float:left;float: left;width: 26px;height: 26px;margin-top: 5px;display: block;margin-left: 30px;"/><span style="float:left;margin-left: 10px;line-height:36px;">正上传中...</span></div>',
										animation : false
									});
							$(".zzt").fadeOut();
							$.ajax({
								url : 'webim_api/visitor/im_uploadMediaFile2Server',
								type : 'post',
								data : fd,
								cache : false,
								contentType : false,
								processData : false,
								success : function(data) {
									console.log('上传成功返回。');
									console.log(data);
									if (data['retCode'] != 1) {
										alertLog.close();
										$("#submitimg").removeAttr("disabled");
										showLog(data['retMsg']);
										return;
									} else {
										if (websocket.readyState != 1) {
											console.log("会话结束，重新登录！");
											clfn();
										}
										var html = "";
										// 所上传的图片的路径
										var path = data['path'];
										$("#submitimg").removeAttr("disabled");
										// 插入结构
										if (msgType == 'video') {// 视频

											html += '<li class="lim_visitor clearfix">';
											html += '	<div class="lim_bubble">';
											html += '		<div class="lim_time show_right">' + mytime + '</div>';
											html += '		<div class="lim_dot ">';
											html += '			<div class="video-box" data-videourl="' + path + '">';
											html += '				<div class="zz"></div><video width="200" height="120"><source src="' + path + '" type="" media=""></source></video>';
											html += '			</div>';
											html += '		</div>';
											html += '	</div>';
											html += '	<div class="lim_tale user_img">';
											html += '		<div id="radiusborder"></div>';
											html += '		<p class="call_me" title=""></p>';
											html += '	</div>';
											html += '</li>';
										} else if (msgType == 'image') {// 图片

											html += '<li class="lim_visitor clearfix">';
											html += '	<div class="lim_bubble">';
											html += '		<div class="lim_time show_right">' + mytime + '</div>';
											html += '		<div class="lim_dot ">';
											html += '			<img class="djfd" style="height:100px;display:block;" src="' + path + '">';
											html += '		</div>';
											html += '	</div>';
											html += '	<div class="lim_tale user_img">';
											html += '		<div id="radiusborder"></div>';
											html += '		<p class="call_me" title=""></p>';
											html += '	</div>';
											html += '</li>';
										} else if (msgType == 'voice') {// 音频

											html += '<li class="lim_visitor clearfix">';
											html += '	<div class="lim_bubble">';
											html += '		<div class="lim_time show_right">' + mytime + '</div>';
											html += '		<div class="lim_dot ">';
											if (filename == '.mp3') {
												html += '<div class="zz"><audio class="audioM" src="' + path + '" data-level="1"  controls="controls" preload  hidden  data-key="1"></audio></div>';
												html += '<span class="sp-bofan" ><div class="audio-mp3" data-level="1" data-audiourl="' + path + '""></span></div>';
											} else {
												html += '<div class="audio-box" data-key="1" data-audiourl="' + path + '"></div>';
											}
											html += '		</div>';
											html += '	</div>';
											html += '	<div class="lim_tale user_img">';
											html += '		<div id="radiusborder"></div>';
											html += '		<p class="call_me" title=""></p>';
											html += '	</div>';
											html += '</li>';
										} else if (msgType == 'file') {// 文件

											html += '<li class="lim_visitor clearfix">';
											html += '	<div class="lim_bubble">';
											html += '		<div class="lim_time show_right">' + mytime + '</div>';
											html += '		<div class="lim_dot ">';
											html += '			<a href= "' + path + '" target="_blank">' + path.substring(path.lastIndexOf("/") + 1) + '</a>';
											html += '		</div>';
											html += '	</div>';
											html += '	<div class="lim_tale user_img">';
											html += '		<div id="radiusborder"></div>';
											html += '		<p class="call_me" title=""></p>';
											html += '	</div>';
											html += '</li>';
										}
										$(".container ul").append(html);

										var request = JSON.stringify({
											"method" : "IM_CCS_SendMsg",
											"uuid" : guid(),
											"openId" : openId,
											"msgId" : sessionId,
											"content" : path,
											"msgType" : msgType,
											"cTime" : new Date().getTime() + "",
										});
										console.log("上传", request);
										if (websocket.readyState == 1) {
											websocket.send(request);
										} else {
											localStorage.setItem("sendMsg" + openId, request);
										}
										location.href = "#topmaod";
										var spanBFs = document.getElementsByClassName("sp-bofan");
										$.each(spanBFs, function(i, span) {
											$(span).unbind("click").bind({
												click : function(event) {
													bf(event);
													event.stopPropagation();
												}
											});
										});
										$(".zzt").fadeOut();
										$("#speak").contents().find("#updatet").css({
											"background-color" : "#eee"
										});
										$("#speak").contents().find("#key").val("0");
										$('#imgPreview').css("display", 'block');
										/* 图片点击放大 */
										component();
										alertLog.close();
										// $(".container").scrollTop(
										// $(".container")[0].scrollHeight
										// );
										// showLog($(".container")[0].scrollHeight);
										setTimeout(function() {
											$(".container").scrollTop($(".container")[0].scrollHeight);
										}, 100);
									}
								},
								error : function(msg) {
									console.log('上传图片失败。错误信息如下：');
									console.log(msg);
									showLog("上传图片失败。");
									$("#submitimg").removeAttr("disabled");
									alertLog.close();
								}
							})
							// }
						}
					});

	/* 将一个符合URL格式的字符串变成链接 */
	function replaceURLWithHTMLLinks(text) {
		text = " "+text;
		var exp = /[^"|]((https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
		return text.replace(exp, "<a style='display:inline' href='$1'>$1</a>");
	}

	/**
	 * 接受到服务器推送的新消息(服务器发的消息)
	 */
	function getNewMsg(json) {
		// 成功回调函数
		//console.log("j",json);
		// return;
		var agentHeadImg = json["agentHeadImg"];
		var sessiontype = json["sessiontype"] || json["sessionType"];
		var agentUn;
		if (json["agentUn"]) {
			agentUn = json["agentUn"];
		} else {
			agentUn = "";
		}

		var uuid = json["uuid"];
		sessionStorage.setItem('uuid', uuid);// 用于下面的解决未解决
		var openId = json["openId"];
		//var openId = workno;
		var cnt = json["content"] || json["retMsg"];// 服务端返回的主内容
		// ||json["retMsg"]解决未解决的内容
		var st = json["sendTime"];// 服务端返回的时间

		// 只显示时分秒
		var regg = /([0-9]{1,2}:[0-9]{1,2})?(:[0-5]{0,1}[0-9]{1})/ig;
		//st = st.match(regg).join('');
		st = getTimes(parseInt(new Date().getTime()) + timeDiffccs).match(regg).join('');

		var msgtype = json["msgType"];// 服务端返回的类型 text/img...
		var html = "";
		// 头像路径
		var imgUrl = agentHeadImg ? agentHeadImg : sessiontype == 1 ? headImgUrl : agentUn ? agentHeadImgUrl : systemHeadImgUrl;
		console.log(cnt);
		if(typeof cnt == 'object'){
			cnt = JSON.stringify(cnt);
		}
		if (cnt != "" || cnt != null) {
			if(msgtype != 'news'){
				// 小I返回的，带有 解决未解决
				var regreg = new RegExp("(\\(|\\)|\\[|\\]|\\*|\\?|\\+|\\$|\\/)","g");
				var sessionExp = JSON.parse(sessionStorage.getItem('expjson'));
				if (json["agentUn"] == '' || json["agentUn"] == null) {//自动推送的信息
					if (sessionExp == null) {
						ajaxExpJsona([1,2],function(icons){
							var tStr_new= "(" +icons.elfcodeStr.replace(regreg,"\\$1")+")";
							tStr_new.replace(new RegExp("\\/","g"),"\\/");
							var regx_new = new RegExp(tStr_new,"g");
							cnt = cnt.replace(regx_new,function(word){
								if(expIcon.elfcodeStr.indexOf(word) > -1){//经典表情
									return '<img src="' + sessionExp.faceMap[word] + '" style="width:24px;height:24px;"/>';
								}else{
									return '<img src="' + sessionExp.faceMap[word] + '" style="width:30px;height:30px;"/>';
								}
							});
						});
						
					} else {
						var tStr= "(" +sessionExp.elfcodeStr.replace(regreg,"\\$1")+")";
						tStr.replace(new RegExp("\\/","g"),"\\/");
						var regx = new RegExp(tStr,"g");
						cnt = cnt.replace(regx,function(word){
							if(expIcon.elfcodeStr.indexOf(word) > -1){//经典表情
								return '<img src="' + sessionExp.faceMap[word] + '" style="width:24px;height:24px;"/>';
							}else{
								return '<img src="' + sessionExp.faceMap[word] + '" style="width:30px;height:30px;"/>';
							}
						});
					}
				} else {// 收到输入的信息
					if (sessionExp == null) {
						ajaxExpJsona([1,2],function(icons){
							var tStr_new= "(" +icons.elfcodeStr.replace(regreg,"\\$1")+")";
							tStr_new.replace(new RegExp("\\/","g"),"\\/");
							var regx_new = new RegExp(tStr_new,"g");
							cnt = cnt.replace(regx_new,function(word){
								if(expIcon.elfcodeStr.indexOf(word) > -1){//经典表情
									return '<img src="' + sessionExp.faceMap[word] + '" style="width:24px;height:24px;"/>';
								}else{
									return '<img src="' + sessionExp.faceMap[word] + '" style="width:45px;height:45px;"/>';
								}
							})
						});
						
					} else {
						var tStr= "(" +sessionExp.elfcodeStr.replace(regreg,"\\$1")+")";
						tStr.replace(new RegExp("\\/","g"),"\\/");
						var regx = new RegExp(tStr,"g");
						cnt = cnt.replace(regx,function(word){
							if(expIcon.elfcodeStr.indexOf(word) > -1){//经典表情
								return '<img src="' + sessionExp.faceMap[word] + '" style="width:24px;height:24px;"/>';
							}else{
								return '<img src="' + sessionExp.faceMap[word] + '" style="width:45px;height:45px;"/>';
							}
						})
					}
				}
			}
		}
		
		
		if (cnt.indexOf('<b>任意门</b>') > -1) {
			cnt = cnt.replace('<b>任意门</b>', '<a submit="芝麻开门" style="color:#0000ff;font-weight:bold;" id="artificial_man_css">任意门</a>');
		}
		if (cnt.indexOf('<a onclick="LIM.jumper();return false;" href="javascript:void(0)">任意门</a>') > -1) {
			cnt = cnt.replace('<a onclick="LIM.jumper();return false;" href="javascript:void(0)">任意门</a>', '<a submit="芝麻开门" style="color:#0000ff;font-weight:bold;" id="artificial_man_css">任意门</a>');
		}
		if (cnt.indexOf('点击这里') > -1) {
			var reg = new RegExp("()");
			cnt = cnt.replace(/(<a([^>]*)>)(点击这里)(<\/a([^>]*)>)/gi, '<a submit="芝麻开门" id="artificial_man_css">点击这里</a>');
		}

		if (msgtype == "image" || msgtype == "imgmsg") {
			console.log('服务器推送的类型是:image');

			html += '<li class="lim_operator clearfix">';
			html += '	<div class="lim_bubble">';
			html += '		<div class="lim_time show_left">' + st + '</div>';
			html += '		<div class="lim_dot ">';
			html += '			<div class="robotinfo">';
			html += '				<img class="djfd" style="height:100px;display:block;" src="' + cnt + '">';
			html += '			</div>';
			html += '		</div>';
			html += '	</div>';
			html += '	<div class="lim_tale">';
			html += '		<img src="' + imgUrl + '">';
			html += '		<div id="radiusborder"></div>';
			html += '		<p class="call_me" title="">' + agentUn + '</p>';
			html += '	</div>';
			html += '</li>';

			// 内容为文本
		} else if (msgtype == "text") {
			cnt = cnt.replace(/\\n/g, "<br/>");
			if (cnt.indexOf('img') != -1) {

			} else {
				// 将文本里面的超链接改为新窗口打开
				cnt = replaceURLWithHTMLLinks(cnt);
				var reg = new RegExp('(<a)(\\s)(.*?</a>)', 'gmi');
				cnt = cnt.replace(reg, '$1 target="_blank" $3');
			}
			// console.log('服务器推送的类型是:text',cnt);
			html += '<li class="lim_operator clearfix">';
			html += '	<div class="lim_bubble">';
			html += '		<div class="lim_time show_left">' + st + '</div>';
			html += '		<div class="lim_dot ">';
			html += '			<div class="robotinfo">' + cnt;
			html += '</div>';
			html += '		</div>';
			html += '	</div>';
			html += '	<div class="lim_tale">';
			html += '		<img src="' + imgUrl + '">';
			html += '		<div id="radiusborder"></div>';
			html += '		<p class="call_me" title="">' + agentUn + '</p>';
			html += '	</div>';
			html += '</li>';

			// 解决未解决返回
		} else if (json["method"] === "IM_CCS_RobotSolveRequestAck") {

			cnt = cnt.replace(/\\n/g, "<br/>");
			// console.log('服务器推送的类型是:text',cnt);

			html += '<li class="lim_operator clearfix">';
			html += '	<div class="lim_bubble">';
			html += '		<div class="lim_time show_left">' + st + '</div>';
			html += '		<div class="lim_dot ">';
			html += '			<div class="robotinfo">' + cnt;
			html += '</div>';
			html += '		</div>';
			html += '	</div>';
			html += '	<div class="lim_tale">';
			html += '		<img src="' + imgUrl + '">';
			html += '		<div id="radiusborder"></div>';
			html += '		<p class="call_me" title="">' + agentUn + '</p>';
			html += '	</div>';
			html += '</li>';

			// 内容为视频
		} else if (msgtype == "video" || msgtype == "shortvideo" || msgtype == "videomsg") {
			console.log('服务器推送的类型是:video');

			html += '<li class="lim_operator clearfix">';
			html += '	<div class="lim_bubble">';
			html += '		<div class="lim_time show_left">' + st + '</div>';
			html += '		<div class="lim_dot ">';
			html += '			<p class="robotinfo">';
			html += '				<div class="video-box" data-videourl="' + cnt + '">';
			html += '					<div class="zz"></div><video width="200" height="120"><source src="' + cnt + '" type="" media=""></source></video>';
			html += '				</div>';
			html += '			</p>';
			html += '		</div>';
			html += '	</div>';
			html += '	<div class="lim_tale">';
			html += '		<img src="' + imgUrl + '">';
			html += '		<div id="radiusborder"></div>';
			html += '		<p class="call_me" title="">' + agentUn + '</p>';
			html += '	</div>';
			html += '</li>';

			// 内容为音频
		} else if (msgtype == "voice" || msgtype == "musicmsg") {
			console.log('服务器推送的类型是:音频');

			html += '<li class="lim_operator clearfix">';
			html += '	<div class="lim_bubble">';
			html += '		<div class="lim_time show_left">' + st + '</div>';
			html += '		<div class="lim_dot ">';
			html += '			<div class="robotinfo">';
			var file = $("#file")[0].files[0];
			var filename = cnt.substring(cnt.lastIndexOf('.'));
			console.log("---filename----", filename);
			if (filename == '.mp3') {
				html += '<div class="zz"><audio class="audioM" src="' + cnt + '" data-level="1"  controls="controls" preload  hidden  data-key="1"></audio></div>';

				html += '<span class="sp-bofan" ><div class="audio-mp3" data-level="1" data-audiourl="' + cnt + '""></span></div>';
			} else {
				html += '<div class="audio-box" data-key="1" data-audiourl="' + cnt + '">';
				html += '</div>';
			}
			html += '			</div>';
			html += '		</div>';
			html += '	</div>';
			html += '	<div class="lim_tale">';
			html += '		<img src="' + imgUrl + '">';
			html += '		<div id="radiusborder"></div>';
			html += '		<p class="call_me" title="">' + agentUn + '</p>';
			html += '	</div>';
			html += '</li>';
		} else if (msgtype == 'file') {// 内容为文件(可以下载)
			html += '<li class="lim_operator clearfix">';
			html += '	<div class="lim_bubble">';
			html += '		<div class="lim_time show_left">' + st + '</div>';
			html += '		<div class="lim_dot ">';
			html += '			<div class="robotinfo fileurl"><a href= "' + cnt + '" target="_blank">' + cnt.substring(cnt.lastIndexOf("/") + 1) + '</a>';
			html += '</div>';
			html += '		</div>';
			html += '	</div>';
			html += '	<div class="lim_tale">';
			html += '		<img src="' + imgUrl + '">';
			html += '		<div id="radiusborder"></div>';
			html += '		<p class="call_me" title="">' + agentUn + '</p>';
			html += '	</div>';
			html += '</li>';
		}else if (msgtype == 'news') {//news类型
				try
				{
					/**cnt = cnt.substr(cnt.indexOf('['));
					var news_cnt = eval("(" + cnt + ")");**///
					//返回的是标准json格式 因此不用上面的解析
					var news_cnt = cnt;
					for (var key = 0; key < news_cnt.length; key++) {
						var description = news_cnt[key].description ? news_cnt[key].description : news_cnt[key].title;
						var title = news_cnt[key].title ? news_cnt[key].title : news_cnt[key].description;
						
						html += '<li class="lim_operator clearfix">';
						html += '	<div class="lim_bubble">';
						html += '		<div class="lim_time show_left">' + st + '</div>';
						html += '		<div class="lim_dot ">';
						html += '			<div class="robotinfo">';
						html += '<div class="news_type" style="display:block;" title="' + title + '"><a style="display:block;" href="' + news_cnt[key].url
								+ '" target="_blank"><img style="max-width:400px;max-height:400px;" src="' + news_cnt[key].picurl + '" /></a></div>';
						html += '<p style="max-width:400px;">' + description + '</p>';
						html += '			</div>';
						html += '		</div>';
						html += '	</div>';
						html += '	<div class="lim_tale">';
						html += '		<img src="' + imgUrl + '">';
						html += '		<div id="radiusborder"></div>';
						html += '		<p class="call_me" title="">' + agentUn + '</p>';
						html += '	</div>';
						html += '</li>';

					}
				}
				catch(err)
				  {
				  //在这里处理错误
				   cnt = cnt;
				  }
		}
		$(".container ul").append(html);
		var m_messageHeight = $('.m-message').height()
		var lim_operatorHeight = $('.m-message .lim_operator:last').height() + 25;//当条信息高度,25是padding
		if(lim_operatorHeight > m_messageHeight){
			setTimeout(function(){
				$('.m-message').scrollTop($('.m-message>ul').height() - lim_operatorHeight);
			},100);
		}
		/* 图片点击放大 */
		component();

		$('.lim_operator').off().on('click', '.lim_dot a', function() {
			if ($(this).attr('disabled')) {
				return false;
			}
			if ($(this).attr('submit') && $(this).text() != '解决' && $(this).text() != '未解决') {
				sendMsg($(this).attr('submit'));// 调用发送信息方法 传入当前的文字给服务端
			}

			if ($(this).text() === '人工咨询' || $(this).text() === '任意门') {
				$('#artificial_css,#artificial_man_css').addClass('jj_btn');

				$('.jj_btn').attr("disabled", true);
			}

			if ($(this).text() === '解决') {
				$('#solve a').addClass('jj_btn');
				var request = JSON.stringify({
					"uuid" : guid(),
					"method" : "IM_CCS_RobotSolveRequest",
					"openId" : openId,
					"flag" : 1,// 1 是解决
					"arg" : $(this).attr('submit'),
				});
				websocket.send(request);

			}
			if ($(this).text() === '未解决') {
				$('#solve a').addClass('jj_btn');
				var request = JSON.stringify({
					"uuid" : guid(),
					"method" : "IM_CCS_RobotSolveRequest",
					"openId" : openId,
					"flag" : 2,// 2 是未解决
					"arg" : $(this).attr('submit'),
				});
				websocket.send(request);

			}
			$('.jj_btn').attr("disabled", true);
		})
		$(".container").scrollTop($(".container")[0].scrollHeight);
		var spanBFs = document.getElementsByClassName("sp-bofan");
		$.each(spanBFs, function(i, span) {
			$(span).unbind("click").bind({
				click : function(event) {
					bf(event);
					event.stopPropagation();
				}
			});
		});
	}
});
var LIM = {
	jumper:function(){
		sendMsg('人工');
	}
}
// 加载P4页面
function p4Iframe(title, url) {
	console.log('111111111111111111111111', title);
	var html_title = '<li title="热点服务" name="热点服务" class="">' + '<p class="activityTabTitle">热点服务</p>' + '<p class="activityTabCloseBtn"></p>' + '</li>' + '<li title="' + title + '" name="' + title
			+ '" class="active">' + '<p class="activityTabTitle">' + title + '</p>' + '<p class="activityTabCloseBtn">' + '<a href="#" onclick=tabClose("' + title + '");>'
			+ '<img style="border:none;display:block;" src="./images/mz/x.png" width="5" height="5">' + '</a>' + '</p>' + '</li>';
	var html_url = '<div id="热点服务"  class="iframetabDiv">'
			+ '<iframe frameborder="0" marginheight="0" framespacing="0" marginwidth="0" src="./mz_page.html" allowtransparency="true" scrolling="auto"></iframe>' + '</div>' + '<div id="' + title
			+ '" name="' + title + '" class="iframetabDiv active">' + '<iframe frameborder="0" marginheight="0" framespacing="0" marginwidth="0" src="' + url
			+ '" allowtransparency="true" scrolling="auto"></iframe>' + '</div>';
	$('.contentUl #tab').empty().append(html_title);
	$('#tab_banner').empty().append(html_url);
}

/* 点击加载更多消息 */
var oneClick = true;
$(".jiaz button").click(function() {
	if (oneClick) {
		localStorage.setItem("begTime", new Date().getTime());
		oneClick = false;
	}
	var request = JSON.stringify({
		"uuid" : guid(),
		"method" : "IM_CCS_RequestHisMsg",
		"openId" : openId,
		"begTime" : localStorage.getItem("begTime"),
		"endTime" : null,
		"pageIndex" : pageIndex
	});
	websocket.send(request);
	// console.log("2333",request);
})

function showLog(msg, w, t) {
	$.messager.show({
		title : '提示',
		width : w || 200,
		height : 100,
		timeout : t || 1000,
		showType : 'slide',
		msg : msg,
		style : {
			left : ($(window).width() - 200) / 2, // 与左边界的距离
			top : ($(window).height() - 100) / 2
		// 与顶部的距离
		}
	});
}

// mp3播放的点击事件
function bf(obj) {
	if (obj) {
		var audioobj = $(obj.currentTarget).prev().children(".audioM"); // 查找当前点击的span对象的前一个兄弟标签里面的class为audioM的对象
		if (audioobj) {
			var audio = audioobj.get(0);
			if (audio !== null) {

				if (audio.paused) {
					audio.play();// audio.play();// 这个就是播放
					// 获取你当前鼠标点击的对象
					$(obj.currentTarget).removeClass("pause").addClass("play");
				} else {
					audio.currentTime = 0;
					audio.pause();// 这个就是暂停
					$(obj.currentTarget).removeClass("play").addClass("pause");
				}
			}
		}

	}
}

// 生成UUID
function guid() {
	function S4() {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	}

	return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
}

function getLocalTime(nS) {
	return new Date(parseInt(nS) * 1).toLocaleString().substr(0, 18)
}

// $('#title').html(username);

$('#exit').click(function() {
	try {
		parent.closeChatframe();
	} catch (e) {
		console.log(e);
		if (confirm("您确定要关闭本页吗？")) {
			closewin();
		}

	}
})
function getTime(nS) {
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

	return year + '/' + mon + '/' + day + ' ' + hours + ':' + minu + ':' + sec;
}
function closewin() {
	if (navigator.userAgent.indexOf("Firefox") != -1 || navigator.userAgent.indexOf("Chrome") != -1) {
		window.location.href = "about:blank";
		window.close();
	} else {
		window.opener = null;
		window.open("", "_self");
		window.close();
	}
}
setTimeout(function() {
	$(".container").scrollTop($(".container")[0].scrollHeight);
}, 200);
/**hotkeys('enter', function(e) {
	keydown()
});**/
//评价点击
$('#openEvaluate').click(function(){
	layer.open({
		type : 2,
		area : [ '500px', '700px' ],
		fixed : false, // 不固定
		scrollbar : false,
		title : false,
		closeBtn : 0,
		content : 'Satisfaction.html?'+ (new Date()).getTime() +'&openId=' + openId + '&nickName=' +nickName
	});
})