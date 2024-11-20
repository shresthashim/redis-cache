import express from "express";
import mongoose from "mongoose";
import fs from "fs";

// Initialize Express app
const app = express();

// MongoDB connection URI
const mongoURI = "mongodb://root:root@localhost:27017/node_cache?authSource=admin";

// Connect to MongoDB
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Connected to MongoDB");

    // Automatically import data when the server starts, but only if no data exists
    importData();
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Define your product schema
const productionSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  specs: Object,
});

// Create the product model
const Product = mongoose.model("Product", productionSchema);

// Function to import data from data.json
const importData = async () => {
  try {
    // Check if products already exist in the database
    const existingProducts = await Product.countDocuments();

    if (existingProducts > 0) {
      console.log("Data already exists in the database. Skipping import.");
      return; // Skip import if data already exists
    }

    // Read the data from the JSON file
    fs.readFile("data.json", "utf8", (err, data) => {
      if (err) {
        console.error("Error reading JSON file:", err);
        return;
      }

      // Parse the JSON data
      const jsonData = JSON.parse(data);

      // Insert the data into the MongoDB collection
      Product.insertMany(jsonData)
        .then(() => {
          console.log("Data successfully inserted into MongoDB");
        })
        .catch((err) => {
          console.error("Error inserting data:", err);
        });
    });
  } catch (err) {
    console.error("Error checking existing data:", err);
  }
};

app.get("/api/products", async (req, res) => {
  try {
    const query = {};

    // Check if a category query parameter exists

    if (req.query.category) {
      query.category = req.query.category;
    }

    // Get the products from the database
    const products = await Product.find(query);

    // Return the products as JSON
    res.json(products);
  } catch (err) {
    console.error("Error getting products:", err);
    res.status(500).send("An error occurred getting products");
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
