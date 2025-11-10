const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
//fineEase
//cTIcYol15sjUcVMB
const uri = process.env.MONGO_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});



async function run() {
    try {
        await client.connect();

        const db = client.db("finease")
        const transactionCollection = db.collection('transactions')

        // get All Transactionsby Specific user
        app.get('/my-transactions', async (req, res) => {
            const email = req.query.email;
            const query = {}
            if (email) {
                query.email = email;
            }
            const result = await transactionCollection.find(query).toArray()
            res.send(result)
        })

        // Add a Transaction 
        app.post('/add-Transaction', async (req, res) => {
            const newTransaction = req.body;
            const result = await transactionCollection.insertOne(newTransaction);
            res.send(result)
        })

        // Get Signle Transaction by id
        app.get('/transaction/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await transactionCollection.findOne(query);
            res.send(result);
        })

        // update Transaction by id
        app.put('/transactions/update/:id', async (req, res) => {
            const id = req.params.id;
            const updatedData = req.body;
            const filter = { _id: new ObjectId(id) };
            const data = { $set: updatedData };
            const result = await transactionCollection.updateOne(filter, data);
            res.send(result)
        })
        // Delete
        app.delete('/transaction/delete/:id', async (req, res) => {
            const id = req.params.id;
            const result = await transactionCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(result);
        });

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



client.connect()
    .then(() => {
        app.listen(port, () => {
            console.log(`Example app is listening now on port ${port}`)
        })
    })
    .catch(console.dir)

