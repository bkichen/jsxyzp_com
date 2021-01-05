var timer;      // 计时器
var flag = true;
var dayNum1 = document.getElementById("day-num1");
var dayNum2 = document.getElementById("day-num2");
var hoursNum1 = document.getElementById("hours-num1");
var hoursNum2 = document.getElementById("hours-num2");
var minutesNum1 = document.getElementById("minutes-num1");
var minutesNum2 = document.getElementById("minutes-num2");
var mask = document.getElementById("mask");                             // 遮罩
var modalFrameList = document.getElementsByClassName("modal-frame");    // 弹窗列表
// 获取页面宽度
var offsetWidth =  document.body.offsetWidth || document.documentElement.offsetWidth;
var scrollTop                                                           // 获取滚动条到顶部的距离
var flag2 = true;

(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||    // name has changed in Webkit
                                      window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}());


// 显示弹窗
function showModalFrame(index){
    $("#mask").css('display','block');
    $("#mask").animate({
        opacity:"0.5",
    });
    switch (index) {
        case 0:
            $("#modal-frame1").css('visibility','visible');
            $("#modal-frame1").animate({
                opacity: "1",
            });
            break;
        case 1:
            $("#modal-frame2").css('visibility','visible');
            $("#modal-frame2").animate({
                opacity: "1",
            });
            break;
        case 2:
            $("#modal-frame3").css('visibility','visible');
            $("#modal-frame3").animate({
                opacity: "1",
            });
            break;
        case 3:
            $(".loading-box").css('visibility','visible');
            $("#modal-frame4").css('visibility','visible');
            $("#modal-frame4").animate({
                opacity: "1",
            },function(){
                $(".swiper-box").css('visibility','visible');
                $(".loading-box").css('visibility','hidden');
            });
            break;
        case 4:
            $("#modal-frame5").css('visibility','visible');
            $("#modal-frame5").animate({
                opacity: "1",
            });
            break;
        case 5:
            $("#modal-frame6").css('visibility','visible');
            $("#modal-frame6").animate({
                opacity: "1",
            });
            break;
        default:
            break;
    }
}

// 关闭弹窗
function closeModalFrame(index){
    $("#mask").animate({
        opacity:"0",
    },function(){
        $("#mask").css('display','none');
    });
    switch (index) {
        case 0:
            $("#modal-frame1").animate({
                opacity:"0",
            },function(){
                $("#modal-frame1").css('visibility','hidden');
            });
            break;
        case 1:
            $("#modal-frame2").animate({
                opacity:"0",
            },function(){
                $("#modal-frame2").css('visibility','hidden');
            });
            break;
        case 2:
            $("#modal-frame3").animate({
                opacity:"0",
            },function(){
                $("#modal-frame3").css('visibility','hidden');
            });
            break;
        case 3:
            $(".swiper-box").css('visibility','hidden');
            $("#modal-frame4").animate({
                opacity:"0",
            },function(){
                $("#modal-frame4").css('visibility','hidden');
            });
            break;
        case 4:
            $("#modal-frame5").animate({
                opacity:"0",
            },function(){
                $("#modal-frame5").css('visibility','hidden');
            });
            break;
        case 5:
            $("#modal-frame6").animate({
                opacity:"0",
            },function(){
                $("#modal-frame6").css('visibility','hidden');
            });
            break;
        default:
            break;
    }
}


