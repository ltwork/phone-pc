$(function(){
    checklogin();
    //渲染页面
    var page = 1;
    var pageSize = 5;
    function render(page, pagesize) {
        $.ajax({
            url: "/user/queryUser",
            type: "GET",
            data: {
                page: page,
                pageSize: pageSize
            },
            success: function (res) {
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3, //指定bootstrap的版本，如果是3，必须指定
                    currentPage: page, //指定当前页
                    totalPages: Math.ceil(res.total / pageSize), //指定总页数=数据的总条数/每页显示多少条 向上取整
                    size: "small", //设置控件的大小

                    //当点击分页组件按钮会调用该方法
                    //index参数，就代表当前点击的是第几页
                    onPageClicked: function (a, b, c, index) {
                        //page指的是点击的页码,修改了当前页
                        page = index;
                        //每一次点击都会去发起ajax请求，获取数据，渲染数据
                        render(page, pageSize);
                    }
                });
                //渲染表格
                var html = template("userList", res)
                $("tbody").html(html)
            }
        })
    }
    render(page,pageSize)


    //封装更新用户状态的ajax请求
    function updataUserStatus (data){
        $.ajax({
            url: "/user/updateUser",
            type: "POST",
            data:data,
            success: function(res){
                if(res.success) {
                    //如果成功就从新刷新页面
                    render(page,pageSize);
                }
            }
        })
    }
    ///操作用户状态
    //启用状态 改为禁用
    $('tbody').on("click",".btn-danger",function(){
        // $.ajax({
        //     url: "/user/updateUser",
        //     type: "POST",
        //     data:{id:$(this).data("id"),isDelete:2},
        //     success: function(res){
        //         if(res.success) {
        //             //如果成功就从新刷新页面
        //             render(page,pageSize);
        //         }
        //     }
        // })
        updataUserStatus({id:$(this).data("id"),isDelete:2});
    })
    //禁用改启用
    $('tbody').on("click",".btn-success",function(){
        // $.ajax({
        //     url: "/user/updateUser",
        //     type: "POST",
        //     data:{id:$(this).data("id"),isDelete:1},
        //     success: function(res){
        //         if(res.success) {
        //             //如果成功就从新刷新页面
        //             render(page,pageSize);
        //         }
        //     }
        // })
        updataUserStatus({id:$(this).data("id"),isDelete:1});
    })












})