import Groups from '../models/groups.js';
import Party from '../models/party.js';
import moment from 'moment';
import {Op} from 'sequelize';

const adminPanel = async(req, res) => {
    /* const date = new Date().toLocaleString('en-us')
    console.log(date); */
    //query's
    const query = [];
    query.push(Groups.findAll({where: {userId : req.user.id}}));
    query.push(Party.findAll({where: {userId : req.user.id,
        date: {[Op.gte] : moment(new Date()).format("YYYY-MM-DD")}
    }}));
    query.push(Party.findAll({where: {userId : req.user.id,
        date: {[Op.lt] : moment(new Date()).format("YYYY-MM-DD")}
    }}));
    // Array Destructuring
    const [groups, party, previous] = await Promise.all(query);

    res.render('admin', {
        pageTitle: 'Administration Panel',
        groups,
        party,
        previous,
        moment
    });
}


export default adminPanel;