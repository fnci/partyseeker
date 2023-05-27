import Groups from '../models/groups.js';
const adminPanel = async(req, res) => {
    const groups = await Groups.findAll({where: {userId : req.user.id}});
    res.render('admin', {
        pageTitle: 'Administration Panel',
        groups
    })
}


export default adminPanel;