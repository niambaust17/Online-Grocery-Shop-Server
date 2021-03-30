const express = require('express')

const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(bodyParser.json())
const port = process.env.PORT || 5050;

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${ process.env.DB_USER }:${ process.env.DB_PASS }@cluster0.o1cg3.mongodb.net/${ process.env.DB_NAME }?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', function (req, res)
{
    res.send('Server connected')
})

client.connect(err =>
{
    const collection = client.db("test").collection("devices");
    console.log('database connected');
});


app.listen(port)