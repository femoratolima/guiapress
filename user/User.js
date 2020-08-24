const Sequelize = require("sequelize");
const connection = require("../database/database");

const User = connection.define('users', {
    email:{
        type: Sequelize.STRING,
        allowNull: false
    }, 
    pwd:{
        type: Sequelize.STRING,
        allowNull: false
    }
});



module.exports = User;