import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

// Connects to MongoDB
try {
    const m = await mongoose.connect(process.env.DB_URI)
    console.log(m.connection.readyState === 1 ? "Connected to MongoDB" : "Failed to connect to MongoDB") // 1 means connected to MongoDB
} catch (error) {
    console.log(error)
}

// Closes the connection to MongoDB
const closeConnection = () => {
    console.log("Closing connection to MongoDB")
    mongoose.connection.close()
}

/* Schema & Models */
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, // Username is required and must be unique
    password: { type: String, required: true }, // Password is required and must be a string
    salt: { type: String, required: true }, // Salt is required and must be a string
    isOrganiser: { type: Boolean, default: false }, // isOrganiser is a boolean and defaults to false
    picture: { type: String }, // Picture is a string
    description: { type: String }, // Description is a string
    animes: [{ type: String }], // Animes is an array of strings
    characters: [{ type: String }], // Characters is an array of strings
    actors: [{ type: String }], // Actors is an array of strings
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }], // Events is an array of references to the Event model
    isAdmin: { type: Boolean, default: false }, // isAdmin is a boolean and defaults to false
    date_created: { type: Date, default: Date.now }, // Date the user was created
})
const User = mongoose.model("User", userSchema)

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    // TODO: Add a field for location
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    // TODO: Add a field for the image URL
    anime: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    organiser: { type: String, required: true },
    price: { type: Number },
    rsvp: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    date_created: { type: Date, default: Date.now },
    date_last_edited: { type: Date },
})
const Event = mongoose.model("Event", eventSchema)

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
})
const Category = mongoose.model("Category", categorySchema)

const refreshTokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
})
const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema)

/* Exports */
export { closeConnection, Category, Event, User, RefreshToken }
