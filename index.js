const express = require('express')
const app = express()
const port = 3001
let sentimentController = require('./controller/sentimentController.js')
// let departmentController = require('./controller/departmentController.js')
let departmentModel = require('./models/departmentModel.js')
let complaintModel = require('./models/complaintModel.js')
let trackModel = require('./models/trackModel.js')
const bodyParser = require('body-parser');
app.use(bodyParser());
app.set('view engine', 'ejs');
app.get('/',(req, res) => {
    res.render('home');
});

app.post('/submit',(req, res) => {
    // console.log(req);
    console.log(req.body);
    console.log();
    sentimentController.findUrgency(req,res);
})

app.get('/tracking', (req, res) => {
    res.render('tracking');
})

app.post('/tracking', (req, res) => {
    console.log(req.body['track-id']);
    trackModel.getTrack(req.body['track-id'])
    .then(status => {
        console.log("now here is the " + status);
        return status;
    })
    .then(status => res.render('trackDetails', {status}))
    .catch(err => res.send("Error: "+err))
})

app.get('/department',(req,res) => {
    res.render('login');
})

app.post('/department',(req,res)=>{
    let dept;
    departmentModel.authenticate(req.body['department'],req.body['password'])
    .then(department => {
        console.log(department);
        dept = department;
        return complaintModel.list(department)})
    .then(data => {
        // console.log(dept+"dept");
        // console.log(data['data']['complain_details']);/
        // // console.log(data['data']['complain_details'][0][0])
        // res.render('department', data['data']['complain_details'])})
        return data['data']['complain_details']})
    .then(data => res.render('department', {data}))
    .catch(err => res.send("Error: "+err))
})

app.post('/changeStatus', (req, res)=>{
    console.log("sspu");
    console.log(req.body)
    console.log(req.body['id'], req.body['status'])
    let status;
    if(req.body['finish'] == 'on'){
        status = 'finish'
    }
    else if(req.body['process'] == 'on'){
        status = 'process'
    }
    else if(req.body['notstarted'] == 'on'){
        status = 'notstarted'
    }
    console.log('final status ',status);
    complaintModel.update(req.body['id'], status)
    .then(department => complaintModel.list(department))
    .then(data => {
        // console.log(dept+"dept");
        // console.log(data['data']['complain_details']);
        // // console.log(data['data']['complain_details'][0][0])
        // res.render('department', data['data']['complain_details'])})
        return data['data']['complain_details']})
    .then(data => res.render('department', {data}))
    .catch(err => res.send("Error "+err))
})

app.listen(port, () => console.log(`App listening on port ${port}!`))
