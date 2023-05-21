import Categories from '../models/categories.js';
import Groups from '../models/groups.js';
import multer from 'multer';
import { nanoid } from 'nanoid'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));


const multerConfig = {
    limits: { fileSize: 100000 },
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
                req.flash('error', 'The size file exceeds the limit of 100KB');
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

    res.render('newgroup', {
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
        res.redirect('/newgroup');
    }
}

export {groupController, createGroup, uploadImage}