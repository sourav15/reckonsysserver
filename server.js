const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const _ = require('underscore');
const moment = require('moment');

const app = (module.exports = express());
app.use(bodyParser.json());

app.post('/api/login', (req, res) => {
  fs.readFile('user.json', 'utf8', (err, data) => {
    if (err) {
      res.send({ status: 'failed' });
    } else {
      const userObj = JSON.parse(data);
      if (_.findWhere(userObj.table, req.body)) {
        res.send({ status: 'success' });
      } else {
        res.send({ status: 'failed' });
      }
    }
  });
});

app.get('/api/members', (req, res) => {
  fs.readFile('members.json', 'utf8', (err, data) => {
    if (err) {
      res.send({ status: 'failed' });
    } else {
      const members = JSON.parse(data);
      res.send({status: 'success', members: members.table});
    }
  });
});

app.post('/api/search', (req, res) => {
  fs.readFile('members.json', 'utf8', (err, data) => {
    if (err) {
      res.send({ status: 'failed' });
    } else {
      const members = JSON.parse(data);
      const filteredMembers = members.table.filter(
        item => (item.name === req.body.name || item.id.toString() === req.body.name)
      );
      res.send({status: 'success', members: filteredMembers});
    }
  });
});

app.post('/api/newmember', (req, res) => {
  fs.readFile('members.json', 'utf8', (err, data) => {
    if (err) {
      res.send({ status: 'failed' });
    } else {
      let members = JSON.parse(data);
      members.table.push({id: Math.floor(Math.random() * (100 - 1)) + 1,
        name:req.body.name,
        section1:1,
        section2:0,
        section3:1,
        section4:0,
        joinDate:moment().format("DD-MM-YYYY"),
        status:"active"});
      json = JSON.stringify(members);
      fs.writeFile('members.json', json, 'utf8', err => {
        if (err) {
          res.send({ status: 'failed' });
        } else {
          res.send({ status: 'success' });
        }
      });
    }
  });
});

app.post('/api/deletemember', (req, res) => {
  fs.readFile('members.json', 'utf8', (err, data) => {
    if (err) {
      res.send({ status: 'failed' });
    } else {
      let members = JSON.parse(data);
      const filteredMembers = members.table.filter(
        item => item.id !== req.body.id
      );
      console.log(req.body.id);
      members.table = filteredMembers;
      json = JSON.stringify(members);
      fs.writeFile('members.json', json, 'utf8', err => {
        if (err) {
          res.send({ status: 'failed' });
        } else {
          res.send({ status: 'success' });
        }
      });
    }
  });
});

const server = app.listen(4000, function() {
  const host = server.address().address;
  const port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
module.exports = app;
