require.config({
    paths: {
        "mui": "./libs/mui.min",
        "dtPicker": "./libs/mui.picker.min",
        "popPicker": "./libs/mui.poppicker"
    },
    shim: {
        "dtPicker": { //picker在mui执行完成之后再执行
            deps: ['mui'] //deps数组，表明该模块的依赖性
        },
        "popPicker": { //picker在mui执行完成之后再执行
            deps: ['mui'] //deps数组，表明该模块的依赖性
        }
    }
});
require(["mui", "dtPicker", "popPicker"], function(mui, dtPicker, popPicker) {
    //获取节点
    (function() {
        var $ = function(str) {
            return document.querySelector(str)
        }
        return window.$ = $;
    })();

    //全局变量
    var storage = localStorage.getItem("sessionId");
    var page = 1,
        pageSize = 3;
    var newDate = [];
    //判断是否存在缓存
    if (!storage) {
        // login()
        $(".login").classList.remove("hide");
        $(".wrapper").classList.add("hide");
    } else {
        getBill()
        $(".login").classList.add("hide");
        $(".wrapper").classList.remove("hide");
    }
    //获取当前的时间
    var timeDate = new Date();
    var year = timeDate.getFullYear();
    var month = timeDate.getMonth() + 1;
    $(".timers").innerHTML = year + "-" + addZero(month) + ' <i class="mui-icon mui-icon-arrowdown"></i>';
    //日期选择器
    let picker;;
    let pop;
    //年月选择
    let chooseType;
    init();
    //初始化
    function init() {
        login();
        addEvent();
        //上拉加载
        mui.init({
            pullRefresh: {
                container: '#pullrefresh',
                up: {
                    contentrefresh: '正在加载...',
                    callback: getBill
                }
            }
        });
        picker = new mui.DtPicker({
            type: "month"
        })
        pop = new mui.PopPicker();
        pop.setData([{
            value: 'year',
            text: "年"
        }, {
            value: "month",
            text: "月"
        }]);

        choose1()
        choose2();
    };


    function choose1() {
        $(".month").addEventListener("tap", function() {
            pop.show(function(selectItems) {
                $(".month").innerHTML = selectItems[0].text + '<i class="mui-icon mui-icon-arrowdown"></i>';
                chooseType = selectItems[0].value;
                if (chooseType == "year") {
                    $(".timers").innerHTML = year + '<i class="mui-icon mui-icon-arrowdown"></i>';
                } else {
                    $(".timers").innerHTML = year + "-" + addZero(month) + ' <i class="mui-icon mui-icon-arrowdown"></i>';
                }
            });
        });

    }

    function choose2() {
        $(".timers").addEventListener("tap", function() {

            let pickY = document.querySelector("[data-id='picker-y']");
            let pickM = document.querySelector("[data-id='picker-m']")

            let titleY = document.querySelector("[data-id='title-y']");
            let titleM = document.querySelector("[data-id='title-m']");
            //显示年
            if (chooseType == "year") {
                titleM.style.display = "none";
                pickM.style.display = "none";

                pickY.style.width = "100%";
                titleY.style.width = "100%";
                chooseType = "year";
            } //显示月 
            else {
                titleM.style.display = "";
                pickM.style.display = "";

                pickY.style.width = "50%";
                titleY.style.width = "50%";
                chooseType = "month"
            }
            picker.show(function(sessionItem) {
                if (chooseType == "year") {
                    $(".timers").innerHTML = sessionItem.y.text + ' <i class="mui-icon mui-icon-arrowdown"></i>';
                } else {
                    $(".timers").innerHTML = sessionItem.y.text + "-" + sessionItem.m.text + ' <i class="mui-icon mui-icon-arrowdown"></i>';
                }
                mui.ajax('/api/timer', {
                    data: {
                        uid: storage,
                        date: $(".timers").innerText.trim("")
                    },
                    dataType: 'json', //服务器返回json格式数据
                    type: 'post', //HTTP请求类型
                    timeout: 10000, //超时时间设置为10秒；
                    success: function(res) {
                        if (res.code == 1) {
                            render(res.data)
                        } else {
                            $(".menu").innerHTML = `<li>没有更多数据</li>`
                        }
                    }
                });
            });
        });
    }
    //登录
    function login() {
        $(".affrim").addEventListener("tap", function() {
            if ($(".user").value != "" && $(".pwd").value != "") {
                mui.ajax('/api/login', {
                    data: {
                        name: $(".user").value,
                        pwd: $(".pwd").value
                    },
                    dataType: 'json', //服务器返回json格式数据
                    type: 'post', //HTTP请求类型
                    timeout: 10000, //超时时间设置为10秒；
                    success: function(res) {
                        if (res.code == 1) {
                            mui.alert("登录成功", function() {
                                $(".login").classList.add("hide");
                                $(".wrapper").classList.remove("hide");
                                localStorage.setItem("sessionId", res.data[0]._id);
                                getBill();
                            });
                        } else {
                            mui.alert(res.msg);
                        }
                    }
                });
            } else {
                mui.alert("用户名密码不为空！");
            }
        });
    };
    //获取账单
    function getBill() {
        storage = localStorage.getItem("sessionId");
        setTimeout(function() {
            mui.ajax('/api/findBill', {
                data: {
                    uid: storage,
                    page: page++,
                    pageSize: pageSize
                },
                dataType: 'json', //服务器返回json格式数据
                type: 'post', //HTTP请求类型
                timeout: 10000, //超时时间设置为10秒；
                success: function(res) {
                    if (res.code == 0) {
                        mui('#pullrefresh').pullRefresh().endPullupToRefresh(true); //参数为true代表没有更多数据了
                    } else {
                        mui('#pullrefresh').pullRefresh().endPullupToRefresh(false); //参数为false代表有数据
                        newDate = [...newDate, ...res.data];
                        render(newDate)
                    }
                }
            });
        }, 1000);
    }
    //渲染
    function render(data) {
        $(".menu").innerHTML = data.map(item => {
            return `<li class="mui-table-view-cell lis">
            				<div class="mui-slider-right mui-disabled">
            					<a class="mui-btn mui-btn-red del" data-src="${item._id}">删除</a>
            				</div>
            				<div class="mui-slider-handle con">
            					<div class="left">
            						<span class="${item.icon} icon"></span>
            						<span>${item.style}</span>
            					</div>
            					<div class="right">
            						<span class="${item.type== '收入' ?'green':'red'}">${item.price}</span>
            					</div>
            				</div>
            			</li>`
        }).join("")
    }
    //事件
    function addEvent() {
        //点击删除
        mui("#menu").on("tap", ".del", function() {
            var that = this;
            mui.alert('确定删除吗', function(e) {
                mui.ajax('/api/delBill', {
                    data: {
                        id: that.getAttribute("data-src")
                    },
                    dataType: 'json', //服务器返回json格式数据
                    type: 'post', //HTTP请求类型
                    timeout: 10000, //超时时间设置为10秒；
                    success: function(res) {
                        if (res.code == 1) {
                            that.parentNode.parentNode.remove()
                        }
                    }
                });
            })
        });

        //点击跳转页面
        $(".addBox").addEventListener("tap", function() {
                window.location.href = "../pages/addDetails.html"
            })
            //点击退出，清空本地储存；
        mui(".footer").on("tap", ".exit", function() {
            localStorage.clear();
            window.location.reload();
        })

    };
    //补零
    function addZero(num) {
        return num < 10 ? "0" + num : num;
    }

});