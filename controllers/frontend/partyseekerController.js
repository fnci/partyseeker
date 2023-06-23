import Party from '../../models/party.js';
import Users from '../../models/users.js';
import Groups from '../../models/groups.js';
import moment from 'moment';



const showParty = async(req, res) => {
    const party = await Party.findOne({
       where: {
        slug: req.params.slug
       },
       include: [
        {
            model: Users,
            attributes: ['id', 'name', 'image']
        },
        {
            model: Groups
        }
       ]
    });
    // If the party doesn't exist
    if(!party) {
        res.redirect('/');
    }
    // Pass the result to the view
    res.render('show-party', {
        pageTitle: party.title,
        party,
        moment
    })
}



export {showParty}