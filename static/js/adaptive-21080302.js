/**
 * Created by gzbugu on 2016-04-07.
 */
function adaptive(bgDiv,data){
    this.$bgDiv=bgDiv;
    this.$win_height=$(window).height();
    this.$win_width=$(window).width();
    this.$hnum=data.lessHeight||0;
    this.$wnum=data.lessWidth||0;
    if(this.$wnum==0){
        this.$bgDiv.css({"height":(this.$win_height-this.$hnum)+"px"});
    }else{
        this.$bgDiv.css({"height":(this.$win_height-this.$hnum)+"px","width":(this.$win_width-this.$wnum)+"px"});
    }
    $(window).resize(function(){
        this.$bgDiv=bgDiv;
        this.$win_height=$(window).height();
        this.$win_width=$(window).width();
        this.$hnum=data.lessHeight||0;
        this.$wnum=data.lessWidth||0;
        if(this.$wnum==0){
            this.$bgDiv.css({"height":(this.$win_height-this.$hnum)+"px"});
        }else{
            this.$bgDiv.css({"height":(this.$win_height-this.$hnum)+"px","width":(this.$win_width-this.$wnum)+"px"});
        }
    })
}
//使用
//$.adaptiveWH($('.manual-content'),{lessHeight:61});

jQuery.extend({
    adaptiveWH:function(bgDiv,data){
        return new adaptive(bgDiv,data);
    }
});
