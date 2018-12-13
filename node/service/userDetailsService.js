var dbConnectioCheck = require('../../db/mongoConnection');
var co = require('co');
var schema = require('schemajs');


exports.validateUser = function (userDetails) {

    return new Promise(function (resolve, reject) {
        var model = schema.create({
            "id": {
                type: "number",
                filters: "trim",
                required : true
            },
            "first_name": {
                type: "string",
                required : true
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
                type: "number",
                filters: "trim"
            },
            "email": {
                type: "string"
            },
            "web": {
                type: "string"
            },
            "age" : {
                type : "number",
                required :true
            }
        });
        var form = model.validate(userDetails);
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
                            logger.error("requestId :: " + self.params.requestId + ":: " + '-ERROR:: ' + JSON.stringify(error));
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

exports.getAllUsers = function (findQuery,query, sort) {
    return new Promise(function (resolve, reject) {
        co(function*() {
            var db = yield dbConnectioCheck.checkDBConnectionObject();
            db.collection('UserData').find(findQuery,{},query).sort(sort).toArray(function(error, data) {
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
                    resolve(data);
                }
            })
        })
    })
}

exports.deleteUser = function (deleteBy) {
    return new Promise(function (resolve, reject) {
        co(function*() {
            var db = yield dbConnectioCheck.checkDBConnectionObject();
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
