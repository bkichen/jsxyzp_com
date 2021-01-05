!function($,global){$.fn.extend({industrySelect:function(settings,indData){if(!indData||indData.length==0){alert("初始化数据失败");return}var doc=$(global.document),defaultSetting={container:"#container",maskDiv:'<div class="bas_s_mask" style="position:fixed;height:100%;width:100%;background: #000;left:0;top:0;opacity:0.5;z-index:98;filter: progid:DXImageTransform.Microsoft.Alpha(opacity=50); -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(opacity=50)";"></div>',holder:"#industry-list",selHolder:"#industry-select-list",searchInput:"#searchVal",searchButton:"#searchAct",selNum:"#selNum",totalNum:"#totalNum",resetButton:"#resetAct",clearLink:"#clearSelected",cancelLink:".cancelLink",getAllValues:"#getAllValues",cancelSelect:"#cancelSelect",maxSelected:5,popTitle:"请选择"},letter=_.templateSettings.escape.toString().substring(2,3);if(letter=="{"){defaultSetting.lineTmpl='<li title="{%= value %}"><input class="sel" type="{%= type %}" name="industrySelect" id="{%= id %}" />{%= value %}</li>';defaultSetting.selLineTmpl='<li><a class="cancelLink" href="javascript:void(0)" clId="{%= id %}">X</a>{%= value %}</li>';defaultSetting.popContent='<div class="industrySelectWrap" id="industryWrap"><h5 class="headTitle">{%= popTitle %}</h5><div id="container" class="contentContainer"><input type="text" id="searchVal" class="searchTxt" /><a href="javascript:void(0)" class="bas_btn_canc" id="searchAct">搜索</a><a href="javascript:void(0)" class="bas_btn_canc" id="resetAct">重置</a><ul class="industryList" id="industry-list"></ul><p><a class="clearSelected" href="javascript:void(0)" id="clearSelected">清空</a>已选择 <span id="selNum">x</span> / <span id="totalNum">x</span> 个：</p><ul class="industrySelectList" id="industry-select-list"></ul><div class="buttonsArea"><a href="javascript:void(0)" class="bas_btn_save" id="getAllValues">确定</a><a href="javascript:void(0)" class="bas_btn_canc" id="cancelSelect">取消</a></div></div></div>'}else{defaultSetting.lineTmpl='<li title="<%= value %>"><input class="sel" type="<%= type %>" name="industrySelect" id="<%= id %>" /><%= value %></li>';defaultSetting.selLineTmpl='<li><a class="cancelLink" href="javascript:void(0)" clId="<%= id %>">X</a><%= value %></li>';defaultSetting.popContent='<div class="industrySelectWrap" id="industryWrap"><h5 class="headTitle"><%= popTitle %></h5><div id="container" class="contentContainer"><input type="text" id="searchVal" class="searchTxt" /><a href="javascript:void(0)" class="bas_btn_canc" id="searchAct">搜索</a><a href="javascript:void(0)" class="bas_btn_canc" id="resetAct">重置</a><ul class="industryList" id="industry-list"></ul><p><a class="clearSelected" href="javascript:void(0)" id="clearSelected">清空</a>已选择 <span id="selNum">x</span> / <span id="totalNum">x</span> 个：</p><ul class="industrySelectList" id="industry-select-list"></ul><div class="buttonsArea"><a href="javascript:void(0)" class="bas_btn_save" id="getAllValues">确定</a><a href="javascript:void(0)" class="bas_btn_canc" id="cancelSelect">取消</a></div></div></div>'}$.extend(defaultSetting,settings);this.initialize=function(){var self=this,indHTML="";_.each(indData,function(indu){indHTML+=_.template(defaultSetting.lineTmpl)({id:indu.Value,value:indu.Key,type:defaultSetting.maxSelected==1?"radio":"checkbox"})});this.holderHtml=indHTML;$(this).click(function(){self.showSelWindow();self.syncSelIds()})};this.bindActions=function(){this.pophtml.delegate(defaultSetting.searchButton,"click",_.bind(this.search,this));this.pophtml.delegate(defaultSetting.searchInput,"keyup",_.bind(function(e){e.keyCode==13&&this.search()},this));this.pophtml.delegate(defaultSetting.resetButton,"click",_.bind(this.reset,this));this.pophtml.delegate(defaultSetting.clearLink,"click",_.bind(this.clearSelect,this));this.pophtml.delegate(defaultSetting.holder+" input","click",_.bind(function(e){this.singleToggle(e)},this));this.pophtml.delegate(defaultSetting.cancelLink,"click",_.bind(function(e){this.delSingleSelect(e)},this));this.pophtml.delegate(defaultSetting.getAllValues,"click",_.bind(this.getAllValues,this));this.pophtml.delegate(defaultSetting.cancelSelect,"click",_.bind(this.closePopUp,this))};this.syncSelIds=function(){var selIds=this.tempSelIds.sort(function(a,b){return a-b});doc.find(defaultSetting.holder).find("input").prop("checked",false);_.each(selIds,function(id){doc.find(defaultSetting.holder).find("#"+id).prop("checked",true)});var selectedInfo=this.findSelInfo(selIds),selHTML="";_.each(selectedInfo,function(indu){selHTML+=_.template(defaultSetting.selLineTmpl)({id:indu.Value,value:indu.Key})});doc.find(defaultSetting.selNum).html(selIds.length);doc.find(defaultSetting.selHolder).html(selHTML)};this.findSelInfo=function(selIds){var selData=[];_.each(indData,function(ind){_.contains(selIds,ind.Value)&&selData.push(ind)});return selData};this.showSelWindow=function(){var self=this,tempSel=[];if($(this).next("input[type=hidden]").val().length>0){var inputVal=$(this).next("input[type=hidden]").val().split(",");_.each(inputVal,function(ipt){tempSel.push(ipt)})}this.tempSelIds=tempSel;this.pophtml=$(defaultSetting.maskDiv+_.template(defaultSetting.popContent)({popTitle:defaultSetting.popTitle}));this.bindActions();var currentDepCode=$("#RecruitmentOffer_DepartmentId").attr("code"),indHTML="";_.each(indData,function(indu){var depList=indu.ObjectDataId?indu.ObjectDataId.split(","):[];if(indu.ObjectDataId==null||!currentDepCode||currentDepCode&&depList.indexOf(currentDepCode)>-1)indu.isCurrentDep=true;else indu.isCurrentDep=false});_.each(indData,function(indu){if(indu.isCurrentDep)indHTML+=_.template(defaultSetting.lineTmpl)({id:indu.Value,value:indu.Key,type:defaultSetting.maxSelected==1?"radio":"checkbox"})});this.holderHtml=indHTML;doc.find("body").append(this.pophtml);doc.find(defaultSetting.holder).html(this.holderHtml);doc.find(defaultSetting.totalNum).html(defaultSetting.maxSelected)};this.search=function(){var searchStr=this.valueTrimBr(doc.find(defaultSetting.searchInput).val()),indHTML="",currentDepCode=$("#RecruitmentOffer_DepartmentId").attr("code");_.each(indData,function(indu){var depList=indu.ObjectDataId?indu.ObjectDataId.split(","):[];if(indu.ObjectDataId==null||!currentDepCode||currentDepCode&&depList.indexOf(currentDepCode)>-1)indu.isCurrentDep=true;else indu.isCurrentDep=false});_.each(indData,function(indu){if(indu.Key.indexOf(searchStr)>-1&&indu.isCurrentDep)indHTML+=_.template(defaultSetting.lineTmpl)({id:indu.Value,value:indu.Key,type:defaultSetting.maxSelected==1?"radio":"checkbox"})});doc.find(defaultSetting.holder).html(indHTML.length>0?indHTML:'<span class="noRecord">没有匹配的项</span>');this.syncSelIds()};this.reset=function(){doc.find(defaultSetting.searchInput).val("");this.search()};this.clearSelect=function(){this.tempSelIds=[];this.syncSelIds()};this.singleToggle=function(e){var id=$(e.currentTarget).attr("id"),chk=$(e.currentTarget).prop("checked"),hasSelectedIds=this.tempSelIds;if(defaultSetting.maxSelected==1)this.tempSelIds=[id];else{if(hasSelectedIds.length>=defaultSetting.maxSelected&&chk)alert("最多选择"+defaultSetting.maxSelected+"项");else if(chk)hasSelectedIds.push(id);else hasSelectedIds=this.delItemInArray(hasSelectedIds,id);this.tempSelIds=hasSelectedIds}this.syncSelIds()};this.delSingleSelect=function(e){var id=$(e.currentTarget).attr("clid"),hasSelectedIds=this.tempSelIds,hasSelectedIds=this.delItemInArray(hasSelectedIds,id);this.tempSelIds=hasSelectedIds;this.syncSelIds()};this.getAllValues=function(){var self=this,hasSelectedIds=this.tempSelIds,selectedInfo=this.findSelInfo(hasSelectedIds),selValues=[];_.each(selectedInfo,function(indu){selValues.push(indu.Key)});$(this).val(selValues.join(", "));$(this).next("input[type=hidden]").val(hasSelectedIds.join(","));this.closePopUp()};this.closePopUp=function(){this.pophtml.remove()};this.valueTrimBr=function(str){return str.replace(/(^\s*)|(\s*$)/g,"").replace(/(^[\s\u3000]*)|([\s\u3000]*$)/g,"").replace(/\n/g," ")};this.delItemInArray=function(array,item){var idx=_.indexOf(array,item);return idx<0?void 0:array.slice(0,idx).concat(array.slice(idx+1,array.length))};this.initialize()}})}(jQuery,window.top)
