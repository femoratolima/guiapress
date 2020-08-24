const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const session = require("express-session");

const CategoriesController = require("./categories/CategoriesController");
const ArticlesController = require("./articles/ArticlesController");
const UsersController = require("./user/UsersController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./user/User");

//view engine
app.set('view engine', 'ejs');

//sessions
app.use(session({
    secret: "aiusdquiweuapglhqweioopdasuihj",
    cookie: {
        maxAge: 30000000
    }
}));

//static
app.use(express.static('public'));

//body parser
app.use(bodyParser.urlencoded( {extended: false} ));
app.use(bodyParser.json());

//database
connection
    .authenticate()
    .then(() => {
        console.log("Conexão com o bd efetuada com sucesso!");
    }).catch((error) => {
        console.log(error);
    });

//rotas    
app.use("/", CategoriesController);
app.use("/", ArticlesController);
app.use("/", UsersController);

app.get("/session", (req,res) => {
    req.session.ano = 2020;
    res.send("sessao gerada");
})

app.get("/leitura", (req,res) => {
    res.json({
        ano: req.session.ano
    })
})

app.get("/", (req, res) => {
    Article.findAll({
        order: [
            ['id', 'DESC']
        ],
        limit:4
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render("index", {articles: articles, categories: categories});
        });
    })

});

app.get("/:slug", (req,res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug:slug
        }
    }).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render("article", {article: article, categories: categories});
            });
        }else{
            res.redirect("/");
        }
    }).catch(error => {
        res.redirect("/");
    });
});

app.get("/category/:slug", (req, res) => {
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then( category => {
        if(category != undefined){
            Category.findAll().then(categories => {
                res.render("index", {articles: category.articles, categories: categories});
            })
        }else{
            res.redirect("/");
        }
    }).catch(error => {
        res.redirect("/");
    });
});

app.listen(8080, () => {
    console.log("Servidor inicializado!")
});