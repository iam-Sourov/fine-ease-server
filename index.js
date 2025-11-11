const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;

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

        app.get('/', async (req, res) => {
            const result = await transactionCollection.find().toArray();
            res.send(result)
        })

        app.get('/my-transactions', async (req, res) => {
            const email = req.query.email;
            const query = {}
            if (email) {
                query.email = email;
            }
            const result = await transactionCollection.find(query).sort({ amount: -1, date: -1 }).toArray();
            res.send(result)
        })

        app.post('/add-Transaction', async (req, res) => {
            const newTransaction = req.body;
            const result = await transactionCollection.insertOne(newTransaction);
            res.send(result)
        })
        app.put('/transactions/update/:id', async (req, res) => {
            const id = req.params.id;
            const updatedData = req.body;
            const filter = { _id: new ObjectId(id) };
            const data = { $set: updatedData };
            const result = await transactionCollection.updateOne(filter, data);
            res.send(result)
        })

        app.delete('/transaction/delete/:id', async (req, res) => {
            const id = req.params.id;
            const result = await transactionCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(result);
        });

        
    } finally {
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
