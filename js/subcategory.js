$(function () {
    checklogin();

    //渲染页面
    var page = 1;
    var pageSize = 5;

    function render(page, pagesize) {
        $.ajax({
            url: "/category/querySecondCategoryPaging",
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
                var html = template("subcategoryList", res)
                $("tbody").html(html)
            }
        })
    }
    //加载页面
    render(page, pageSize)

    //添加二级分类事件  弹出模态框
    $('.addsubcategorybtn').click(function () {
        $('#addsubcategory').modal('show')
    })

    //点击确认按钮 提交表单
    $(".confirmaddsubcategory").click(function () {
        $("form").submit();
    })
    //表单验证 验证输入的内容
    //使用表单校验插件
    $("form").bootstrapValidator({
        //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
        excluded: [],//全部验证
        //2. 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        //3. 指定校验字段
        fields: {
            //校验用户名，对应name表单的name属性
            categoryId: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '一级分类名不能为空'
                    },
                    //长度校验
                    stringLength: {
                        min: 1,

                        message: '一级分类名长度必须大于等于1'
                    },
                }
            },
            brandName: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '二级分类名不能为空'
                    },
                    //长度校验
                    stringLength: {
                        min: 1,
                        message: '二级分类名长度必须大于等于1'
                    },
                }
            },
            brandLogo: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '图片不能为空'
                    }
                }
            },
        }

    });

    ///表单验证成功 条件1.验证通过 2,提交了表达
    $("form").on('success.form.bv', function (e) {
        e.preventDefault();

        //使用ajax提交逻辑
        $.ajax({
            url: "/category/addSecondCategory",
            type: "POST",
            data: $("form").serialize(),
            success: function (res) {
                //console.log(data);
                if (res.success) {
                    render(1, pageSize)
                    $('#addsubcategory').modal('hide')
                    render(page,pageSize)
                }
            }
        })
    });


    //--------------------------------

    //获取一级分类的 展示到下拉框中
    function renderCategory(){
        $.ajax({
            url: "/category/queryTopCategoryPaging",
            type: "GET",
            data: {page: 1,pagesize: 100},
            success: function(res){
                var html = template("scategoryList",res)
                $('.dropdown-menu').html(html)
            }
        })
    }

    renderCategory();

    //选中哪一个 哪个就展示在选择款上
    $('.dropdown-menu').on("click","a",function(){
        $('.dropdownbottontext').html($(this).html());
        $('#dropdowncategoryId').val($(this).data("id"))
        //input里面有值了 需要手动去改变校验状态
        var validator = $("form").data('bootstrapValidator');  //获取表单校验实例
        validator.updateStatus("categoryId", "VALID", null)
    })

    //图片上传
    $("#fileupload").fileupload({
        dataType: "json",
        done: function(e, data) {
            console.log(data.result.picAddr);
            //拿到result之后，就可以取到图片的url并且把图片显示出来
            $('#brandLogo').val(data.result.picAddr)
            var img = "<img class='img-thumbnail' src='"+data.result.picAddr+"' width=60 >"
            $('.img').html(img)
            //input里面有值了 需要手动去改变校验状态
            var validator = $("form").data('bootstrapValidator');  //获取表单校验实例
            validator.updateStatus("brandLogo", "VALID", null)
        }
    });








})