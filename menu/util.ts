import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Menu, PopulatedMenu} from './model';

type MenuResponse = {
    _id: string;
    owner: string;
    entries: Array<{name: string, url: string}>;
    dateModified: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
 const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

 /**
  * Transform a raw Menu object from the database into an object
  * with all the information needed by the frontend
  */
 const constructMenuResponse = (menu: HydratedDocument<Menu>): MenuResponse => {
    const menuCopy: PopulatedMenu = {
        ...menu.toObject({
            versionKey: false
        })
    };

    return {
        _id: menuCopy._id.toString(),
        owner: menuCopy.ownerId.username,
        entries: menuCopy.entries,
        dateModified: formatDate(menuCopy.dateModified)
    };
 };

 export {
    constructMenuResponse
 };