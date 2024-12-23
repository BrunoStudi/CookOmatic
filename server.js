// Chargement des modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const passportLocalMongoose = require("passport-local-mongoose");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); // Configurer le dossier statique (CookOmatic)
app.use(express.json());

// initialisation du moteur EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// initialisation de la session
app.use(session({
    secret: "mySecret",
    resave: false,
    saveUninitialized: false
}));

// initialisation du passport
app.use(passport.initialize());
app.use(passport.session());

// connexion a mongoDB
mongoose.connect('mongodb+srv://testDb:Asmae1985@cluster0.wy6vp.mongodb.net/omaticdb?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true }); //mongodb://0.0.0.0:27017/cookingDB

// Models
const User = require("./models/user");

// passport mongoose
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Variables
//let userLoggedIn = false;

// Action des routes GET
app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/signup", function (req, res) {
    res.render("signup");
});

app.get("/accueil", function (req, res) {
    res.render("accueil");
});

// Action des routes POST
app.post("/login", async function (req, res) {

    try {
        const foundUser = await User.findOne({ pseudo: req.body.pseudo });

        if (foundUser) {
            bcrypt.compare(req.body.pwd, foundUser.password, function (err, result) {
                if (result) {
                    userLoggedIn = true;
                    res.render("accueil");
                } else {
                    res.status(401).send("Mot de passe incorrect");
                }
            });
        } else {
            res.status(404).send("Utilisateur non trouvé");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur serveur");
    }
});

app.post("/signup", function (req, res) {

    const newUser = new User({
        pseudo: req.body.pseudo,
        username: req.body.name,
        userlastname: req.body.lastname
    });
    User.register(newUser, req.body.pwd, function (err, user) {
        if (err) {
            console.error(err);
            return res.status(500).send("Erreur serveur");
        }
        if (!user) {
            return res.status(400).send("Authentification échouée");
        }
        req.logIn(user, function (err) {
            if (err) {
                console.error(err);
                return res.status(500).send("Erreur serveur");
            }
            res.redirect("accueil");
        });
    });
});

// Action IMC
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