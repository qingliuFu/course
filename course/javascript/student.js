/**
 * Created by 付青柳 on 2016/3/31.
 */

"use strict";
//通知区内容内容的展开
$(function(){
    var $notice = $("#notice");

    //文本展开
    function extend(){
        $(this).siblings("p").show(400)
            .next().css("height", "25px");
    }

    //文本收缩
    function close(){
        $(this).css("height", "0")
            .prev().hide(0);
    }

    //h3标题的颜色变化
    $notice.find("h3").hover(function(){
        $(this).css("color", "red");
    }, function(){
        $(this).css("color", defaultStatus);
    });

    //绑定事件
    $notice.find("h3").click(extend);
    $notice.find(".close").click(close);
});

//选课退课
$(function(){
    var $course = $("#course");
    var $selectedCourse = $("#selectedCourse");

    //添加数据到选择课程
    function addCourse(data){
        var courseData = eval(data);
        var $frag = $(document.createDocumentFragment());

        for(var i= 0, len=courseData.length; i<len; i++){
            var $html = $("<tr><td>" + courseData[i].courseName + "</td><td>" + courseData[i].date + "</td><td>" + courseData[i].room + "</td><td>" + courseData[i].number + "</td><td>" +courseData[i].teacherName + "</td><td class='last'>" + "<input id=" + "'" + courseData[i].courseId + "'" + " type='checkbox'/></td>");
            if(courseData[i].selected === true){
                $html.find("input").prop("disabled", true);
            }
            $frag.append($html);
        }

        $course.find("tbody").append($frag);
    }

    //添加数据到已选课程
    function addCourseSelected(data){
        var courseData = eval(data);
        var $frag = $(document.createDocumentFragment());

        for(var i= 0, len=courseData.length; i<len; i++){
            var $html = $("<tr><td>" + courseData[i].courseName + "</td><td>" + courseData[i].date + "</td><td>" + courseData[i].room + "</td><td>" + courseData[i].number + "</td><td>" +courseData[i].teacherName + "</td><td class='last'>" + "<input id=" + "'" + courseData[i].courseId + "'" + " type='button' value='退课'/></td>");
            if(courseData[i].selected === true){
                $frag.append($html);
            }
        }

        $selectedCourse.find("tbody").append($frag);
    }

    //请求课程
    function requestAllCourse(){
        $.ajax({
            type: "GET",
            utl: "class-request.do",
            data: {
                "id": getCookie("id")
            },
            success: function(data){
                addCourse(data);
                addCourseSelected(data);
            }
        });
    }

    //选择课程
    function chooseCourse(){
        $course.find("#ensureCourse").click(function(){
            var courseArray = [];
            var trArray = [];

            $course.find("input:checked").each(function(i, ele){
                courseArray.push(ele.id);
                trArray.push(ele.parentNode.parentNode);
            });

            var courseData = {
                "id": getCookie("id"),
                "course": courseArray
            };
            $.ajax({
                type: "POST",
                url: "course-select.do",
                data: courseData,
                success: function(data){
                    var resultData = JSON.parse(data);
                    if(resultData.result === true){
                        alert("选课成功!");
                        $course.find("input:checked").prop("disabled", true);

                        //刷新已选
                        var $container = $selectedCourse.find("tbody");
                        for(var i= 0, len=trArray.length; i<len; i++){
                            $container.append($(trArray[i]));
                        }
                    }else {
                        alert("选课失败!");
                    }
                }
            })
        });
    }

    //退课
    function withdrawCourse(){
        $selectedCourse.find("tbody input").click(function(){
            var $_this = $(this);

            if(window.prompt("确认要退这门课程吗？")){
                $.ajax({
                    type: "POST",
                    url: "course-withdraw.do",
                    data: {
                        "id": getCookie("id"),
                        "course": $(this).attr("id")
                    },
                    success: function(data){
                        if(data.result === true){
                            alert("删除成功!");
                            $_this.closest("tr").remove();

                            //在选课页面变此项为可选
                            $course.find("#" + $_this.attr("id")).prop("disabled", false);
                        }
                    }
                }) ;
            }
        });
    }

    //执行以上的事件
    $(function(){
        requestAllCourse();
        chooseCourse();
        withdrawCourse();
    });
});
//请求
//course-get.do
//发送学生id
//希望获得
//[{"courseName":"sth","date":"sth","room":"sth","number":"sth","teacherName":"sth","courseId":"sth","selected":"sth"}]

//选课
//course-select.do
//发送
//{
//    "id": getCookie("id"),
//    "course": courseArray
//}其中courseArray为此学生所选所有课程id所组成的数组
//希望得到result


//退课
//course-withdraw.do
//发送学生id和课程id
//希望得到result


