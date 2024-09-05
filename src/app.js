require('dotenv').config();
const express = require('express')
const pool = require('./db/pool')
const port = 8000
const cors = require('cors');

const app = express()
app.use(express.json())
app.use(cors());


app.get('/', async (req, res) => {
    try {
        const data = await pool.query('SELECT * FROM messageboard')
        res.status(200).send(data.rows)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

app.get('/user', async (req, res) => {
    const username = req.query.username;
    try{
        const data = await pool.query('SELECT * FROM messageboard WHERE username = $1', [username]);
        res.status(200).send(data.rows);
    } catch (err){
        console.log(err);
        res.sendStatus(500);
    }
})


app.post('/new', async (req, res) => {
    // possible post request with possible body:
    // localhost:3000/
    // {
    //     "name":"Friedensschule",
    //     "location": "Duesseldorf"
    // }
    const { username, text } = req.body
    try {
        await pool.query('INSERT INTO messageboard (username, text) VALUES ($1, $2)', [username, text])
        res.status(200).send({ message: "Successfully added child" })
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})


app.get('/setup', async (req, res) => {
    try {
        await pool.query(
          "CREATE TABLE IF NOT EXISTS messageboard(id SERIAL PRIMARY KEY, username VARCHAR(100), text VARCHAR(300))"
        );
        res.status(200).send({ message: "Successfully created table" });
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

app.get("/deleteAll", async (req,res) => {
    try{
        await pool.query(
            "DELETE FROM messageboard"
        );
        res.status(200).send({
            message: "Sucessfully deleted all the content"
        });
    } catch (err){
        console.log(err);
        res.sendStatus(500);
    }
})

app.listen(port, () => console.log(`Server has started on port: ${port}`))