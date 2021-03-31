const express = require('express')

const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(bodyParser.json())
const port = process.env.PORT || 5050;

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const uri = `mongodb+srv://${ process.env.DB_USER }:${ process.env.DB_PASS }@cluster0.o1cg3.mongodb.net/${ process.env.DB_NAME }?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', function (req, res)
{
    res.send('Server connected')
})

client.connect(err =>
{
    const productCollection = client.db("onlinegroceryshopdb").collection("products");
    const orderCollection = client.db("onlinegroceryshopdb").collection("orders");

    app.post('/addProduct', (req, res) =>
    {
        const newProduct = req.body;
        console.log(newProduct);
        productCollection.insertOne(newProduct)
            .then(result =>
            {
                res.send(result.insertedCount > 0)
            })
            .then(error => console.log(error))
    })

    app.get('/products', (req, res) =>
    {
        const query = req.query;
        productCollection.find(query)

            .toArray((error, data) =>
            {
                res.send(data);
            })
    })

    app.delete('/product/:id', (req, res) =>
    {
        const id = ObjectID(req.params.id);
        productCollection.findOneAndDelete({ _id: id })
            .then(result =>
            {
                res.json({ success: !!result.value })
            })
            .then(error =>
            {
                console.log(error);
            })
    })

    app.get("/product/:id", (req, res) =>
    {
        const id = ObjectID(req.params.id);
        productCollection.find({ _id: id })
            .toArray((error, data) =>
            {
                res.send(data)
            })
    })

    app.post('/addOrder', (req, res) =>
    {
        const orders = req.body;
        console.log(orders);
        orderCollection.insertOne(orders)
            .then(result =>
            {
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/orders', (req, res) =>
    {
        const query = req.query;
        orderCollection.find(query)

            .toArray((error, data) =>
            {
                res.send(data);
            })
    })
});


app.listen(port)