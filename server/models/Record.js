const mongoose = require('mongoose');
const { Schema } = mongoose;

const Record = new Schema({
    task_text: String,
    is_done: Boolean
});
 
module.exports = mongoose.model('Record', Record);
