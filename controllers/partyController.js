import Party from "../models/party.js";
import Categories from '../models/categories.js';
import Groups from "../models/groups.js";
import multer from 'multer';
import fs from 'fs';
import { nanoid } from 'nanoid'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const multerConfig = {
    limits: { fileSize: 10000000 },
    storage: multer.diskStorage({
        destination: (req, file, next) => {
            next(null, __dirname + '/../public/uploads/parties/');
        },
        filename: (req, file, next) => {
            const extension = file.mimetype.split('/')[1];
            next(null, `${nanoid(10)}.${extension}`);
        }
    }),
    fileFilter(req, file, next) {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
            next(null, true);
        }else{
            next(new Error('Invalid file format'), false);
        }
    }
};
const upload = multer(multerConfig).single('image');
// Upload image to the server
const uploadPartyImage = (req, res, next) => {
    upload(req, res, function (error) {
        if(error){
            if(error instanceof multer.MulterError){

                if(error.code === 'LIMIT_FILE_SIZE'){
                req.flash('error', 'The size file exceeds the limit of 10MB');
                } else {
                req.flash('error', error.message);
                }
            } else if (error.hasOwnProperty('message')){
                req.flash('error', error.message);
            }
            res.redirect('back')
            return;
        }else{
            next();
        }
    });
};


// Show form new party
const partyController = async (req, res) => {
    const categories = await Categories.findAll();
    const groups = await Groups.findAll({where: { userId: req.user.id}});
    res.render('new-party', {
        pageTitle: 'New Party',
        categories,
        groups
    });
};

// Store Party
const createParty = async (req, res) => {
    const party = req.body;
    // Assign user
    party.userId = req.user.id;
    // Party image
    party.image = req.file?.filename;
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
};
// Party edit form
const partyEditForm = async(req, res, next) => {
    const query = [];
    query.push(Categories.findAll());
    query.push(Groups.findAll({where: { userId: req.user.id}}));
    query.push(Party.findByPk(req.params.id));
    // return promise
    const [categories, groups, party] = await Promise.all(query);

    if(!groups || !party) {
        req.flash('error', 'Action not allowed');
        res.redirect('/admin');
        return next();
    };
    // Show view
    res.render('edit-party', {
        pageTitle: `Edit Party: ${party.title}`,
        categories,
        groups,
        party
    });
};
// Save the changes on the party
const editParty = async(req, res, next) => {
 const party = await Party.findOne({where : { id: req.params.id, userId: req.user.id }});
 if(!party) {
    req.flash('error', 'Action not allowed');
    res.redirect('/admin');
    return next();
 }
 // Assign value
 const {title,host,date,hour,attendance,description,url,address,city,state,country,lat,lng,categoryId,userId,groupId} = req.body;
    party.title = title;
    party.host = host;
    party.date = date;
    party.hour = hour;
    party.attendance = attendance;
    party.description = description;
    party.url = url;
    party.address = address;
    party.city = city;
    party.state = state;
    party.country = country;
    party.categoryId = categoryId;
    party.userId = userId;
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
};
// show form to edit picture of a party
const editPartyImage = async (req, res) => {
    const party = await Party.findOne({where : { id: req.params.id, userId: req.user.id }});

    res.render('party-image', {
        pageTitle: `Edit Party Image: ${party.title}`,
        party
    });
};
const editPartiesImage = async (req, res, next) => {
    const party = await Party.findOne({where : { id: req.params.id, userId: req.user.id }});
    // Group exist and is valid
    if(!party) {
        req.flash('error', 'You do not have permission to do that.');
        res.redirect('/login');
        return next();
    };
    // If there are an existing and a new image, delete the existing
    if(req.file && party.image){
        const existingImagePath = __dirname + `/../public/uploads/parties/${party.image}`;
        // Delete file with and async fs method
        fs.unlink(existingImagePath, (err) => {
            if(err){
                console.log(err);
            }
            return;
        });
    };
    // If theres a new image, save it.
    if(req.file){
        party.image = req.file.filename;
    };
    await party.save();
    req.flash('success', 'Image Saved Successfully!');
    res.redirect('/admin');
};
// Delete party form
const partyDeleteForm = async(req, res, next) => {
    const party = await Party.findOne({ where : { id: req.params.id, userId: req.user.id }});
    if(!party) {
        req.flash('error', 'Action not allowed');
        res.redirect('/admin');
        return next();
    };
    // If theres an image delete it
    if(party.image){
        const existingImagePath = __dirname + `/../public/uploads/parties/${party.image}`;
        fs.unlink(existingImagePath, (err) => {
            if(err){
                console.log(err);
            }
            return;
        });
    };
    res.render('delete-party', {
        pageTitle: `Delete Party: ${party.title}`
    });
};
const deleteParty = async (req, res) => {
        // Delete Party
        await Party.destroy({
            where: {
                id: req.params.id
            }
        });
        req.flash('success', 'Party Deleted Successfully!');
        res.redirect('/admin');
};

export {partyController, createParty, uploadPartyImage, partyEditForm, editParty, editPartyImage, editPartiesImage, partyDeleteForm, deleteParty};