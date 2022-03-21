const { info, error } = require('../utils/log4j')
const {
  database,
  host,
  port,
  user,
  password
} = require('../config/db').MYSQL_CONF

const Sequelize = require('sequelize')

const sequelize = new Sequelize(database, user, password, {
  port,
  host,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    // 字符集
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    supportBigNumbers: true,
    bigNumberStrings: true
  },
  timezone: '+08:00' //时区转换
});

(async () => {
  try {
    await sequelize.authenticate()
    info(`****数据库连接成功****`)
  } catch (err) {
      error(`****数据库连接失败****`)
  }
})()

sequelize.sync()

module.exports = sequelize
