const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.Port || 5000;


/// middleware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_user)

/// mongoDB connection


const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_pass}@cluster0.5u6pxxs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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


    /// set database
    const JobCollection = client.db('Job_collection').collection('Jobs');
    const Applied_jobs_collection = client.db("App_job_collect").collection("appliedJobs");

    // jobs
    app.post('/jobs', async (req, res) => {
      const job = req.body;
      console.log(job)
      const result = await JobCollection.insertOne(job);
      res.send(result);
    });


    /* 
    /// find jobs 
    app.get('/jobs', async (req, res) => {
      const cursor = JobCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })
    
    */

    /**
     * 
     * 
     * // find appliedJobs
    app.get('/appliedJobs', async (req, res) => {
      const cursor = Applied_jobs_collection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
     */

    /// appliedJob post
    app.post('/appliedJobs', async (req, res) => {
      const job = req.body;
      const result = await Applied_jobs_collection.insertOne(job);
      res.send(result);
    })


    app.get('/appliedJobs', async (req, res) => {
      console.log(req.query.email);  // This will log the email from the query parameter
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };  // Filters jobs by email
      }
      const result = await Applied_jobs_collection.find(query).toArray();
      res.send(result);  // Sends the filtered results back to the client
    });



    //// find jobs with email
    app.get('/jobs', async (req, res) => {
      console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const result = await JobCollection.find(query).toArray();
      res.send(result);
    })


    //// FOR UPDATE
    app.get('/jobs/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await JobCollection.findOne(query)
      console.log(result)
      res.send(result)
    })

    app.put('/jobs/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const job = req.body;
      console.log(job)
      const updateDoc = {
        $set: {
          Banner_url: job.Banner_url,
          Job_title: job.Job_title,
          name: job.name,
          email: job.email,
          Salary_range: job.Salary_range,
          Job_description: job.Job_description,
          Job_posting_date: job.Job_posting_date,
          Job_applicants_number: job.Job_applicants_number
        },
      };
      const result = await JobCollection.updateOne(filter, updateDoc, options);
      res.send(result)
    })

    // For delete
    app.delete('/jobs/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await JobCollection.deleteOne(query)
      res.send(result)
    })






    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);









app.get('/', (req, res) => {
  res.send("Everything is ok")
})


app.listen(port, () => {
  console.log(`Everything is ok now on port : ${port}`)
})