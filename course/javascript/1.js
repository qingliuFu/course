 $.ajax({
            type: "POST",
            url: "validate.do",/*url:"validate.do?id="+escape(idField.value),/*URL默认为当前页的地址，发送请求的地址*/
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