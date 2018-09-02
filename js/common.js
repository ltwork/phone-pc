//判断用户是否的能录
function checklogin() {
    $.ajax({
        url: "/employee/checkRootLogin",
        type: "GET",
        success: function (res) {
            //console.log(res);
            if (res.error) {
                //未登陆，跳转到登陆页
                //记住当前页
                sessionStorage.setItem("lasturl", window.location.href);
                window.location.href = "./login.html";
            }
        }

    })
    
}
// 公共js部分
$(function () {
    //检查登陆状态
    // checklogin();

    //1.左右收缩按钮点击事件
    $(".main .right .toggle").click(function () {
        $(".main,.main .left").toggleClass("active");
    })
    //2.推出按钮点击事件
    //弹出模态框
    $(".main .right .logout").click(function () {
        $(".modal").modal("show");

    })

    //3.点击模态框里的确定按钮----跳转到登陆页
    $(".modal .confirmlogout").click(function () {
        $.ajax({
            url: "/employee/employeeLogout",
            type: "GET",
            success: function (res) {
                if (res.success) {
                    //模态框隐藏,跳转到登录页
                    $("#logoutmodal").modal("hide");
                    window.location.href = "./login.html";
                }
            }
        })
    })

    //5.二级分类点击事件
    $(".menu .togglesubmenu").click(function () {
        //alert(11111);
        //toggle 切换slide
        //jQuery slideToggle() 方法可以在 slideDown() 与 slideUp() 方法之间进行切换。
        $(".submenu").slideToggle();
    })

});

