const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.flmhf7e.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    const jobsCollection = client.db('jobHuntDB').collection('jobs')
    const appliedCollection = client.db('jobHuntDB').collection('applied')

    app.post('/job', async (req, res) => {
      const jobData = req.body;
      console.log('jobData');
      const result = await jobsCollection.insertOne(jobData);
      res.send(result);
    })

    app.get('/job', async (req, res) => {
      const cursor = jobsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

   

    app.get('/job/:category', async (req, res) => {
      const category = req.params.category;
      const job = await jobsCollection.find({ category: category }).toArray();
      res.json(job);
    })


    app.get('/jobs/:name', async (req, res) => {
      const name = req.params.name;
      const job = await jobsCollection.find({ name: name }).toArray();
      res.json(job);
    })

    

    app.get('/jobDetails/:id', async ( req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id : new  ObjectId(id)}
      const result = await jobsCollection.findOne(query);
      res.send(result);
   })


   app.post('/applied', async(req, res) => {
    const appliedData = req.body;
    console.log('appliedData', appliedData);
    const result = await appliedCollection.insertOne(appliedData);
    res.send(result);
 })


 app.get('/applied/:applicant', async (req, res) => {
  const applicant = req.params.applicant;
  const job = await appliedCollection.find({ applicant: applicant }).toArray();
  res.json(job);
})


app.delete('/delete/:id', async(req, res)=>{
  const deleteId = req.params.id;
  console.log(deleteId);
  const query = {_id : new ObjectId(deleteId)}
  const result = await jobsCollection.deleteOne(query)
  console.log(result)
  res.send(result)
  console.log(query)
})

  // app.put('/job/:id', async(req, res) =>{
  //     const id = req.params.id;
  //     const filter = {_id: new ObjectId(id)}
  //     const options = {upsert: true};
  //     const jobDetails = req.body;
  //     const Product = {
  //         $set: {
  //             image: jobDetails.image,
  //             date: jobDetails.date,
  //             name: jobDetails.name, 
  //             title: jobDetails.title, 
  //             category: jobDetails.category, 
  //             salary: jobDetails.salary, 
  //             description: jobDetails.description, 
  //             deadline: jobDetails.deadline, 
  //             rating: jobDetails.rating
  //         }
  //     }

  //     const result = await jobsCollection.updateOne(filter, Product, options);
  //     res.send(result);
  // })










    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get('/', (req, res) => {
  res.send('JobHunt server is running')
})
app.listen(port, () => {
  console.log(`JobHunt  is running on port : ${port}`)
})