const mongoose = require('mongoose');
const { Schema } = mongoose;

const Record = new Schema({
    task_descr: String,
    task_state: Boolean
});
 
module.exports = mongoose.model('Record', Record);
