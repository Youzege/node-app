// 用户规则集合
const mongoose = require('mongoose')
const roleSchema = mongoose.Schema({
  roleName: String,
  remark: String,
  permissionList: {
    checkedKeys: [],
    halfCheckedKeys: []
  },
  createTime: {
    type: Date,
    default: Date.now()
  },//创建时间
  updateTime: {
    type: Date,
    default: Date.now()
  },
})

module.exports = mongoose.model("roles", roleSchema, "roles")