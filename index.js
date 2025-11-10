const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors());
app.use(express.json());
//fineEase
//cTIcYol15sjUcVMB
const uri = "mongodb+srv://fineEase:cTIcYol15sjUcVMB@mystic.fupfbwc.mongodb.net/?appName=Mystic";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

app.get('/', (req, res) => {
    res.send('sss World!')
})

async function run() {
    try {
        await client.connect();

        const db = client.db("finease")

        const transactionCollection = db.collection('transaction')

        app.get('/my-transactions', async (req, res) => {

        })

        app.post('/addTransaction', async (req, res) => {
            const newTransaction = req.body;
            const result = await addTransactionCollection.insertOne(newTransaction);
            res.send(result)
        })

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

