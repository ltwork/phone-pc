$(function () {
    checklogin();
    //代开页面就渲染商品列表到页面上
    //设置初始值 默认显示第一页 每页5条数据
    var page = 1;
    var pageSize = 5;
    function render(page,pageSize){

        $.ajax({
            url: "/product/queryProductDetailList",
            type: "GET",
            data: {
                page: page,
                pageSize: pageSize
            },
            success: function (res){
                //分页插件 需要ajax完成之后，获取到数据之后来调用
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,//指定bootstrap的版本，如果是3，必须指定
                    currentPage: page,//指定当前页
                    totalPages: Math.ceil(res.total / pageSize),//指定总页数=数据的总条数/每页显示多少条 向上取整
                    size: "small",//设置控件的大小

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
                var html = template("goodlist",res)
                $("tbody").html(html)
            }
        })
    }

    render(page,pageSize);

    //点击添加商品事件
    $('.addgoodbtn').click(function(){
        //alert(1111)
        $("#addproductmodal").modal("show");
        
    })

     //5.//表单验证
    //使用表单校验插件
    $("form").bootstrapValidator({
        // 指定校验时的图标显示，默认是bootstrap风格
        // 默认不提交hidden disable等属性 的input
        excluded: [],
        feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
        },
    
        // 指定校验字段
        fields: {
        //校验用户名，对应name表单的name属性
        
            brandId: {
                validators: {
                //不能为空
                    notEmpty: {
                        message: '二级分类不能为空'
                    },       
                }
            },
            
            //校验用户名，对应name表单的name属性
            proName: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请输入商品名称'
                    }
                }
            },

            proDesc: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请输入商品描述'
                    }
                }
            },

            num: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请输入商品库存'
                    }
                }
            },

            size: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请输入商品尺码'
                    }
                }
            },

            oldPrice: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请输入原价'
                    }
                }
            },

            price: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请输入现价'
                    }
                }
            },

            goodpics: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '必须是三张图片'
                    }
                }
            },

        }
    })

    //6.点击确认添加分类的点击事件
    //加到tr中 ===> 数据库中
    //调接口
    //点击确认相当于提交表单
    $("#confirmaddgood").click(function(){
        //alert("1111");
        $("form").submit();
    
    })

    
    //表单验证成功事件
    $("form").on('success.form.bv', function (e) {
        //alert("success");
        e.preventDefault();
        //console.log($("form").serialize());
        //brandId=20&proName=22&proDesc=33&proNum=44&proSize=55-66&oldPrice=77&price=88&goodpics=aaaa
        var Urlstr = $("form").serialize()
        var Urlarr = Urlstr.split("&")
        //console.log(Urlarr);//["brandId=20", "proName=22", "proDesc=33", "proNum=44", "proSize=55-66", "oldPrice=77", "price=99", "goodpics=aaaa"]
        Urlarr.pop();
        //console.log(Urlarr);// ["brandId=20", "proName=22", "proDesc=33", "proNum=44", "proSize=55", "oldPrice=66", "price=77"]
        var urldata = Urlarr.join("&")
        console.log(urldata);//brandId=20&proName=22&proDesc=33&proNum=44&proSize=55-66&oldPrice=66&price=77

        //找到上传的图片  遍历从里面取出图片名和路径
        $('.img img').each(function(index,ele){
            var picName = $(this).data('name')
            var picAddr = $(this).data('addr')
            urldata += "&picName"+(index+1)+"="+picName+"&picAddr"+(index+1)+"="+picAddr
            console.log(urldata);//brandId=20&proName=22&proDesc=33&proNum=44&proSize=55-66&oldPrice=77&price=88&picName1=93bf2e60-ae8a-11e8-8de9-7d1c21447462.jpg&picAddr1=/upload/product/93bf2e60-ae8a-11e8-8de9-7d1c21447462.jpg&picName2=93bfa390-ae8a-11e8-8de9-7d1c21447462.png&picAddr2=/upload/product/93bfa390-ae8a-11e8-8de9-7d1c21447462.png&picName3=93c45e80-ae8a-11e8-8de9-7d1c21447462.JPG&picAddr3=/upload/product/93c45e80-ae8a-11e8-8de9-7d1c21447462.JPG
        })

        
        //console.log(dataUrl);
        //使用ajax提交逻辑
        $.ajax({
            url: "/product/addProduct",
            type: "POST",
            //提取表单内所有的带name属性的数据 serialize()
            data: urldata,
            success: function(res) {
                if (res.success) {
                    render(1, pageSize);
                    $("#addproductmodal").modal("hide");
                    resetform();
                }
            }
        });
    });

    //封装还原表单方法
    function resetform (){
        //表单验证事件还原
        var validator = $("form").data('bootstrapValidator');  //获取表单校验实例
        validator.resetForm();//重置表单，并且会隐藏所有的错误提示和图标
        $('form')[0].reset();
        $('#dropdownMenu1 .dropdownbottontext').html("二级分类")
        $('.img').html('')
    }

    //点击取消重置表单
    $('#cancelform').click(function(){
        resetform();
    })
    //点击二机分类框 下拉框出现说有二级分类列表
    $("#dropdownMenu1").click(function(){
        $.ajax({
            url: "/category/querySecondCategoryPaging",
            type: "GET",
            data: {page: 1,pagesize: 100},
            success: function(res){
                var html = template('dropdownlist',res)
                $('.dropdown-menu').html(html)
            }
        })
    })
    //点击哪一个就展示哪一个
    $('.dropdown-menu').on("click","a",function(){
        $('.dropdownbottontext').html($(this).html())
        //把id存进去
        $("#dropdownbrandId").val($(this).data("id"));
        //input里面有值了 需要手动去改变校验状态
        var validator = $("form").data('bootstrapValidator');  //获取表单校验实例
        validator.updateStatus("brandId", "VALID", null)
    })

    //图片上传
    $("#fileupload").fileupload({
        dataType: "json",
        done: function(e, data) {
            //console.log(data.result.picAddr);
            //拿到result之后，就可以取到图片的url并且把图片显示出来
            //$('#brandLogo').val(data.result.picAddr)
            var img = "<img class='img-thumbnail' data-name='"+data.result.picName+"' data-addr='"+data.result.picAddr+"' src='"+data.result.picAddr+"' width=60 >"
            $('.img').append(img)
            if($('.img img').length == 3){
                $("#goodpics").val("")
                //input里面有值了 需要手动去改变校验状态
                var validator = $("form").data('bootstrapValidator');  //获取表单校验实例
                validator.updateStatus("goodpics", "VALID", null)
            }
        }
    });

    //双击图片删除图片
    $(".img").on("dblclick","img",function(){
        $(this).remove();
        if($('.img img').length != 3){
            //input里面有值了 需要手动去改变校验状态
            var validator = $("form").data('bootstrapValidator');  //获取表单校验实例
            validator.updateStatus("goodpics", "INVALID", "notEmpty")
        }
    })


























})