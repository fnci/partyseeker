import Groups from "../models/groups.js";
import Party from "../models/party.js";


// Show form new party
const partyController = async (req, res) => {
    const groups = await Groups.findAll({where: { userId: req.user.id}});
    res.render('new-party', {
        pageTitle: 'New Party',
        groups
    })
}

// Store Party
const createParty = async (req, res) => {
    const party = req.body;
    // Assign user
    party.userId = req.user.id;
    // Store location with point
    const point = {
        type: 'Point',
        coordinates: [
            parseFloat(req.body.lat),
            parseFloat(req.body.lng)
        ]
    };
    party.location = point;
    // Optional Attendance
    if(req.body.guests === 0) {
        party.guests = 0;
    };

    // Save party on database
    try {
        await Party.create(party);
        req.flash('success', 'Party created successfully');
        res.redirect('/admin');
    } catch (error) {
        const sequelizeError = error.errors?.map(err => err.message);
        req.flash('error', sequelizeError);
        res.redirect('/new-party');
    };
}
// Show party edit form
const partyEditForm = async(req, res, next) => {
    const query = [];
    query.push(Groups.findAll({where: { userId: req.user.id}}));
    query.push(Party.findByPk(req.params.id));
    // return promise
    const [groups, party] = await Promise.all(query);

    if(!groups || !party) {
        req.flash('error', 'Action not allowed');
        res.redirect('/admin');
        return next();
    }
    // Show view
    res.render('edit-party', {
        pageTitle: `Edit Party: ${party.title}`,
        groups,
        party
    })
}
// Save the changes on the party
const editParty = async(req, res, next) => {
 const party = await Party.findOne({where : { id: req.params.id, userId: req.user.id }});
 if(!party) {
    req.flash('error', 'Action not allowed');
    res.redirect('/admin');
    return next();
 }
 // Assign value
 const {title,host,date,hour,attendance,description,address,city,state,country,lat,lng, groupId} = req.body;
 party.title = title;
 party.host = host;
 party.date = date;
 party.hour = hour;
 party.attendance = attendance;
 party.description = description;
 party.address = address;
 party.city = city;
 party.state = state;
 party.country = country;
 party.groupId = groupId;
 // Assign point of location
 const point = { type: 'point', coordinates: [parseFloat(lat), parseFloat(lng)]}
 party.location = point;
 // Store on db

    try {
        await party.save();
        req.flash('success', 'The changes were saved successfully');
        res.redirect('/admin');
    } catch (error) {
        const sequelizeError = error.errors?.map(err => err.message);
        req.flash('error', sequelizeError);
        res.redirect(`/edit-party/${party.id}`);
    };
}

const partyDeleteForm = async(req, res, next) => {
    const party = await Party.findOne({ where : { id: req.params.id, userId: req.user.id }});
    if(!party) {
        req.flash('error', 'Action not allowed');
        res.redirect('/admin');
        return next();
    }
    res.render('delete-party', {
        pageTitle: `Delete Party: ${party.title}`
    })
}
const deleteParty = async (req, res, next) => {
        // Delete Group
        await Party.destroy({
            where: {
                id: req.params.id
            }
        });
        req.flash('success', 'Party Deleted Successfully!');
        res.redirect('/admin');
}

export {partyController, createParty, partyEditForm, editParty, partyDeleteForm, deleteParty};