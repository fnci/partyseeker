import Party from '../../models/party.js';
import Users from '../../models/users.js';
import Groups from '../../models/groups.js';
import Categories from '../../models/categories.js';
import Comments from '../../models/comments.js';
import {Sequelize} from 'sequelize';
import {Op} from 'sequelize';
import moment from 'moment';


// Show party view
const showParty = async(req, res, next) => {
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
        return next();
    }
    // Check nearby parties
    const location = Sequelize.literal(`ST_GeomFromText('POINT(${party.location.coordinates[0]} ${party.location.coordinates[1]})')`);
    // Calculate distance of the others parties based on the location of the current party and return the meters in distance.
    const distance = Sequelize.fn('ST_DistanceSphere', Sequelize.col('location'), location);
    // Find nearby parties, nearest first
    const nearbyParties = await Party.findAll({
        where: {
            [Op.and]: [
                {date: {[Op.gte]: moment(new Date()).format('YYYY-MM-DD')}},
                Sequelize.where(distance, {[Op.lte] : 5000})
            ]
        }, // 5km
        order: [distance],
        offset: 1,
        limit: 3, // max 3 nearest parties
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
    /* console.log(nearbyParties); */
    // Add the comments
    const comments = await Comments.findAll({
        where: { partyId: party.id},
        include: [
            {
                model: Users,
                attributes: ['id', 'name', 'image']
            }
        ]
    });
    // Pass the result to the view
    res.render('show-party', {
        pageTitle: party.title,
        party,
        comments,
        nearbyParties,
        moment
    });
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
// Show parties by categories
const showCategory = async(req, res, next) => {
    const category = await Categories.findOne({
        attributes: ['id', 'name'],
        where: { slug: req.params.category}
    });
    if(!category) {
        res.redirect('/');
        return next();
    }
    const parties = await Party.findAll({
        where: { categoryId: category.id },
        include: [
            {
                model: Groups
            },
            {
                model: Users
            }
        ]
    });

    if(!parties) {
        res.redirect('/admin');
        return next();
    }
    res.render('category', {
        pageTitle: `Category: ${category.name}`,
        parties,
        moment
    });

}


export {showParty, confirmAssistance, showAttendees, showCategory}