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


export {partyController, createParty};