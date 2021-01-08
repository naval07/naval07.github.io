'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let PostSchema = Schema({
    text: String,
    image: String,
    created_at: String,
    user: {type:Schema.ObjectId, ref:'User'}
})

module.export = mongoose.model('Post', PostSchema);