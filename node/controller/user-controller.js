'use strict';
let co = require('co');
let userService = require('../service/user-service');
let serachuserService = require('../util/searchUser');

exports.addUserDetail = function (req, res) {
    co(function* () {
        let userDerails = req.body;
        let valid = yield userService.validateUser(userDerails);
        if (valid) {
            let result = yield userService.insertUser(userDerails);
            if (parseInt(result.result.ok ) ===  1) {
                res.status(201).send("User is added successfully");
            } else {
                res.status(400).send("Failed to add user");
            }

        } else {
            res.status(400).send("Invalid Payload");
        }
    })

};

exports.getuserDetails = function (req, res) {
    co(function* () {
        let userData = yield userService.getUserDetails();
        console.log("user details - - ", userData);
        /*  userData = yield serachuserService.searchUser(userData, name, id);
          if (Object.keys(userData).length) {
              res.status(200).send(userData);
          } else {
              res.status(204).send();
          }*/
    })
};

exports.deleteUser = function (req, res) {
    console.log("raj" + JSON.stringify(req.body));
    let userName = req.body.userName;
    let userId = req.body.userId;
    let deleteBy = {};

    logger.debug("user controller  ::  delete user ");
    if (!(userId && userName) && (userName || userId)) {
        if (userName) {
            deleteBy = {
                "userName": userName
            }
        } else if (userId) {
            deleteBy = {
                "id": userId
            }
        }
        co(function* () {
            let deletedData = JSON.parse(yield userService.deleteUser(deleteBy));
            if (deletedData.n > 0) {
                logger.info("user controller  ::  delete user : user " + req.body.userName || req.body.userId + " deleted successfully ");
                res.status(200).send("User deleted successfully")
            } else {
                logger.info("user controller  ::  delete user : failed to delete user " + userName || userId);
                res.status(202).send("Failed to delete User");
            }
        })
    } else {
        res.sendStatus(400)
    }
}

exports.loginUser = function (req, res) {

    let userName = req.query.userName;
    let password = req.query.password;
    let userId = "";
    logger.debug("user controller   ::  login user ");
    if (userName && password) {
        co(function* () {
            let userData = yield userService.getAllUsers();
            userData = yield serachuserService.searchUser(userData, userName);
            if (Object.keys(userData).length) {
                if (userData[0].userName === userName && userData[0].password === password) {
                    res.status(200).send("Login successfully");
                } else {
                    res.status(401).send("Invalid user name or password")
                }
            } else {
                logger.info("login controller : no user found ");
                res.status(204).send();
            }
        })
    } else {
        res.sendStatus(400)
    }
}