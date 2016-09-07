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
            $("#login").trigger("click")
        }
    });

    //提交表单
    $("#login").click(function(){
        var errorMsg = $(this).parent(".login-zone").find(".error-msg");
        var userData = {
            "id": $("#username").val(),
            "password": $("#password").val()
        };

        //登录验证成功之后发出的请求
        //function loginRequest(target){
          // $.ajax({
              //  type: "POST",
             // url: "page-" + target + ".do",
                //success: function(data){
              //  var tData = JSON.parse(data);
        
                // if(tData.result === false){
                  //     alert("error!");
                 // }
             // },
              //  error: function(){
              //   alert("error!");
             // }
            //})
       //}

        //检测输入是否为空
        if(userData.id === "" || userData.password === ""){
           errorMsg .css("display", "block");
            return false;
        }
       $(this).css("color", "#aaaaaa")
            .attr("value", "正在登陆...");
        errorMsg.css("display", "none");

        $.ajax({
            type: "POST",
            url: "validate.do",
            data: userData,
            success: function(data){
                var data = JSON.parse(data);
                if(data.result === false){
                    alert("用户名或密码输入错误！");
                }else {
                    var status = data.status;
                    var username = data.name;
                    document.cookie = "name=" + escape(username);
                    document.cookie = "id=" + escape(userData.id);
                    document.cookie = "status=" + escape(status);
                    window.location.href = status + ".html";
                }
            }
        });
    });
});
