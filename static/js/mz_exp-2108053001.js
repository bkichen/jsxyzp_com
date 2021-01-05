var expIcon={
	"elfcodeStr" :"/:X-)|/::)|&5u:1f381|&5u:1f389|&5u:1f47b|&5u:1f4aa|&5u:1f602|&5u:1f604|&5u:1f612|&5u:1f614|&5u:1f61d|&5u:1f631|&5u:1f633|&5u:1f637|&5u:1f64f|/:!!!|/:#-0|/:fade|/:&-\\(|/:&>|/:,@!|/:,@-D|/:,@@|/:,@P|/:,@f|/:,@o|/:,@x|/:8\\*|/:8-\\)|/::!|/::\\$|/::\\(|/::\\)|/::\\*|/::+|/::,@|/::-O|/::-S|/::8|/::<|/::>|/::@|/::B|/::D|/::L|/::O|/::P|/::Q|/::T|/::X|/::Z|/::d|/::g|/::~|/:<&|/:<@|/:<L>|/:<O>|/:<W>|/:?|/:@\\)|/:@>|/:@@|/:@x|/:B-)|/:P-(|/:B-\\)|/:P-\\(|/:X-\\)|/:bad|/:basketb|/:beer|/:bome|/:break|/:bye|/:cake|/:circle|/:coffee|/:dig|/::*|/:eat|:fade|/:footb|/:gift|/:handclap|/:heart|/:hiphot|/:hug|/:jj|/:jump|/:kiss|/:kn|/:kotow|/:ladybug|/:li|/:love|/:lvu|/:moon|/:no|/NO|/:oY|/:ok|/OK|/:oo|/:pd|/:pig|/:rose|/:shake|/:share|/:shit|/:showlove|/:skip|/:strong|/:sun|/:turn|/:v|/:weak|/:wipe|/:xx|/:&-(|/:8*|/:8-)|/::$|/::(|/:@)|[大哭]|[发呆]|[囧]|[困]|[大哭]|[尴尬]|[快哭了]|[鄙视]" 
}

//获取表情数据并进行处理
var  ajaxExpJsona=function(type,callback){
	// 缓存表情数据
	var expIcon={
		faceMap:{},
		elfcodeStr:"",
		showMsg:"",
		showImg:"",
	};
	// 缓存已经请求表情的code
	var cacheCodeArr=[];
	// 缓存已经请求表情的类型
	var cacheType={};

	//将表情符号进行转码方便正则匹配
	function toAsciiString(str){
		var len=str.length;
		var result="";
		for(var i=0;i<len;i++){
			result+=str.charCodeAt(i);
		}
		return result;
	}

	// 处理请求的表情数据
	var processExpJson=function(json,reqType){
		var codeArr=json.elfData.showCode.split('|');//表情编码
		var ImgArr=json.elfData.showImg.split('|');
		var _arr=[];
		for(var i=0;i<codeArr.length;i++){
			var code=codeArr[i];
			/**var reg=/\[.*?\]/g;
			if(!reg.test(code)){
				code="["+code+"]";
			}**/
			_arr.push(code);
			expIcon.faceMap[code]='./upload/ExpImages/'+ImgArr[i];
		}
		expIcon.showMsg=json.elfData.showMsg;
		expIcon.showImg=json.elfData.showImg;
		cacheCodeArr=cacheCodeArr.concat(_arr);
		expIcon.elfcodeStr=cacheCodeArr.join('|');
		//expIcon.elfcodeStr=expIcon.elfcodeStr.replace(/[~?)>*!$(+<@]/g,function(s){ return '\\'+s});
		cacheType[reqType]=reqType;
		//console.log(expIcon);
		// 判断ajaxExpJsona请求的类型是数字或数组,以分开处理回调
		if(typeof type==='number'){
			typeof callback==='function' && callback(expIcon);
		}else if(Array.isArray(type)){
			// ajaxExpJsona请求的类型数组,需要判断请求的类型是否都已经得到
			var isgot=true;
			for(var i=0;i<type.length;i++){
				if(!cacheType[type[i]]){
					isgot=false;
					break;
				}
			}
			
			// 只要有一个类型没有获取,就不能调用回调
			if(isgot){
				typeof callback==='function' && callback(expIcon);
			}
		}
		
		//console.log("processExpJson expIcon:",expIcon);
	};

	
	
	// 发起请求
	var getExp=function(item){
		$.ajax({
			type:"post",
			url:'webim_api/exp/getVisitorExpressionList',
			async: false,
			data:{
				'originType':'WEB',
				'elfType':item
			},
			dataType:'json',
			success:function(json){
				//console.log('原始表情数据',json);
				// 传入表情数据和请求的类型参数
				processExpJson(json,item);
			},
			error:function(){}
		});
	}
	
	if(typeof type==='number'){
		// 判断表情是否已经请求,是则调用回调方法,并结束请求
		if(cacheType[type]){
			typeof callback==='function' && callback(expIcon);
			return 
		}
		getExp(type);
	}else if(Array.isArray(type)){
		// 判断表情是否已经请求,是则调用回调方法,并结束请求
		var isgot=true;//判断数组中的表情类型是否都已经请求
		var needGetType=[];// 缓存没有请求的表情类型
		for(var i=0;i<type.length;i++){
			if(!cacheType[type[i]]){
				isgot=false;
				needGetType.push(type[i]);
			}
		}
		if(!isgot){
			// 有表情没有请求,发起请求
			needGetType.map(function(item){
				getExp(item);
			});			
		}else{
			// 都已经请求,返回表情
			typeof callback==='function' && callback(expIcon);
		}
	}else{
		//Error
	}
}

ajaxExpJsona([1,2],function(icons){
	sessionStorage.setItem("expjson", JSON.stringify(icons));
})
