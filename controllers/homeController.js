const home = (req, res) => {
        res.render('home', {
            pageTitle: 'Home page'
        })
};

export default home;