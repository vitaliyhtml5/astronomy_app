const path = require('path');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, '../public'), {
    extensions: ['html']
}));

const getAstroData = require('./astro_data');

app.get('/get_data', (req, res) => {
    try {
        getAstroData(req.query.city, data => res.send(data));
    } catch(err) {
        res.status(500).send({code: 500, message:'Oops, something went wrong. Please try again later'});
    }
});

app.listen(port, () => console.log(`Server is running on ${port} port`));


