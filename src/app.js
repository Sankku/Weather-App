const express = require('express');
const hbs = require("hbs");
const passport = require("passport")
const path = require("path");
const app = express();

const weatherData = require('../utils/weatherData');

const port = process.env.PORT || 3000

const publicStaticDirPath = path.join(__dirname, '../public')

const viewsPath = path.join(__dirname, '../templates/views');

const partialsPath = path.join(__dirname, '../templates/partials');

app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);
app.use(express.static(publicStaticDirPath));

app.use(express.urlencoded({ extended: true}));

app.get("/login", (req, res) => {
    // Mostrar el formulario de Login
    res.render("login");
})

app.get('', (req, res) => {
    res.render('index.hbs', {
        title: 'Weather App'
    });
});


//localhost:3000/weather?
app.get('/weather', (req, res) => {
    const address = req.query.address
    if(!address) {
        return res.send({
            error: "You must enter address in search box"
        })
    }

    weatherData(address, (error, {temperature, description, cityName} = {}) => {
        if(error) {
            return res.send({
                error
            })
        }
        console.log(temperature, description, cityName);
        res.send({
            temperature,
            description,
            cityName
        })
    })
});

app.get("*", (req, res) => {
    res.render('404', {
        title: "Page not found"
    });
});

app.listen(port, () => {
    console.log("Server is up and running on port: ", port)
});