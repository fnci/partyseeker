const adminPanel = (req, res) => {
    res.render('admin', {
        pageTitle: 'Administration Panel'
    })
}


export default adminPanel;