var util = require('util');
var fs = require("fs");

var obj = { todolist: [ ] };

module.exports = function(app) {

    app.get('/', function(req, res) {
        res.render('index.html', { title: "welcome to my Todo List App" });
    });

    app.get('/welcome', function(req, res) {
        res.render('welcome.html');
    });

    app.get('/secure', function(req, res) {
        res.render('secure.html');
    });

    app.get('/login', function(req, res) {
        res.render('login.html');
    });

    app.post('/login', function(req, res) {
        var user = req.body.username;
        var pass = req.body.password;
        fs.readFile('login.json', function(err, data) {
            if (err) {
                return res.send(400, err)
            }
            var json = JSON.parse(data);
            if (json.userName === user && json.password === pass) {
                req.session.authenticated = true;
                res.redirect('/secure');
            } else {
                res.render('login.html', { err: "username or password is invalid" });
            }
         });
    });

    app.post('/secure', function(req, res) {
        obj.todolist.push(req.body.newtodo);
        var json = JSON.stringify(obj);

        fs.writeFile('dummy.json', json, function(err) {
            if (err) {
                return console.error(err);
            }
        });
        console.log(obj.todolist)
        res.render('secure.html', { todolist: obj.todolist });
    })

    app.put('/todo/:id', function(req, res) {
        console.log(req.body.newval);
        console.log(req.body.oldval);
        var new1 = req.body.newval;
        var old = req.body.oldval;

        fs.readFile('dummy.json', function(err, data) {
            if (err) {
                return res.send(400, err)
            }
            var json = JSON.parse(data);

            for (var i = 0; i < obj.todolist.length; i++) {
                if (obj.todolist[i] == old) {
                    obj.todolist[i] = new1;
                    break;
                }
            }
            var newjson = JSON.stringify(obj);
            fs.writeFile('dummy.json', newjson, function(err) {
                if (err) {
                    return res.send(400, err);
                } else {
                    return res.send('updated')
                }

            });
        });
    });

    app.delete('/todo/:text', function(req, res) {
        var text = req.params.text;
        console.log(text);
        fs.readFile('dummy.json', function(err, data) {
            if (err) {
                return res.send(400, err)
            }
            var json = JSON.parse(data);
            obj.todolist.splice(text, 1);
            var newjson = JSON.stringify(obj);
            fs.writeFile('dummy.json', newjson, function(err) {
                if (err) {
                    return res.send(400, err);
                } else {
                    return res.send('deleted')
                }

            });
        });
    });

    app.get('/logout', function(req, res) {
        delete req.session.authenticated;
        res.redirect('/');
    });
};
