// 用户新增ID 自增表 
const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
  _id: String,
  sequence_value: Number
})

module.exports = mongoose.model("counter", userSchema, "counters")