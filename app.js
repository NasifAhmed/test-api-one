const { MongoClient } = require("mongodb");
const express = require("express");
require("dotenv").config();
const app = express();
app.use(express.json());

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let db, collection;

async function connectDB() {
    try {
        await client.connect();
        db = client.db("test-api");
        collection = db.collection("test-api-one");
        console.log("Connected to MongoDB Atlas");
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
    }
}

// Connect to database
connectDB().then(() => {
    // Start server only after DB connection is established
    app.listen(3000, () => {
        console.log("API running at http://localhost:3000");
    });
});

// GET all items
app.get("/users", async (_req, res) => {
    const items = await collection.find().toArray();
    res.json(items);
});

// GET one item
app.get("/users/:id", async (req, res) => {
    const item = await collection.findOne({ id: req.params.id });
    res.json(item);
});

// POST new item
app.post("/users", async (req, res) => {
    const result = await collection.insertOne(req.body);
    res.json(result);
});

// PUT update item
app.put("/users/:id", async (req, res) => {
    const result = await collection.updateOne(
        { _id: req.params.id },
        { $set: req.body }
    );
    res.json(result);
});

// DELETE item
app.delete("/users/:id", async (req, res) => {
    const result = await collection.deleteOne({
        _id: req.params.id,
    });
    res.json(result);
});
