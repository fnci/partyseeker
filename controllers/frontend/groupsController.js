import Party from '../../models/party.js';
import Groups from '../../models/groups.js';
import moment from 'moment';

const showGroup = async(req, res, next) => {
    const queries = [];
    queries.push(Groups.findOne({where: {id:req.params.id}}));
    queries.push(Party.findAll({
        where: {groupId:req.params.id},
        order: [
            ['date', 'ASC']
        ]
    }));
    const [group, parties] = await Promise.all(queries);
        // If the group doesn't exist
    if(!group) {
        res.redirect('/');
        return next();
    };
    // Pass the result to the view
    res.render('show-group', {
        pageTitle: `Group Information: ${group.name}`,
        group,
        parties,
        moment
    });
}


export {showGroup}