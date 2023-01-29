require('dotenv').config();


module.exports = (error, req, res, next) => {
    try {
        if (process.env.ENV == 'development') {
            console.log(error);
            return res.status(500).send("Something broke! See Console");
        } else {
            return res.render('error', { pageTitle: "Error 500" })
        }
    } catch (error) {
        if (process.env.ENV == 'development') {
            console.log(error);
            return res.status(500).send("Something broke! See Console");
        }
        process.exit(1);
    }
}