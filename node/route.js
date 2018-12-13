var express = require('express');
var bodyParser = require('body-parser');
const userDetails = require('./controller/userDetails');
const appRouter = express.Router();

(function () {
    module.exports = function (app) {
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());

        appRouter.get('/users', userDetails.getAllUsers);
        appRouter.get('/users/:id', userDetails.getAllUsers);
        appRouter.post('/users', userDetails.addUserDetail);
        appRouter.delete('/users/:id', userDetails.deleteUser);
        app.use('/api', appRouter);
    }
})();
