const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const mysql = require('mysql')

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'mysql123',
    database: 'cidade_ouvida'
});

/* app.get("/", (req, res) =>{
    res.send("hello world")
}); */

app.get('/api/complaint', (req, res) => {
    const sqlSelect = 'SELECT * FROM complaints';
    db.query(sqlSelect, (err, result) => {
        res.send(result);
        /* console.log('AAAAAAAAAAAA'); */
        console.log(result);
        /* console.log('BBBBBBBBBBBB'); */
    });
})

/* app.post('/api/insert', (reqPost, resPost) => {
    const latitude = reqPost.body.latitude;
    const longitude = reqPost.body.longitude;

    console.log('TESTE: ' + latitude + ' ' + longitude);
}) */

app.route('/api/city')
    .post((req, res) => {
        const latitude = req.body.latitude;
        const longitude = req.body.longitude;

        console.log('data received from client: ' + latitude + ' ' + longitude);
    }).get((req, res) => {
        /* search city given latitude and longitude */
        const latitude = req.query.latitude
        const longitude = req.query.longitude
        console.log('data received from client: ' + latitude + ' ' + longitude);

        var city = 'CIDADE'
        var state = 'ESTADO'

        const sqlSelect =
            `
            SELECT
                id_cidade,
                nome,
                LATITUDE,
                LONGITUDE,
                (
                6371 *
                    acos(cos(radians(` + latitude + `)) * 
                    cos(radians(LATITUDE)) * 
                    cos(radians(LONGITUDE) - 
                    radians(` + longitude + `)) + 
                    sin(radians(` + latitude + `)) * 
                    sin(radians(LATITUDE)))
                ) as dist_km
            FROM
                cidade_ouvida.brazil_cities
            ORDER BY dist_km
            LIMIT 1
            `;
        db.query(sqlSelect, (err, result) => {
            if (result.length > 0) {
                city = result[0].nome
                /* res.send({ city: result[0].nome, state: state }) */
                console.log(result[0])
            } else {
                console.log(result.length + ' results')
            }

            res.send({ city: city, state: state })
        })
        console.log(sqlSelect);

        /* res.send({city: city, state: state}); */
    })

app.listen(3001, () => {
    console.log('running on port 3001');
})