import type {HydratedDocument, Types} from 'mongoose';
import type {Menu} from './model';
import MenuModel from './model';

/**
 * This files contains a class that has the functionality to explore menus
 * stored in MongoDB, including adding, finding, and deleting menus.
 */
class MenuCollection {
    /**
     * Add a entry to a menu in the collection, create menu if does not exist
     * 
     * @param {string} ownerId - the id of the user adding to their menu
     * @param {string} name - the name of menu item to add
     * @param {string} url - the url of the menu item to add
     * @return {Promise<HydratedDocument<Menu>>} - The newly updated menu
     */
    static async updateOneEntryByUserId(ownerId: Types.ObjectId | string, name: string, url: string): Promise<HydratedDocument<Menu>> {
        const menu = await MenuModel.findOne({ownerId});
        if (!menu) {
            const newMenu = new MenuModel({
                ownerId,
                entries: [{name, url}],
                dateModified: new Date()
            });
            await newMenu.save();
            return newMenu.populate('ownerId');
        }
        menu.entries.push({name, url});
        menu.dateModified = new Date();
        await menu.save();
        return menu.populate('ownerId');
    }

    /**
     * Update entries to a menu in the collection
     * 
     * @param {string} ownerId - The id of the user adding to their menu
     * @param {number} prevLoc - The previous location of the entry to move
     * @param {number} newLoc - The location to move the item to
     * @returns {Promise<HydratedDocument<Menu>>} - the updated menu item
     */
     static async updateOneByLocation(ownerId: Types.ObjectId | string, prevLoc: number, newLoc: number): Promise<HydratedDocument<Menu>> {
        const menu = await MenuModel.findOne({ownerId});
        let item: {name: string, url: string};
        if (prevLoc < menu.entries.length) {
            item = menu.entries[prevLoc];
            menu.entries.splice(prevLoc, 1);
        } else {
            item = menu.entries[menu.entries.length - 1];
            menu.entries.splice(menu.entries.length - 1, 1);
        }

        if (newLoc < menu.entries.length && newLoc >= 0) {
            menu.entries.splice(newLoc, 0, item);
        } else if (newLoc !== -1) {
            menu.entries.push(item);
        }
        
        menu.dateModified = new Date();
        await menu.save();
        return menu.populate('ownerId');
    }

    /**
     * Find one menu given owner userId, create one if does not exist
     * 
     * @param {string} ownerId - The userId of owner's menu
     * @return {Promise<HydratedDocument<Menu>>} - The menu associated with the user
     */
    static async findOneByUserId(ownerId: Types.ObjectId | string): Promise<HydratedDocument<Menu>> {
        const menu = await MenuModel.findOne({ownerId});
        if (!menu) {
            const newMenu = new MenuModel({
                ownerId,
                dateModified: new Date()
            });
            await newMenu.save();
            return newMenu.populate('ownerId');
        }

        return menu.populate('ownerId');
    }

    /**
     * Delete a menu given the owner's userId
     * 
     * @param ownerId  - The userId of owner's menu
     * @returns {Promise<Boolean>} - true if menu was deleted, false otherwise
     */
    static async deleteOneByUserId(ownerId: Types.ObjectId | string): Promise<boolean> {
        const menu = await MenuModel.deleteOne({ownerId});
        return menu !== null;
    }
}

export default MenuCollection;