import Party from '../../models/party.js';
import Users from '../../models/users.js';
import Groups from '../../models/groups.js';
import {Sequelize} from 'sequelize';
import moment from 'moment';


// Show party view
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
// Confirm or negate the assistance of the user to the party
const confirmAssistance = async(req, res) => {
    const {check} = req.body
    if(check === 'confirm'){
        // Confirm Assistance
        Party.update(
            {'interested': Sequelize.fn('array_append', Sequelize.col('interested'), req.user.id)},
            {'where': {'slug': req.params.slug}}
        );
        res.send('Confirmed assistance');
    } else {
        // Cancel Assistance
        Party.update(
            {'interested': Sequelize.fn('array_remove', Sequelize.col('interested'), req.user.id)},
            {'where': {'slug': req.params.slug}}
        );
        res.send('Canceled assistance');
    }
}
// Show list of attendees
const showAttendees = async(req, res) => {
    const party = await Party.findOne({
        where: {slug: req.params.slug},
        attributes: ['interested']
    });
    // Get users interested
    const {interested} = party;
    const assistants = await Users.findAll({
        attributes: ['name', 'image'],
        where: {id: interested}
    });
    // Render view and pass data to it
    res.render('party-attendees', {
        pageTitle: 'List of Assistants',
        assistants
    });
}

export {showParty, confirmAssistance, showAttendees}