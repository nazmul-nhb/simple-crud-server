import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// nazmulnhb
// hd3GjlbxxBIgPWuZ

const uri = "mongodb+srv://nazmulnhb:hd3GjlbxxBIgPWuZ@cluster0.qmbsuxs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const database = client.db("usersDB");
        const userCollection = database.collection("users");
        // or
        // const userCollection = client.db('usersDB').collection('users)

        // send to client
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find()
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const user = await userCollection.findOne(query);
            res.send(user);
        })

        // save in database
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log('new user: ', user);
            const result = await userCollection.insertOne(user);
            res.send(result);
        });

        // update user on mongodb
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const user = req.body;
            console.log(id, ':', user);
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updatedUser = {
                $set: {
                    name: user.name,
                    email: user.email
                }
            }
            const result = await userCollection.updateOne(filter, updatedUser, options);
            res.send(result);
        })

        // delete data from db
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            console.log('please, delete id: ', id);
            const query = { _id: new ObjectId(id) }
            const result = await userCollection.deleteOne(query);
            res.send(result);
        });


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 3 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Simple CRUD is Running')
})

app.listen(port, () => {
    console.log(`Simple CRUD is Running on Port ${port}`);
})