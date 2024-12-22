// Chargement des modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require('path');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); // Configurer le dossier statique (CookOmatic)
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// connexion a BD mongoDB
mongoose.connect('mongodb://0.0.0.0:27017/cookingDB', { useNewUrlParser: true });

// Construction d'un model Mongo
const recipeSchema = new mongoose.Schema({
    name: String,
    desc: String,
});
const Recipes = mongoose.model("Recipes", recipeSchema);

// Création d'un model
const pateBolognaise = new Recipes({
    name: "pates à la bolognaise",
    desc: "Un délicieux plat de pates à la sauce bolognaise authentique"
});
//pateBolognaise.save();

const pateCarbonara = new Recipes({
    name: "pates à la carbonara",
    desc: "un delicieux plat de pates à la carbonara façon italienne"
});
//pateCarbonara.save(); // Sauvegarde en BDD

// Recherche d'un model
/*Recipes.find({name : "pates à la bolognaise"}).then((data) => {
    console.log(data);
});*/

// Action des routes
app.get("/signup", function (req, res) {
    const userLoggedIn = false;
    res.render("signup", { userLoggedIn });
});

app.get("/accueil", function (req, res) {
    const userLoggedIn = false;
    res.render("accueil", { userLoggedIn });
});

/*app.post("/", function (req,res) {
    const poids = parseFloat(req.body.poids);  // Assurez-vous que le poids est bien un nombre
    const taille = parseFloat(req.body.taille) / 100;  // Convertir la taille en mètres

    // Calcul de l'IMC
    const imc = poids / (taille * taille);

    // Afficher les résultats
    console.log("Bonjour, ton poids est de " + poids + " Kilos et ta taille est de " + taille + "m");
    console.log("Ton IMC est de " + imc.toFixed(2));  // Afficher l'IMC avec deux décimales

    res.render('index', { imc: imc.toFixed(2) });  // Passer l'IMC à la vue
});*/

app.post("/calcul-imc", function (req, res) {
    // Récupérer le poids et la taille
    const poids = parseFloat(req.body.poids);
    const taille = parseFloat((req.body.taille) / 100);  // Convertir la taille en mètres

    // Calcul de l'IMC
    const imc = poids / (taille * taille);

    let imcCategory = "";
    let imcInfo = "";
    if (imc < 18.5) {
        imcCategory = "imc text-info col-10 col-lg-3 mx-auto p-3 h3 rounded border border-2 border-info text-center bg-light";
        imcInfo = "insuffisance pondérale";
    } else if (imc >= 18.5 && imc < 25) {
        imcCategory = "imc text-success col-10 col-lg-3 mx-auto p-3 h3 rounded border border-2 border-info text-center bg-light";
        imcInfo = "poids normal";
    } else if (imc >= 25 && imc < 30) {
        imcCategory = "imc text-warning col-10 col-lg-3 mx-auto p-3 h3 rounded border border-2 border-info text-center bg-light";
        imcInfo = "obésité";
    } else {
        imcCategory = "imc text-danger col-10 col-lg-3 mx-auto p-3 h3 rounded border border-2 border-info text-center bg-light";
        imcInfo = "obésité morbide";
    }

    // Envoyer l'IMC en réponse JSON
    res.json({ imc: imc.toFixed(2), imcCategory: imcCategory, imcInfo: imcInfo });
});

// Ecoute du serveur port 3000
app.listen(3000, function () {
    console.log("serveur en ligne");
});