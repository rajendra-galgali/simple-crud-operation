'use strict';
let dbConnectioCheck = require('../../db/mongoConnection');
let co = require('co');
let schema = require('schemajs');


exports.validateUser = function (userDetails) {
    return new Promise(function (resolve, reject) {
        let model = schema.create({
            "id": {
                type: "string",
                required : true
            },
            "first_name": {
                type: "string"
            },
            "last_name": {
                type: "string",
                required: true
            },
            "company_name": {
                type: "string",
                required : false
            },
            "city": {
                type: "string",
                required : true
            },
            "state": {
                type: "string",
                required : true
            },
            "zip": {
                type: "string",
                required : true
            },
            "email": {
                type: "string",
                required : true
            },
            "web": {
                type: "string",
                required : false
            },
            "age" : {
                type: "string",
                required : true
            }
        });
        let form = model.validate(userDetails);
        resolve(form.valid);
    })
};

exports.insertUser = function (userDetails) {

    return new Promise(function (resolve, reject) {
        co(function*() {
            var db = yield dbConnectioCheck.checkDBConnectionObject();
            db.collection('UserData').insertOne(userDetails, function (error, data) {
                if (error) {
                    co(function*() {
                        if (error.name === "MongoError") {
                            yield dbConnectioCheck.checkDBConnectionObject()
                        } else {
                            reject({
                                'response': error
                            });
                        }
                    })
                } else {
                    resolve(data);
                }
            });
        });
    })
}

exports.getUserDetails = function () {
    return new Promise(function (resolve, reject) {
        console.log("asdasdasd ");
        co(function*() {
            let db = yield dbConnectioCheck.checkDBConnectionObject();
            db.collection('UserData').find().toArray(function(error, data) {
                console.log("eeeeeeeee",error);
                console.log("dataaaaaaaaa",data);
                if (error) {
                    co(function*() {
                        if (error.name === "MongoError") {
                            yield dbConnectioCheck.checkDBConnectionObject()
                        } else {
                            reject({
                                'response': error
                            });
                        }
                    })
                } else {
                    resolve(data);
                }
            })
        })
    })
};

exports.deleteUser = function (deleteBy) {
    return new Promise(function (resolve, reject) {
        co(function*() {
            let db = yield dbConnectioCheck.checkDBConnectionObject();
            db.collection('UserData').remove(deleteBy, function(error, result) {
                if (error) {
                    co(function*() {
                        if (error.name === "MongoError") {
                            yield dbConnectioCheck.checkDBConnectionObject()
                        } else {
                            logger.error("requestId :: " + self.params.requestId + ":: " + '-ERROR:: ' + JSON.stringify(error));
                            reject({
                                'response': error
                            });
                        }
                    })
                } else {
                    resolve(result);
                }
            })
        })
    })
}
