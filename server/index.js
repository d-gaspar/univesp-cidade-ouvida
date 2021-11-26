const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const mysql = require('mysql')

app.use(bodyParser.urlencoded({ extended: true }))
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

/* get complaint registered */
app.get('/api/registers', (req, res) => {
    const cityID = req.query.cityID
    const neighborhoodQuery = '%' + req.query.neighborhoodQuery + '%'

    console.log('data received from client: ' + cityID + ' ' + neighborhoodQuery);

    if (req.query.neighborhoodQuery.length > 0) {
        console.log('AAAAAAAAAAAAAAAA')
        const sqlSelect = `
            SELECT
                complaint_register.neighborhood AS neighborhood,
                complaints.description AS name,
                COUNT(complaint_register.complaint_id) AS value
            FROM
                brazil_cities, complaint_register, complaints
            WHERE
                complaint_register.city_id = brazil_cities.id_cidade AND 
                complaint_register.complaint_id = complaints.id_complaint AND
                brazil_cities.id_cidade = ? AND
                neighborhood LIKE ?
            GROUP BY
                complaint_register.neighborhood, complaint_register.complaint_id
        `
        db.query(sqlSelect, [cityID, neighborhoodQuery], (err, result) => {
            res.send(result);
        })
    } else {
        console.log('BBBBBBBBBBBBBBBBB')
        const sqlSelect = `
        SELECT
            "Todos" AS neighborhood,
            complaints.description AS name,
            COUNT(complaint_register.complaint_id) AS value
        FROM
            brazil_cities, complaint_register, complaints
        WHERE
            complaint_register.city_id = brazil_cities.id_cidade AND 
            complaint_register.complaint_id = complaints.id_complaint AND
            brazil_cities.id_cidade = ?
        GROUP BY
            name, complaint_register.complaint_id
        `
        db.query(sqlSelect, [cityID], (err, result) => {
            res.send(result);
        })
    }


})

/* get complaint list */
app.get('/api/complaint', (req, res) => {
    const sqlSelect = 'SELECT * FROM complaints';
    db.query(sqlSelect, (err, result) => {
        res.send(result);
        /* console.log(result); */
    });
})

/* insert new complaint */
app.post('/api/complaint/insert', (req, res) => {
    const complaintID = req.body.complaintID
    const cityID = req.body.cityID
    const ip = '123456'
    const street = req.body.street
    const neighborhood = req.body.neighborhood

    console.log('INSERT ' + complaintID + ', ' + cityID + ', ' + ip + ', ' + street + ', ' + neighborhood);
    const sqlInsert =
        "INSERT INTO `complaint_register` (`complaint_id`, `city_id`, `ip`, `date`, `street`, `neighborhood`) VALUES (?, ?, ?, CURDATE(), ?, ?)"
    db.query(sqlInsert, [complaintID, cityID, ip, street, neighborhood], (err, result) => {
        res.send("QQQQQQQQQQQQQQQQQQQQQ");
    })
})
/* app.get('/newComplaint', (req, res) => {
    const sqlInsert = 
        "INSERT INTO `complaint_register` (`complaint_id`, `city_id`, `ip`, `date`, `street`, `neighborhood`) VALUES ('1', '303762', '123456', CURDATE(), 'RUA JOSÉ', 'BAIRRO DO CHICO')"
    db.query(sqlInsert, (err, result) => {
        res.send("QQQQQQQQQQQQQQQQQQQQQ");
    })
}) */

/* app.post('/api/insert', (reqPost, resPost) => {
    const latitude = reqPost.body.latitude;
    const longitude = reqPost.body.longitude;

    console.log('TESTE: ' + latitude + ' ' + longitude);
}) */

app.route('/api/city')
    .post((req, res) => {
        const latitude = req.body.latitude;
        const longitude = req.body.longitude;

        /* console.log('data received from client: ' + latitude + ' ' + longitude); */
    }).get((req, res) => {
        /* search city given latitude and longitude */
        const latitude = req.query.latitude
        const longitude = req.query.longitude
        console.log('data received from client: ' + latitude + ' ' + longitude);

        var cityID = 'ID'
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
                    acos(cos(radians(?)) * 
                    cos(radians(LATITUDE)) * 
                    cos(radians(LONGITUDE) - 
                    radians(?)) + 
                    sin(radians(?)) * 
                    sin(radians(LATITUDE)))
                ) as dist_km
            FROM
                cidade_ouvida.brazil_cities
            ORDER BY dist_km
            LIMIT 1
            `;
        db.query(sqlSelect, [latitude, longitude, latitude], (err, result) => {
            if (result.length > 0) {
                city = result[0].nome
                cityID = result[0].id_cidade
                /* res.send({ city: result[0].nome, state: state }) */
                /* console.log(result[0]) */
            } else {
                console.log(result.length + ' results')
            }

            res.send({ id: cityID, city: city, state: state })
        })
        /* console.log(sqlSelect); */

        /* res.send({city: city, state: state}); */
    })

app.listen(3001, () => {
    console.log('running on port 3001');
})