import Groups from "../models/groups.js";


// Show form new party

const partyController = async (req, res) => {
    const groups = await Groups.findAll({where: { userId: req.user.id}});
    res.render('new-party', {
        pageTitle: 'New Party',
        groups
    })
}

export {partyController}