const mongoose = require('mongoose')
const menuSchema = mongoose.Schema({
  menuType: Number,
  menuName: String,
  menuCode: String, //权限标识
  path: String, //路由地址
  icon: String, //图标
  component: String, //组件 
  menuState: Number,
  parentId: [mongoose.Types.ObjectId],
  "createTime": {
    type: Date,
    default: Date.now()
  },//创建时间
  "lastLoginTime": {
    type: Date,
    default: Date.now()
  },//更新时间
})

module.exports = mongoose.model("menu", menuSchema, "menus")