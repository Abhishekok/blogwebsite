const express = require('express')
const articleRouter = require("./routes/articles")
const Article = require('./models/article')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const app = express()

mongoose.connect('mongodb+srv://abhi:1234@cluster0.nki2aoh.mongodb.net/')
app.set("views",'./view')
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'))
app.get('/', async(req, res) => {
    const articles =await Article.find().sort({ createdAt:'desc'})
    res.render('articles/index', { articles: articles })
})


app.get("/search", async (req, res) => {
    const searchTerm = req.query.query; 

    try {
        const results = await Article.find({ title: { $regex: searchTerm, $options: "i" } });
        res.render("searchResults", { articles: results });
    } catch (error) {
        console.error("Error searching articles:", error);
        res.status(500).json({ error: "An error occurred while searching articles" });
    }
});
app.get("/random", async (req, res) => {
    try {
        const Article = require('./models/article');
        const count = await Article.countDocuments();
        const randomIndex = Math.floor(Math.random() * count);
        const randomArticle = await Article.findOne().skip(randomIndex);
        res.json(randomArticle);
    } catch (error) {
        console.error("Error fetching random article:", error);
        res.status(500).json({ error: "An error occurred while fetching random article" });
    }
});

app.use('/articles', articleRouter);

app.listen(3000)
