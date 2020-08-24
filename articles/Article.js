const Sequelize = require("sequelize");
const connection = require("../database/database");
const Category = require("../categories/Category");

const Article = connection.define('articles', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    }, 
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

//relacionamento entre artigo e categoria (1:1)
Article.belongsTo(Category);
//relacionamento entre categoria e artigo (1:n)
Category.hasMany(Article);

module.exports = Article;