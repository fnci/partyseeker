import Categories from '../models/categories.js';
import Party from '../models/party.js';
import Groups from '../models/groups.js';
import Users from '../models/users.js';
import moment from 'moment';
import {Op} from 'sequelize';

const home = async(req, res) => {
    // Promise for queries on the frontpage home
    const queries = [];
    queries.push(Categories.findAll({}));
    queries.push(Party.findAll({
        attributes: ['title', 'host', 'date', 'hour', 'image', 'address', 'city', 'url', 'slug'],
        where: {
            date: {[Op.gte]: moment(new Date()).format('YYYY-MM-DD')}
        },
        limit: 3,
        order: [
            ['date','ASC']
        ],
        include: [
            {
                model: Users,
                attributes: ['name', 'image']
            },
            {
                model: Groups,
                attributes: ['name', 'image']
            }
        ]
    }));
    // Destructuring
    const [categories, parties] = await Promise.all(queries)
/*     console.log(parties);
    console.log(parties.length); */
        res.render('home', {
            pageTitle: 'Home page',
            categories,
            parties,
            moment
        })
};

export default home;