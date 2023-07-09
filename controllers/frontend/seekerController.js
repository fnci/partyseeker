import Party from '../../models/party.js';
import Users from '../../models/users.js';
import Groups from '../../models/groups.js';
import {Op} from 'sequelize';
import moment from 'moment';

const searchResults = async(req, res, next) => {
    // Read data from the url
    /* console.log(req.query); */
    const {category, title, city, country} = req.query;
    let query;
    if(category === ''){
        query = ''
    } else {
        query = `where: {
            categoryId: { [Op.eq]: ${category} }
        }`
    }
    // Filter parties by search terms
    const parties = await Party.findAll({
        where: {
            title: { [Op.iLike]: '%' + title + '%' },
            city: { [Op.iLike]: '%' + city + '%'},
            country: { [Op.iLike]: '%' + country + '%'}
        },
        include: [
            {
                model: Groups,
                query
            },
            {
                model: Users,
                attributes: ['id', 'name', 'image']
            }
        ]
    });
    res.render('search', {
        pageTitle: 'Search Results',
        parties,
        moment
    });
}


export default searchResults;