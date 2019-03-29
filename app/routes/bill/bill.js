var express = require('express');
var router = express.Router();
var mongo = require("mongodb-curd");
var db = "lemon";
var collBill = "bill";
var collUser = "user";
var collIcon = "icon";
//查询全部
var findAll = function(req, res, next) {
    var uid = req.body.uid;
    var page = req.body.page,
        pageSize = req.body.pageSize;
    if (!uid) {
        res.send({ code: 3, msg: "参数不能为空" })
    } else {
        mongo.find(db, collBill, { "uid": uid }, function(result) {
            if (result.length === 0) {
                res.send({ code: 0, msg: "查询失败" })
            } else {
                res.send({ code: 1, data: result })
            }
        }, {
            skip: (page - 1) * pageSize,
            limit: pageSize,
            sort: {
                "_id": -1
            }
        })
    }

};
//按人查找uid
var findOne = function(req, res, next) {
    const id = req.body.id;
    mongo.find(db, collBill, { "_id": id }, function(result) {
        if (result.length === 0) {
            res.send({ code: 0, msg: "没有更多数据了" })
        } else {
            res.send({ code: 1, data: result })
        }
    })
};
//按时间查找
var findTimer = function(req, res, next) {
    const date = RegExp(req.body.date);
    const uid = req.body.uid;
    mongo.find(db, collBill, { "uid": uid, date: date }, function(result) {
        if (result.length === 0) {
            res.send({ code: 0, msg: "查询失败" })
        } else {
            res.send({ code: 1, data: result })
        }
    }, {
        sort: {
            "_id": -1
        }
    })
};
//删除
var delBill = function(req, res, next) {
    const id = req.body.id;
    console.log(id)
    mongo.remove(db, collBill, { "_id": id }, function(result) {
        if (result.deletedCount === 0) {
            res.send({ code: 0, msg: "删除失败" })
        } else {
            res.send({ code: 1, msg: "删除成功" })
        }
    })
};
//增加
var insertBill = function(req, res, next) {
    const uid = req.body.uid;
    const obj = req.body;
    obj.price = obj.price * 1;
    mongo.insert(db, collBill, obj, function(result) {
        console.log(result)
        if (result.length === 0) {
            res.send({ code: 0, msg: "增加失败" })
        } else {
            res.send({ code: 1, msg: "增加成功" })
        }
    })
}
module.exports = {
    findAll,
    findOne,
    delBill,
    insertBill,
    findTimer
};