function getTimes(nS) {
	console.log("传进来的时间梭为getTimes",nS);
	var date = new Date();
	if (nS != null) {
		date = new Date(parseInt(nS));
	}
	var year = date.getFullYear();
	var mon = date.getMonth() + 1;
	var day = date.getDate();
	var hours = date.getHours();
	var minu = date.getMinutes();
	var sec = date.getSeconds();
	if (minu < 10) {
		minu = "0" + minu;
	}
	if (sec < 10) {
		sec = "0" + sec;
	}
	return year + '/' + mon + '/' + day + ' ' + hours + ':' + minu + ':' + sec;
}
// 统计用户 访问网站步骤记录
var tjSecond = 0;
var tjRandom = 0;
window.setInterval(function () {
	tjSecond ++;
}, 1000);
// 随机数
tjRandom = (new Date()).getTime();
// 用户第一次访问页面记录部分数据
window.onload = function () {
	var tjArr = localStorage.getItem("jsArr") ? localStorage.getItem("jsArr") : '[]';
	var dataArr = {
		'tjRd' : tjRandom,
		'url' : location.href,
		'refer' : getReferrer()
	};
	tjArr = eval('(' + tjArr + ')');
	tjArr.push(dataArr);
	var tjArr1= JSON.stringify(tjArr);
	localStorage.setItem("jsArr", tjArr1);
	console.log("tjArr1",tjArr1);
	console.log("tjRandom",tjRandom);


};
// 用户继续访问根据上面提供的key值补充数据
window.onbeforeunload = function() {
	var tjArrRd = eval('(' + localStorage.getItem("jsArr") + ')');
	var tjI = tjArrRd.length - 1;
	if(tjArrRd[tjI].tjRd == tjRandom){
		tjArrRd[tjI].time = tjSecond;
		tjArrRd[tjI].timeIn = Date.parse(new Date()) - (tjSecond * 1000);
		tjArrRd[tjI].timeOut = Date.parse(new Date());
//            console.log("2333",tjArrRd[tjI].timeOut);
		var tjArr1= JSON.stringify(tjArrRd);
		localStorage.setItem("jsArr", tjArr1);

	}
};

function getReferrer() {
	var referrer = '';
	try {
		referrer = window.top.document.referrer;
	} catch(e) {
		if(window.parent) {
			try {
				referrer = window.parent.document.referrer;
			} catch(e2) {
				referrer = '';
			}
		}
	}
	if(referrer === '') {
		referrer = document.referrer;
	}
	return referrer;
}