// 倒计时定时器
timer = requestAnimationFrame(function fn(){
    var targetTime = new Date("2019/06/16 00:00:00");
    var today = new Date();
    var time = targetTime - today;

    if(time<=0){
        cancelAnimationFrame(timer);
        return;
    }

    // 天
    var Day = (time / 3600000) / 24;

    Day = Math.floor(Day);
    if(Day<10){
        Day = "0" + Day;
    }
    // 小时
    var Hours = time % (60 * 60 * 1000 * 24) / (60 * 60 * 1000);
    Hours = Math.floor(Hours);
    if(Hours<10){
        Hours = "0" + Hours;
    }
    // 分钟
    var Minutes = time % (60 * 60 * 1000) / (60 * 1000);
    Minutes = Math.floor(Minutes);
    if(Minutes<10){
        Minutes = "0" + Minutes;
    }
    // 秒
    var Seconds = time % (60 * 1000) / 1000;
    Seconds = Math.floor(Seconds);
    if(Seconds<10){
        Seconds = "0" + Seconds;
    }

    if(flag){
        flag = false;
        var dayList = Day.toString().split("");
        dayNum1.src = "http://stcms.beisen.com/cmsportal/111111/111111_themes_boenew_challenge_" + dayList[0] + ".png?" + today.getTime();
        dayNum2.src = "http://stcms.beisen.com/cmsportal/111111/111111_themes_boenew_challenge_" + dayList[1] + ".png?" + today.getTime();
    
        var hoursList = Hours.toString().split("");
        hoursNum1.src = "http://stcms.beisen.com/cmsportal/111111/111111_themes_boenew_challenge_" + hoursList[0] + ".png?" + today.getTime();
        hoursNum2.src = "http://stcms.beisen.com/cmsportal/111111/111111_themes_boenew_challenge_" + hoursList[1] + ".png?" + today.getTime();
    
        var minutesList = Minutes.toString().split("");
        minutesNum1.src = "http://stcms.beisen.com/cmsportal/111111/111111_themes_boenew_challenge_" + minutesList[0] + ".png?" + today.getTime();
        minutesNum2.src = "http://stcms.beisen.com/cmsportal/111111/111111_themes_boenew_challenge_" + minutesList[1] + ".png?" + today.getTime();
    }

    if(Number(Seconds)<=2 || Number(Seconds)>=58){
        var dayList = Day.toString().split("");
        dayNum1.src = "http://stcms.beisen.com/cmsportal/111111/111111_themes_boenew_challenge_" + dayList[0] + ".png?" + today.getTime();
        dayNum2.src = "http://stcms.beisen.com/cmsportal/111111/111111_themes_boenew_challenge_" + dayList[1] + ".png?" + today.getTime();
    
        var hoursList = Hours.toString().split("");
        hoursNum1.src = "http://stcms.beisen.com/cmsportal/111111/111111_themes_boenew_challenge_" + hoursList[0] + ".png?" + today.getTime();
        hoursNum2.src = "http://stcms.beisen.com/cmsportal/111111/111111_themes_boenew_challenge_" + hoursList[1] + ".png?" + today.getTime();
    
        var minutesList = Minutes.toString().split("");
        minutesNum1.src = "http://stcms.beisen.com/cmsportal/111111/111111_themes_boenew_challenge_" + minutesList[0] + ".png?" + today.getTime();
        minutesNum2.src = "http://stcms.beisen.com/cmsportal/111111/111111_themes_boenew_challenge_" + minutesList[1] + ".png?" + today.getTime();
    }

    setTimeout(function(){
        timer = requestAnimationFrame(fn);
    },1000)
});


window.onload = function() {
    // 轮播图
    var mySwiper1 = new Swiper ('.swiper-container1', {
        direction: 'horizontal',
        loop: true,
        lazyLoading : true,
        nextButton: '.swiper-button-next1',
        prevButton: '.swiper-button-prev1',
    })
    var mySwiper2 = new Swiper ('.swiper-container2', {
        direction: 'horizontal',
        loop: true,
        lazyLoading : true,
        nextButton: '.swiper-button-next2',
        prevButton: '.swiper-button-prev2',
    })
    var mySwiper3 = new Swiper ('.swiper-container3', {
        direction: 'horizontal',    
        loop: true,     
        lazyLoading : true,
        nextButton: '.swiper-button-next3',
        prevButton: '.swiper-button-prev3',
    })
        
    var mySwiper4 = new Swiper ('.swiper-container4', {
        direction: 'horizontal',    
        loop: true,     
        lazyLoading : true,
        nextButton: '.swiper-button-next4',
        prevButton: '.swiper-button-prev4',
    })

    $('.arrow-left1').on('click', function(e){
        e.preventDefault()
        mySwiper1.swipePrev()
    })
    $('.arrow-right1').on('click', function(e){
        e.preventDefault()
        mySwiper1.swipeNext()
    })
    
    $('.arrow-left2').on('click', function(e){
        e.preventDefault()
        mySwiper2.swipePrev()
    })
    $('.arrow-right2').on('click', function(e){
        e.preventDefault()
        mySwiper2.swipeNext()
    })

    $('.arrow-left3').on('click', function(e){
        e.preventDefault()
        mySwiper3.swipePrev()
    })
    $('.arrow-right3').on('click', function(e){
        e.preventDefault()
        mySwiper3.swipeNext()
    })

 $('.arrow-left4').on('click', function(e){
        e.preventDefault()
        mySwiper4.swipePrev()
    })
    $('.arrow-right4').on('click', function(e){
        e.preventDefault()
        mySwiper4.swipeNext()
    })

}

function entrance(){
    window.location.href="http://boe.yuegekeji.cn/login"; 
    //window.location.href="https://www.wjx.top/jq/38727185.aspx"; 
}

if(offsetWidth>=1366){
    runTips();
}
document.addEventListener("scroll",fangdou(function(){
    scrollTop = document.body.scrollTop || document.documentElement.scrollTop;    // 获取滚动条
    if(scrollTop>=10){
        flag2 = false;
    }else{
        flag2 = true;
    }
},100));

$(".count-down-box").css('width','70%');
function runTips() {  
    $("#bottom-tips").animate({
        opacity: "1",
        bottom: "5%"
    },900,function () { 
        $("#bottom-tips").css('opacity','0');
        $("#bottom-tips").css('bottom','10%');
        if(flag2){
            runTips();
        }
    })
}

// 防抖
function fangdou(callback,delay){
    // 定时器
    var timer1;
    return function(){
        if(timer1){ // 引用外部函数的timer
            clearTimeout(timer1);
        }
        timer1 = setTimeout(function(){
            // 触发函数
            callback.apply(this,arguments);
        },delay);
    }
}