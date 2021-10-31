const express = require('express') //express require
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors') //middelware
const app = express()
const port = process.env.PORT || 5000; //port
// const bodyParser = require('body-parser') // body parser
require('dotenv').config()

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lqhl2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



app.get('/', (req, res) => {
    res.send('insert the server start')
})

// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     client.close();
// });

async function run() {
    try {
        await client.connect()

        const database = client.db('Travel_curiosity')
        const usersCollection = database.collection('data')
        const ordersCollection = database.collection('orders')

        // GET API
        app.get('/services', async (req, res) => {
            const cursor = usersCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });


        // POST API 
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);

            const result = await usersCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });


        // orders post

        // POST API
        app.post('/orders', async (req, res) => {
            const order = req.body;
            console.log('hit the post api', order);

            const result = await ordersCollection.insertOne(order);
            console.log(result);
            res.json(result)
        });





        // GET API
        app.get('/myorder', async (req, res) => {
            const email = req.query.email;
            const result = await ordersCollection.find({
                email: email,
            }).toArray();
            console.log(email)
            res.send(result);
        });



        // GET API
        app.get('/allorder', async (req, res) => {

            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            // console.log(email)
            res.send(orders);
        });




        app.put("/update/:id", async (req, res) => {
            const id = req.params.id;
            const updatedStatus = req.body;
            console.log(id, updatedStatus)
            const filter = { _id: ObjectId(id) };
            const updateInfo = {
                $set: {
                    status: updatedStatus.status,
                },
            };
            const result = await ordersCollection.updateOne(filter, updateInfo);
            console.log(result);
            res.send(result);
        });





        // DELETE API
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        })


        // DELETE API
        app.delete('/allorders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        })

    }
    finally {
        // await client.close()
    }
}

run().catch(console.dir);




app.listen(port, () => {
    console.log('listening at port ', port);
})