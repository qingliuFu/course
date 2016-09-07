/**
 * Created by 付青柳 on 2016/3/29.
 */
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

//课程的查看，添加与删除
$(function(){
    var $course = $("#course");
    var $popUp = $course.find(".popUp");

    //添加课程到table中
    function addCourseData(data){
        var courseData = eval(data);
        var $frag = $(document.createDocumentFragment());

        for(var i= 0, len=courseData.length; i<len; i++){
            var $html = $("<tr><td class='course-name'>" + courseData[i].name + "</td><td>" + courseData[i].date + "</td><td>" + courseData[i].room + "</td><td>" + courseData[i].number + "</td><td><a class='deleteCourse' href='javascript:;'>删除</a></td>" + "</td><td style='display: none'><i>" + courseData[i].c_id + "</i></td></tr>");
            $frag.append($html);
        }

        $course.find("tbody").append($frag);
    }

    //请求已有课程信息
    $.ajax({
        type: "GET",
        url: "course-info.do",
        data: {
            "request": "course-info",
            "id": getCookie("id")
        },
        success: function(data){
            addCourseData(data);
        }
    });

    //点击添加课程，弹窗弹出
    $("#insertCourse").click(function () {
        $("body").css("background-color", "#aaaaaa");
        $popUp.show(100);
    });

    //点击取消，弹框消失
    $popUp.find(".cancel").click(function () {
        $("body").css("background-color", defaultStatus);
        $popUp.hide(300);
    });

    //点击确认提交，发送数据到后端
    $popUp.find(".submit").click(function () {
        var courseData = {
            "id": getCookie("id"),
            "name": $popUp.find("#courseName").val(),
            "date": $popUp.find("#courseTime").val(),
            "room": $popUp.find("#courseRoom").val(),
            "number": $popUp.find("#courseNumber").val()
        };

        $.ajax({
            type: "POST",
            url: "course-add.do",
            data: courseData,
            success: function (data) {
                var cData = JSON.parse(data);
                if (cData.result === true) {
                    alert("添加成功！");
                    $popUp.find(".cancel").trigger("click");

                    var $html = $("<tr><td class='course-name'>" + courseData.name + "</td><td>" + courseData.date + "</td><td>" + courseData.room + "</td><td>" + courseData.number + "</td><td><a class='deleteCourse' href='javascript:;'>删除</a></td>" + "</td><td style='display: none'><i>" + cData.c_id + "</i></td></tr>");
                    $course.find("tbody").append($html);
                }else if(cData.result === false){
                    alert("添加失败喽！");
                }
            }
        });
    });

    //删除课程
    $course.click(function(event){
        var tar = event.target;
        if(tar.className === "deleteCourse"){
            var $row = $(tar).closest("tr");
            $.ajax({
                type: "POST",
                url: "course-delete.do",
                data: {
                    "id": getCookie("id"),
                    "c_id": $row.find("i").html()
                },
                success: function(data){
                    var dData = JSON.parse(data);
                    if(dData.result === true){
                        alert("删除成功!");
                        $row.remove();
                    }
                }
            })
        }
    });
});

//学生信息的查看
$(function(){
    var $studentInfo = $("#studentInfo");
    var $allClass = $studentInfo.find(("#allClass"));
    var $studentTable = $studentInfo.find("tbody");
    var $className = $studentInfo.find("#className");
    var firstClass = null;//记录所得到的第一个班级

    //渲染班级
    function renderClass(data){
        var $frag = $(document.createDocumentFragment());

        for(var i= 0, len=data.length; i<len ;i++){
            var $option = $("<option value=" + "'" + data[i] + "'>" + data[i] + "</option>");
            $frag.append($option);
        }

        $allClass.append($frag);
    }

    //渲染学生
    function renderStudent(className, data){
        $studentTable.html("");
        var $frag = $(document.createDocumentFragment());

        $className.html(className);
        for(var i= 0, len=data.length; i<len; i++){
            var $student = $("<tr><td>" + className + "</td><td>" + data[i].studentId +"</td><td>" + data[i].studentName + "</td></tr>");
            $frag.append($student);
        }

        $studentTable.append($frag);
    }

    //请求学生数据并渲染
    function requestToRenderStudent(className){
        $.ajax({
            type: "GET",
            url: "student-byBj.do",
            data: {
                "id": getCookie("id"),
                "class": className
            },
            success: function(data){
                var studentData = eval(data);
                renderStudent(className, studentData);
            }
        })
    }

    //请求班级数据
    $.ajax({
        type: "GET",
        url: "bg-getAll.do",
        data: {
            "id": getCookie("id")
        },
        success: function(data){
            var classData = eval(data);
            renderClass(classData);
        }
    });

    //首次点击渲染第一个班级
    requestToRenderStudent(firstClass);

    //选择变化然后渲染
    $allClass.bind("change", function(){
        var now = $allClass.find(":selected").val();
        requestToRenderStudent(now);
    });
});

//请求班级
//all-class.do
//发送老师id
//希望得到
//[class1, class2, class3]类似于这样的数组


//根据班级请求学生信息
//student-byClass.do
////发送
// {"id": getCookie("id"),
//    "class": className}
//希望得到
//[{"studentId":"id1", "studentName":"name1"},{"studentId":"id2", "studentName":"name2"}]