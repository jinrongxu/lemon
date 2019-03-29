var express = require('express');
var router = express.Router();
var mongo = require("mongodb-curd");
var bill = require("./bill/bill");
var cls = require("./class/class")
var db = "lemon";
var collBill = "bill";
var collUser = "user";
var collIcon = "icon";

//查询全部uid
router.post('/api/findBill', bill.findAll);
//按人查找uid
router.post('/api/findOne', bill.findOne);
//按时间查找
router.post("/api/timer", bill.findTimer);
//删除
router.post('/api/delBill', bill.delBill);
//增加
router.post("/api/addBill", bill.insertBill);
//按类别查询
router.post("/api/findClass", cls.findClss);
//登录
router.post('/api/login', function(req, res, next) {
    var name = req.body.name,
        pwd = req.body.pwd;
    mongo.find(db, collUser, { "name": name, "pwd": pwd },
        function(result) {
            if (result.length === 0) {
                res.send({ code: 0, msg: "用户名或密码错误" })
            } else {
                res.send({ code: 1, data: result })
            }
        })
});
module.exports = router;