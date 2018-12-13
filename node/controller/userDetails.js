/**
 * Created by galgara on 4/11/2017.
 */
var co = require('co');
var UserDetails = require('../service/userDetailsService');
var serachUserDetails = require('../util/searchUser');
var logger = getLogger('userController');

exports.addUserDetail = function (req, res) {
    req.body.id = parseInt(req.body.id);
    req.body.age = parseInt(req.body.age);
    req.body.zip = parseInt(req.body.zip);
    req.body.fullName = req.body.first_name + ' ' + req.body.last_name;
    var userInfo = req.body;
    logger.debug("user controller  ::  add user details request body:" + JSON.stringify(userInfo));

    co(function* () {
        var valid = yield UserDetails.validateUser(userInfo);
        if (valid) {
            var result = yield UserDetails.insertUser(userInfo);
            if (result.result.ok === 1) {
                logger.info("User is added successfully");
                res.status(201).send("User is added successfully");
            } else {
                logger.info("user controller  ::  failed to add user " + req.body.userData.name);
                res.status(400).send("Failed to add user");
            }
        } else {
            res.status(400).send("Invalid Payload");
        }
    })

};

exports.getAllUsers = function (req, res) {

    logger.debug("user controller  ::  get all user ");
    co(function* () {
        var sortKeys = ['id','first_name','last_name','company_name','city', 'state', 'zip', 'email','web','age'];
        var pageNo = parseInt(req.query.pageNo);
        var size = parseInt(req.query.size) || 5;
        var query = {};
        var findQuery = {};
        var sort = {'_id':-1};
        if(req.query.name){
            findQuery = {"fullName" : { '$regex' : req.query.name , '$options' : 'i' }}
        }
        if(req.query.sort && sortKeys.indexOf(req.query.sort) > 0){
            var val  = req.query.sort.slice(0, 1) === '-' ? -1 : 1;
            var key = req.query.sort;
            console.log("vvvv ",val);
            if(val === -1){
                 key = req.query.sort.slice(1, req.query.sort.length -1);
            }
            sort = {
                key : val
            };
        }
        if(req.params.id){
            findQuery = {
                id : parseInt(req.params.id)
            }
        }
        if(pageNo < 0 || pageNo === 0) {
            let response = {"statusCode": 400, "message": "invalid page number, should start with 1"};
            res.status(400).send(response)
        } else {
            query.skip = size * (pageNo - 1);
            query.limit = size;
            var userData = yield UserDetails.getAllUsers(findQuery,query,sort);
            res.send(userData);
        }
    })
};

exports.deleteUser = function (req, res) {

    var id = parseInt(req.params.id);
    var deleteBy = {
        "id": id
    };

    logger.debug("user controller  ::  delete user ");

    co(function*() {
        var deletedData = JSON.parse(yield UserDetails.deleteUser(deleteBy));
        if (deletedData.n > 0) {
            logger.info("user controller  ::  delete user : user deleted successfully ");
            res.status(200).send("User deleted successfully")
        } else {
            logger.info("user controller  ::  delete user : failed to delete user ");
            res.status(202).send("Failed to delete User");
        }
    })

};
