// Chargement des modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require('path');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); // Configurer le dossier statique (CookOmatic)
app.use(express.json());

// initialisation du moteur EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// connexion a mongoDB
mongoose.connect('mongodb+srv://testDb:Asmae1985@cluster0.wy6vp.mongodb.net/omaticdb?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true }); //mongodb://0.0.0.0:27017/cookingDB

// Models
const User = require("./models/user");

// Action des routes
app.get("/signup", function (req, res) {
    const userLoggedIn = false;
    res.render("signup", { userLoggedIn });
});

app.post("/signup", function (req,res) {
    const user = new User ({
        pseudo: req.body.pseudo,
        username: req.body.name,
        userlastname: req.body.lastname,
        password: req.body.pwd
    });
    user.save()
    .then(() => res.render("accueil"))
    .catch((error) => res.status(500).json({ error }));
});

app.get("/accueil", function (req, res) {
    const userLoggedIn = false;
    res.render("accueil", { userLoggedIn });
});

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