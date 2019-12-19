let express = require('express')
let bodyParser = require('body-parser')
let axios = require('axios')
let cors = require('cors')
let fs = require('fs')
let app = express()
app.use(cors())
let router = express.Router()
app.use(bodyParser.json({
    type: 'application/json'
}))

const command = './generateCluster'
const command2 = './generatePaths'

async function getClusters(){
    var promiseForClusters = new Promise(function (resolve, reject) {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject();
                return;
            }
            else{
                resolve();
            }
        });
    })
    await promiseForClusters;
    return JSON.parse(fs.readFileSync('./coords2.json')).data;
}

async function getSomethingMoreDone(){
    var promiseForClusters = new Promise(function (resolve, reject) {
        exec(command2, (error, stdout, stderr) => {
            if (error) {
                reject();
                return;
            }
            else{
                resolve();
            }
        });
    })
    await promiseForClusters;
    return JSON.parse(fs.readFileSync('./distances2.json')).data;
}

app.post('/upload', (req, res) => {
    var data = req.body;
    fs.writeFileSync('coords.json', JSON.stringify(data));
    getClusters().then((dt1) => {
        getAllPathDistances(dt1).then((dt2) => {
            fs.writeFileSync('distances.json', JSON.stringify(dt2));
            getSomethingMoreDone().then((dt3) => {
                res.json(dt3);
                res.end();
            })
        }).catch((err)=>{res.json({err});res.end();});
    }).catch((err)=>{res.json({err});res.end();});
})

app.get('/nigga', (req, res) => {
    let sucker = "CUNT"
    res.json(sucker);
    res.end();
})

app.use('/', router)
app.listen(8000)