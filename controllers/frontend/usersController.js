import Party from '../../models/party.js';
import Users from '../../models/users.js';
import Groups from '../../models/groups.js';
import {Sequelize} from 'sequelize';
import moment from 'moment';


const showUser = async (req, res, next) => {
    const queries = [];
    // synchronous queries
    queries.push(Users.findOne({where: {id: req.params.id}}));
    queries.push(Party.findAll({where: {userId: req.params.id}}));
    queries.push(Groups.findAll({where: {userId: req.params.id}}));
    const [users, parties, groups] = await Promise.all(queries);

    if(!users){
        res.redirect('/');
        return next();
    };
    // display view
    res.render('show-profile', {
        pageTitle: `User profile: ${users.name}`,
        users,
        parties,
        groups
    });
}

export {showUser};