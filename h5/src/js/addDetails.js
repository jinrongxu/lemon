require.config({
    paths: {
        "mui": "./libs/mui.min"
    }
})
require(["mui"], function(mui) {
    //获取节点
    (function() {
        var $ = function(str) {
            return document.querySelector(str)
        }
        return window.$ = $;
    })();
    var storage = localStorage.getItem("sessionId");
    var type;
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    $(".getTimer").innerHTML = `<span>${year}-${addZero(month)}-${addZero(day)}</span>`

    function init() {
        tab()
        getClass();
        cal();
        tab1();
        addEvent()

    }
    //初始化获取渲染
    function getClass() {
        type = $(".tabs .active").innerHTML;
        mui.ajax('/api/findClass', {
            data: {
                uid: storage,
                type: type
            },
            dataType: 'json', //服务器返回json格式数据
            type: 'post', //HTTP请求类型
            timeout: 10000, //超时时间设置为10秒；
            success: function(res) {
                render(res.data)
            }
        });
    };
    //渲染数据
    function render(data) {
        var str = ""
        data.forEach((item, index) => {
            if (index == 0) {
                str += ` <dl class="active">
                            <dt><span class="${item.icon}"></span></dt>
                            <dd>${item.intro}</dd>
                        </dl>`
            } else {
                str += ` <dl>
                            <dt><span class="${item.icon}"></span></dt>
                            <dd>${item.intro}</dd>
                        </dl>`
            }
        });
        str += `<dl >
                    <dt><span class="mui-icon mui-icon-plusempty"></span></dt>
                    <dd>自定义</dd>
                </dl>`
        $(".group .list").innerHTML = str;
    }
    //tab切换
    function tab() {
        mui(".tabs").on("tap", "li", function() {
            if (this.classList.contains("active")) {
                return;
            };
            for (let i = 0; i < this.parentNode.children.length; i++) {
                this.parentNode.children[i].classList.remove("active")
            };
            this.classList.add("active");
            getClass();
        })
    };

    function tab1() {
        mui(".group").on("tap", "dl", function() {
            if (this.classList.contains("active")) {
                return;
            };
            for (let i = 0; i < this.parentNode.children.length; i++) {
                this.parentNode.children[i].classList.remove("active")
            };
            this.classList.add("active");
        })
    }
    //计算器
    function cal() {
        var money = $(".money");
        mui(".footer .left").on("tap", "li", function() {
            //money.innerHTML = money.innerHTML.length == 1 ? "0.00" : money.innerHTML.substr(0, money.innerHTML.length - 1)
            if (this.innerHTML == "×") {
                money.value = "0.00"
            }
            if (money.value == "0.00") {
                money.value = this.innerHTML;
            } else if (money.value.includes(".") && this.innerHTML == ".") {
                money.value = money.value;
            } else if (money.value.includes(".") && money.value.split(".")[1].length == 2) {
                money.value = money.value;
            } else {
                money.value += this.innerHTML;
            }
        })
    };
    //点击确定增加数据
    function addEvent() {
        $(".sure").addEventListener("tap", function() {
            var icon = document.querySelector(".group .active span").className;
            var style = document.querySelector(".group .active dd").innerHTML;
            var money = $(".money").value;
            var date = $(".getTimer span").innerText;
            if (money !== "0.00") {
                mui.ajax('/api/addBill', {
                    data: {
                        uid: storage,
                        icon: icon,
                        type: type,
                        style: style,
                        price: money,
                        date: date
                    },
                    dataType: 'json', //服务器返回json格式数据
                    type: 'post', //HTTP请求类型
                    timeout: 10000, //超时时间设置为10秒；
                    success: function(data) {
                        mui.alert(data.msg, '提示', function() {
                            window.location.href = "../index.html"
                        })
                    }
                });
            }
        })
    }

    function addZero(num) {
        return num < 9 ? "0" + num : num
    }
    init()
})