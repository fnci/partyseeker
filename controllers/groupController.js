import Categories from '../models/categories.js'
import Groups from '../models/groups.js';

export const groupController = async (req, res) => {
    const categories = await Categories.findAll();

    res.render('newgroup', {
        pageTitle: 'New Group',
        categories
    })
}

// Store groups on db
export const createGroup = async(req, res) => {

    const group = req.body;
    // Store the authenticate user creator of the group
    group.userId = req.user.id;


    try {
       // store in db
       await Groups.create(group);
       req.flash('success', 'Group created successfully!');
       res.redirect('/admin');
    } catch (error) {
        const sequelizeError = error.errors?.map(err => err.message);
        req.flash('error', sequelizeError);
        res.redirect('/newgroup');
    }
}
export default {groupController, createGroup}