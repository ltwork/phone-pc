$(function () {

    
    //1.给重置按钮和登陆按钮绑定事件

    //点击重置事件---我清空form里面的值
    $(".reset").click(function () {
        //dom对象 -----jquery对象
        $("form")[0].reset();
    })

    //登陆按钮事件
    $(".submit").click(function () {
        //出发表单提交事件
        $("form").submit();
        // //提交时候发起请求
        // $.ajax({
        //     url: "/employee/employeeLogin",
        //     type: "POST",
        //     // 直接拿到form里面的所有带name属性的值
        //     data: $("form").serialize(),
        //     success: function (res) {
        //         console.log(res);
        //         // if(res.success) {
        //         //     window.location.href = "./index.html";
        //         // }else {
        //         //     sessionStorage.setItem("lasturl",window.location.href);
        //         //     window.location.href = sessionStorage.getItem("lasturl");
        //         // }

        //     }
        // })
    })

    //2.表单验证插件

    //使用表单校验插件
    $("form").bootstrapValidator({
        //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
        // excluded: [':disabled', ':hidden', ':not(:visible)'],

        //2. 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        //3. 指定校验字段
        fields: {
            //校验用户名，对应name表单的name属性
            username: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '用户名不能为空'
                    },
                    //长度校验
                    stringLength: {
                        min: 4,
                        max: 30,
                        message: '用户名长度必须在4到30之间'
                    },
                    //正则校验
                    regexp: {
                        regexp: /^[a-zA-Z0-9_\.]+$/,
                        message: '用户名由数字字母下划线和.组成'
                    },
                    //回调提示信息
                    callback: {
                        message: "用户名不存在"
                    }
                }
            },
            password: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '密码不能为空'
                    },
                    //长度校验
                    stringLength: {
                        min: 6,
                        max: 12,
                        message: '密码长度必须在6到12之间'
                    },
                    //正则校验
                    regexp: {
                        regexp: /^[a-zA-Z0-9_\.]+$/,
                        message: '密码由数字字母下划线和.组成'
                    },
                     //回调提示信息
                     callback: {
                        message: "密码错误"
                    }
                }
            }

        }

    });

    //条件1： 表单验证通过 
    //2.提交表单时
    //触发事件
    $("form").on('success.form.bv', function (e) {
        e.preventDefault();
        //使用ajax提交逻辑
        $.ajax({
            url: "/employee/employeeLogin",
            type: "POST",
            // 直接拿到form里面的所有带name属性的值
            data: $("form").serialize(),
            success: function (res) {
                console.log(res);
                if(res.error == 1001) {
                    //密码错误
                    var validator = $("form").data('bootstrapValidator');
                    validator.updateStatus("password","INVALID","callback");
                }
                if (res.error == 1000) {
                    //用户名不存在
                    var validator = $("form").data('bootstrapValidator');
                    validator.updateStatus("username","INVALID","callback");
                }
                if(res.success){

                    //如果用户是直接login.html的地址就调到首页 否则从哪来回哪去
                    var lasturl = sessionStorage.getItem("lasturl");
                    //返回上一页
                    // if(lasturl) {
                    //     window.location.href = sessionStorage.getItem("lasturl");
                    //     //返回之后清除
                    //     sessionStorage.removeItem("lasturl");
                    // } else {
                    //     window.location.href = "./index.html";
                    // }
                    window.location.href = lasturl ? lasturl : "./index.html";
                    sessionStorage.removeItem("lasturl");
                    
                }

            }
        })
    });










})