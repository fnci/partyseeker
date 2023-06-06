import Categories from '../models/categories.js';
import Groups from '../models/groups.js';
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
            next(null, __dirname + '/../public/uploads/groups/')
        },
        filename: (req, file, next) => {
            const extension = file.mimetype.split('/')[1];
            next(null, `${nanoid(10)}.${extension}`);
        }
    }),
    fileFilter(req, file, next) {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
            next(null, true);
        }else{
            next(new Error('Invalid file format'), false);
        }
    }
}
const upload = multer(multerConfig).single('image')
// Upload image to the server
const uploadImage = (req, res, next) => {
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
}

const groupController = async (req, res) => {
    const categories = await Categories.findAll();

    res.render('new-group', {
        pageTitle: 'New Group',
        categories
    })
}

// Store groups on db
const createGroup = async(req, res) => {

    const group = req.body;
    // Store the authenticate user creator of the group
    group.userId = req.user?.id;

    group.image = req.file?.filename;


    try {
       // store in db
       await Groups.create(group);
       req.flash('success', 'Group created successfully!');
       res.redirect('/admin');
    } catch (error) {
        const sequelizeError = error.errors?.map(err => err.message);
        req.flash('error', sequelizeError);
        res.redirect('/new-group');
    }
}
// Edit group
const groupEditForm = async (req, res) => {
     const inquiries = [];
     inquiries.push( Groups.findByPk(req.params.groupId));
     inquiries.push( Categories.findAll());
     const [group, categories] = await Promise.all(inquiries);
     res.render('edit-group', {
        pageTitle: `Edit group: ${group.name}`,
        group,
        categories
     })
}
// Save the changes on the db
const editGroup = async (req, res, next) => {
    const group = await Groups.findOne({where: {id : req.params.groupId, userId: req.user.id}});
    // If the group do not belong to this user
    if(!group) {
        req.flash('error', 'You do not have permission to do that.');
        res.redirect('/login');
        return next();
    }
    // Read values
    const {name, description, categoryId, url} = req.body;
    // Assign values
    group.name = name;
    group.description = description;
    group.categoryId = categoryId;
    group.url = url;
    // Save on db
    await group.save();
    req.flash('success', 'Group Successfully Updated!');
    res.redirect('/admin');
}
// show form to edit picture of a group
const editGroupImage = async (req, res) => {
    const group = await Groups.findOne({where: {id : req.params.groupId, userId: req.user.id}});

    res.render('group-image', {
        pageTitle: `Edit Group Image: ${group.name}`,
        group
    })

}
const editImage = async (req, res, next) => {
    const group = await Groups.findOne({where: {id : req.params.groupId, userId: req.user.id}});
    // Group exist and is valid
    if(!group) {
        req.flash('error', 'You do not have permission to do that.');
        res.redirect('/login');
        return next();
    }
/*     // Verify new file
    if(req.file){
        console.log(req.file.filename);
    }
    // Verify existing file
    if(group.image){
        console.log(group.image);
    } */
    // If there are an existing and a new image, delete the existing
    if(req.file && group.image){
        const existingImagePath = __dirname + `/../public/uploads/groups/${group.image}`;
        // Delete file with and async fs method
        fs.unlink(existingImagePath, (err) => {
            if(err){
                console.log(err);
            }
            return;
        })
    }
    // If theres a new image, save it.
    if(req.file){
        group.image = req.file.filename;
    }
    await group.save();
    req.flash('success', 'Image Saved Successfully!');
    res.redirect('/admin')
}

// Form for delete group
const groupDeleteForm = async (req, res, next) => {
    const group = await Groups.findOne({where: {id : req.params.groupId, userId: req.user.id}});
    if(!group){
        req.flash('error', 'You do not have permission to do that.');
        res.redirect('/login');
        return next();
    }
    res.render('delete-group', {
        pageTitle: `Delete Group: ${group.name}`
    })
}
// Delete the group with their image
const deleteGroup = async (req, res, next) => {
    const group = await Groups.findOne({where: {id : req.params.groupId, userId: req.user.id}});
    if(!group){
        req.flash('error', 'You do not have permission to do that.');
        res.redirect('/login');
        return next();
    }
    // If theres an image delete it
    if(group.image){
        const existingImagePath = __dirname + `/../public/uploads/groups/${group.image}`;
        fs.unlink(existingImagePath, (err) => {
            if(err){
                console.log(err);
            }
            return;
        })
    }

    // Delete Group
    await Groups.destroy({
        where: {
            id: req.params.groupId
        }
    });
    req.flash('success', 'Group Deleted Successfully!');
    res.redirect('/admin');

}

export {groupController, createGroup, uploadImage, groupEditForm, editGroup, editGroupImage, editImage, groupDeleteForm, deleteGroup}