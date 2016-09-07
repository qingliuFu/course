/**
 * Created by 付青柳 on 2016/3/29.
 */
"use strict";
//老师信息的获取，添加与删除
$(function(){
    var $teacherInfo = $("#teacherInfo");

    //获取老师信息
    $(function(){
        //添加信息
        function addTeacherData(data){
            var tData = eval(data);
            var $frag = $(document.createDocumentFragment());

            for(var i= 0, len=tData.length; i<len; i++){
                var $html = $("<tr><td class='id'>" + tData[i].id + "</td><td>" + tData[i].password + "</td><td>" + tData[i].name + "<td><a class='deleteTeacher' href='javascript:;'>删除</a></td>" + "</td></tr>");
                $frag.append($html);
            }

            $teacherInfo.find("tbody").append($frag);
        }

        //发请求
        $.ajax({
            type: "GET",
            url: "teacher-info.do",
            data: {
                "request": "teacher-info",
                "id": getCookie("id")
            },
            success: function(data){
                addTeacherData(data);
            }
        })
    });

    //添加新老师
    $(function() {

        //点击添加老师
        $("#insertTeacher").click(function () {
            $("body").css("background-color", "#aaaaaa");
            $(".popUp").show(300);
        });

        //点击取消
        $(".popUp .cancel").click(function () {
            $("body").css("background-color", defaultStatus);
            $(".popUp").hide(300);
        });

        //点击确认提交
        $(".popUp .submit").click(function () {
            var teacherData = {
                "id": $("#teacherID").val(),
                "password": $("#teacherPsd").val(),
                "name": $("#teacherName").val()
            };

            $.ajax({
                type: "POST",
                url: "teacher-add.do",
                data: teacherData,
                success: function (data) {
                    data = JSON.parse(data);
                    if (data.result === true) {
                        alert("添加成功！");
                        $(".popUp, .cancel").trigger("click");

                        //添加数据到table中
                        $teacherInfo.find("tbody").append("<tr><td class='id'>" + teacherData.id + "</td><td>"
                            + teacherData.password + "</td><td>" + teacherData.name +
                            "<td><a class='deleteTeacher' href='javascript:;'>删除</a></td>" + "</td></tr>");
                    }
                }
            });
        });
    });

    //删除老师
    $teacherInfo.click(function(event){
        var tar = event.target;
        if(tar.className === "deleteTeacher"){
            var $row = $(tar).closest("tr");
            $.ajax({
                type: "POST",
                url: "teacher-delete.do",
                data: {
                    "id": $row.find(".id").html()
                },
                success: function(data){
                    var deleteData = JSON.parse(data);
                    if(deleteData.result === true){
                        alert("删除成功!");
                        $row.remove();
                    }
                }
            });
        }
    });

});

//通知的事件
$(function(){
    var $notice = $("#notice");
    var $inputBox = $notice.find(".input-box");
    var $addMessageBtn = $notice.find(".addNewMessage");

    //获得现在时间
    function getTime(){
        var myDate = new Date();
        var year = myDate.getFullYear();
        var m = myDate.getMonth();
        var date = myDate.getDate();

        m = m<9 ? "0" + (m + 1) : m;
        date = date < 10 ? "0" + date : date;
        return (year + "-" + m + "-" + date);
    }

    //文本展开
    function extend(){
        $(this).siblings("p").show(400)
            .next().css("height", "25px")
            .next().css("height", "25px");
    }

    //文本收缩
    function close(){
        $(this).css("height", "0")
            .prev().hide(0);
        $(this).next().css("height", "0");
    }

    //h3标题的颜色变化
    $notice.find("h3").hover(function(){
        $(this).css("color", "red");
    }, function(){
        $(this).css("color", defaultStatus);
    });

    //文本的展开与收缩
    $notice.find("h3").click(extend);
    $notice.find(".close").click(close);

    //发布新通知
    $addMessageBtn.click(function(){
        if($inputBox.css("display") === "none"){
            //此情况下按钮功能为打开输入标题内容的页面
            $(this).next().css("height", "30px");
            $inputBox.css("display", "block");

            $(this).next().click(function(){
                $inputBox.css("display", "none");
                $(this).css("height", "0");
            });

        }else {
            //此时按钮功能为上传新通知
            var message = {
                "title": $inputBox.find("#messageTitle").val(),
                "content": $inputBox.find("#messageContent").val(),
                "date": getTime()
            };

            $.ajax({
                type: "POST",
                url: "message-add.do",
                data: message,
                success: function(data){
                    var mData = JSON.parse(data);
                    if(mData.result === true){
                        alert("发布成功!");
                        $addMessageBtn.next().trigger("click");

                       var $html = $("<li><h3>" + message.title + "</h3>" + "<time>" + message.date + "</time>" + "<p>" + message.content + "</p>" + "<a class=\"close\" href=\"javascript:;\">收起</a>" + "</li>");
                       //为它们绑定事件
                        $html.find("h3").hover(function(){
                            $(this).css("color", "red");
                        }, function(){
                            $(this).css("color", defaultStatus);
                        }).click(extend);
                        $html.find(".close").click(close);

                        //添加通知
                        $notice.find("ul").append($html);
                        $(this).next().trigger("click");
                        $notice.find("#noMessage").remove();
                    }
                }
            })
        }
    });
});

