var mysql = require('mysql');

function REST_ROUTER(router, connection) {
    var self = this;
    self.handleRoutes(router, connection);
}

REST_ROUTER.prototype.handleRoutes = function(router, connection) {

    router.get("/getApps", function(req, res) {
        var query = 'SELECT * FROM application';
        var table = ["application"];
        query = mysql.format(query, table);
        connection.query(query, function(err, rows) {
            if (err) {
                console.log(err);
                res.json({
                    "Error": true,
                    "Message": "Error executing MySQL query"
                });
            } else {
                res.json({
                    "Error": false,
                    "Message": "Success",
                    "apps": rows
                });
            }
        });
    });

    router.post("/getAppByAppID", function(req, res) {
        var application = req.body;
        var query = 'SELECT * FROM application WHERE application.app_id=' + application.app_id + '';
        var table = ["application"];
        query = mysql.format(query, table);
        connection.query(query, function(err, rows) {
            if (err) {
                console.log(err);
                res.json({
                    "Error": true,
                    "Message": "Error executing MySQL query"
                });
            } else {
                res.json({
                    "Error": false,
                    "Message": "Success",
                    "apps": rows
                });
            }
        });
    });

    router.get("/getAllActiveApps", function(req, res) {
        var query = 'SELECT * FROM application WHERE application.active=1';
        var table = ["application"];
        query = mysql.format(query, table);
        connection.query(query, function(err, rows) {
            if (err) {
                console.log(err);
                res.json({
                    "Error": true,
                    "Message": "Error executing MySQL query"
                });
            } else {
                res.json({
                    "Error": false,
                    "Message": "Success",
                    "apps": rows
                });
            }
        });
    });

    router.post("/getAssignedApp", function(req, res) {
        var user = req.body;
        var query = 'SELECT application_user.app_id FROM n4msaas.application_user WHERE application_user.user_id IN(SELECT user.user_id from n4msaas.user where user.username ="' + user.username + '")';
        var table = ["application"];
        query = mysql.format(query, table);
        connection.query(query, function(err, rows) {
            if (err) {
                console.log(err);
                res.json({
                    "Error": true,
                    "Message": "Error executing MySQL query"
                });
            } else {
                res.json({
                    "Error": false,
                    "Message": "Success",
                    "apps": rows
                });
            }
        });
    });

    router.post("/getAllApps", function(req, res) {
        var user = req.body;
        if (user.user_id) {
            var query = 'SELECT app_id, app_name, app_url, active FROM application WHERE application.app_id IN ';
            query += '(SELECT application_user.app_id FROM application_user WHERE application_user.user_id = "' + user.user_id + '")';
        } else {
            var query = 'SELECT app_id, app_name, app_url, active FROM application WHERE application.app_id IN ';
            query += '(SELECT application_user.app_id FROM application_user WHERE application_user.user_id IN';
            query += '(SELECT user_id FROM user WHERE user.username = "' + user.username + '"))';
        }

        var table = ["application"];
        query = mysql.format(query, table);
        connection.query(query, function(err, rows) {
            if (err) {
                console.log(err);
                res.json({
                    "Error": true,
                    "Message": "Error executing MySQL query"
                });
            } else {
                //console.log(rows);
                res.json({
                    "Error": false,
                    "Message": "Success",
                    "apps": rows
                });
            }
        });
    });

    router.put("/changeAppState", function(req, res) {
        var app = req.body;
        console.log(app);
        var query = 'UPDATE n4msaas.application SET active=' + app.active + ' WHERE app_id=' + app.app_id + '';
        var table = ["application"];
        query = mysql.format(query, table);
        connection.query(query, function(err, rows) {
            if (err) {
                console.log(err);
                res.json({
                    "Error": true,
                    "Message": "Error executing MySQL query"
                });
            } else {
                res.json({
                    "Error": false,
                    "Message": "Success",
                    "Users": rows[0]
                });
            }
        });
    });

    router.put("/updateApplication", function(req, res) {
        var app = req.body;
        console.log(app);
        var query = 'UPDATE n4msaas.application SET app_name="' + app.app_name + '", app_url="' + app.app_url + '"  WHERE app_id=' + app.app_id + '';
        var table = ["application"];
        query = mysql.format(query, table);
        connection.query(query, function(err, rows) {
            if (err) {
                console.log(err);
                res.json({
                    "Error": true,
                    "Message": "Error executing MySQL query"
                });
            } else {
                res.json({
                    "Error": false,
                    "Message": "Success",
                    "Users": rows[0]
                });
            }
        });
    });

    router.put('/updateUserApps', deleteExistingApps, AddNewApps);

    function deleteExistingApps(req, res, next) {
        var user = req.body;
        var query = 'DELETE FROM n4msaas.application_user where user_id = "' + user.user_id + '"';
        var table = ["application_user"];
        query = mysql.format(query, table);
        connection.query(query, function(err, rows) {
            if (err) {
                console.log(err);
                res.json({
                    "Error": true,
                    "Message": "Error executing MySQL query"
                });
            } else {
                next();
            }
        });
    }

    function AddNewApps(req, res, next) {
        var user = req.body;
        var len = user.app_ids.length;
        for (var i = 0; i < len; i++) {
            console.log(user.app_ids[i]);
            var query = 'INSERT INTO n4msaas.application_user  (app_id, user_id) VALUES ("' + parseInt(user.app_ids[i]) + '", "' + user.user_id + '")';
            var table = [""];
            query = mysql.format(query, table);
            console.log(query);
            connection.query(query, function(err, rows) {
                if (err) {
                    console.log(err);
                    res.json({
                        "Error": true,
                        "Message": "Error executing MySQL query"
                    });
                } else {
                    if (i == len - 1) {
                        res.json({
                            "Error": false,
                            "Message": "Updated Successfull"
                        });
                    }
                }
            });
        }

        res.json({
            "Error": false,
            "Message": "Updated Successfull"
        });
    }

    router.post("/addApplication", function(req, res) {
        var application = req.body;
        console.log(application);
        var query = 'INSERT INTO  application  (app_id, app_name, app_url) VALUES (null, "' + application.app_name + '", "' + application.app_url + '")';
        var table = ["application"];
        query = mysql.format(query, table);
        connection.query(query, function(err, rows) {
            if (err) {
                console.log(err);
                res.json({
                    "Error": true,
                    "Message": "Error executing MySQL query"
                });
            } else {
                // var query = 'INSERT INTO  application_role (role_id, app_id) VALUES (1, "' + application.app_id + '")';
                // var table = ["application_role"];
                // query = mysql.format(query, table);
                // connection.query(query, function(err, rows) {
                //     if (err) {
                //         console.log(err);
                //         res.json({
                //             "Error": true,
                //             "Message": "Error executing MySQL query, Application role is not set!"
                //         });
                //     } else {
                res.json({
                    "Error": false,
                    "Message": "Registration Successfull " + application.app_name
                });
                // }
                // });
            }
        });
    });

};

module.exports = REST_ROUTER;