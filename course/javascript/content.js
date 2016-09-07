/**
 * Created by 付青柳 on 2016/3/27.
 */
//取得相应cookie
function getCookie(cookieName){
    var cookies = (document.cookie).split("; ");

    for(var i= 0, len=cookies.length; i<len; i++){
        var buff = cookies[i].split("=");
        if(buff[0] === cookieName){
            return buff[1];
        }
    }
}

 //登录状态验证
$(function(){
    $.ajax({
        type: "GET",
        url: "judge.do",
        data: {
            "id": getCookie("id")
        },
        success: function(data){
            var logData = JSON.parse(data);
            if((logData.result === true) && (getCookie("status") === logData.result)){
            }else{
                window.location.href = "index.html";
            }
        }
    });
});


//获取通知
$(function(){
    var $frag = $(document.createDocumentFragment());
    var $notice = $("#notice");

    //把数据添加到通知栏下
    function addData(data){
        var messageData = eval(data);

        if(data.length === 0){
            $frag.append("<li id='noMessage'>暂时没有通知哦!</li>");
        }else{
            for(var i= 0, len=data.length; i<len; i++){
                var $html = $("<li class='clear-fix'><h3>" + messageData[i].title + "</h3>" + "<time>" + messageData[i].date + "</time>" + "<p>" + messageData[i].content + "</p>" + "<a class=\"close\" href=\"javascript:;\">收起</a>" + "<a class=\"delete\" href=\"javascript:;\">删除</a>" + "</li>");

                $frag.append($html);
            }
        }

        $notice.find("ul").append($frag);
    }

    var data = [{"title": "213213", "date": "2013-02-03", "content": "dadsadsdasdsa"},
        {"title": "213213", "date": "2013-02-03", "content": "dadsadsdasdsa"},
        {"title": "213213", "date": "2013-02-03", "content": "dadsadsdasdsa"}];

    addData(data);

    $.ajax({
        type: "POST",
        url: "message-show.do",
        data: {
            "request": "message-show"
        },
        success: function(data){
            addData(data);
        }
    });
});

//删除通知
$(function(){
    var $notice = $("#notice");
    $notice.find(".delete").click(function(){
        var $_this = $(this);

        $.ajax({
            type: "GET",
            url: "message-delete.do",
            data: {
                "id": getCookie("id"),
                "title": $_this.closest("h3").html()
            },
            success: function(data){
                if(JSON.parse(data).result === true){
                    $_this.closest("li").remove();
                }
            }
        });
    });
});

//选项卡切换
$(function(){
    var $titleList = $(".title a");
    var $contentList = $(".content>div");

    $titleList.each(function(i){
        $(this).click(function(){
            $(".title").find(".active").removeClass("active");
            $(this).addClass("active");

            $(".content").find(".on-show").hide();
            $contentList.each(function(j){
                if(i === j){
                    $(this).addClass("on-show").show();
                }
            });
        });
    });
});

//鼠标放到用户名，显示注销
$(function(){
    //显示用户名
    var username = unescape(getCookie("name"));
    var $welcomeUser = $("#welcomeUser");
    var $logout = $("#loginOut");

    $welcomeUser.find("p").html(username);

    $welcomeUser.hover(function(){
        $logout.css("display", "block");
    }, function(){
        $logout.css("display", "none");
    });

    //注销操作
    $logout.click(function(){
        $.ajax({
            type: "GET",
            url: "user-logout.do",
            data: {
                "id": getCookie("id")
            },
            success: function(data){
                var logoutData = JSON.parse(data);
                if(logoutData === true){
                    window.location.href = "index.html";
                }
            }
        });
    });
});
