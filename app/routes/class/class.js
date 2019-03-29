var express = require('express');
var router = express.Router();
var mongo = require("mongodb-curd");
var db = "lemon";
var colClass = "class";
//按照uid,以及收入和输出查询
var findClss = function(req, res, next) {
    var uid = req.body.uid;
    var type = req.body.type;
    if (!uid) {
        res.send({ code: 3, msg: "参数无效" })
    }
    mongo.find(db, colClass, { uid: uid, type: type }, function(result) {
        if (result.length == 0) {
            res.send({ code: 0, msg: "查询无效" })
        } else {
            res.send({ code: 1, data: result })
        }
    })
}
module.exports = {
    findClss
};