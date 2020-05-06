const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema ({
    Manufacturer : {
        type: String,
        required: true
    },
    Model : {
        type: String,
        required: true
    },
    Price: {
        type: Number,
        required: true
    },
    Color : {
        type: String,
        required: true
    },
    Storage : {
        type: String,
        required: true
    },
    ImageURL : {
        type: String,
        required: true
    }
});

module.exports = mongoose.model ('Product', productSchema);