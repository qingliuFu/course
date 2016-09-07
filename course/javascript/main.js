/**
 * Created by 付青柳 on 2016/3/26.
 */
//注册框的一些鼠标事件
$(function(){
    //用户名
    $("#username").focus(function(){
        $(this).css("border-color", "#3F89EC")
            .css("background-position-y", "-106px");
    }).blur(function(){
        $(this).css("border-color", defaultStatus)
            .css("background-position-y", defaultStatus);
    }).keydown(function(event){
        if(event.which === 13){
            $(this).trigger("blur");
            $("#password").trigger("focus");
        }
    });

    //密码
    $("#password").focus(function(){
        $(this).css("border-color", "#3F89EC")
            .css("background-position-y", "-185px");
    }).blur(function(){
        $(this).css("border-color", defaultStatus)
            .css("background-position-y", defaultStatus);
    }).keydown(function(event){
    	if(event.which === 13){
    		$(this).trigger("blur");
            $("#login").trigger("click");
    	}
    });

    //提交表单
    $("#login").click(function(){
        $(this).css("color", "#aaaaaa")
            .attr("value", "正在登陆...");
        $.ajax({
            type: "POST",
            url: "validate.do",
            data:{
                "id": $("#username").val(),
                "password": $("#password").val()
            },
            success: function(data){alert(data[])
                if(data === false){
                    alert("用户名或密码输入错误！");
                }else {
                	var data = eval ("(" + data + ")");
                    var status = data.status;
                    var username = data.name;
                    document.cookie = "name=" + escape(username);
                    window.location.href = status + ".html";
                }
            }
        });
    });
});
