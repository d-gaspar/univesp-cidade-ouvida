const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())

/* app.get("/", (req, res) =>{
    res.send("hello world")
}); */

app.post('/api/insert', (req, res) => {
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;

    console.log('TESTE: ' + latitude + ' ' + longitude);

    app.get('/api/get', (req, res) => {
        res.send({city: "CIDADE", state: "ESTADO"});
    })
})



app.listen(3001, () => {
    console.log('running on port 3001');
})