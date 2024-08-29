//Written by Aneta Kotas
//For Web Application Developement, CA2
//Year 2024/08/29

//creating schema, which is a base for our database entries
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FactSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    context: {
        type: String, 
        required: true
    },
}, {timestamps: true});

const Fact = mongoose.model("Fact", FactSchema);

module.exports = Fact;