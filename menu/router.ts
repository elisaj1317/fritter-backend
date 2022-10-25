import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import MenuCollection from './collection';
import * as userValidator from '../user/middleware';
import * as menuValidator from '../menu/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get custom menu bar for authenticated user
 * 
 * @name GET /api/menus
 * 
 * @returns {MenuResponse} - The current user's menu
 * @throws {403} - If the user is not logged in
 */
router.get(
    '/',
    [
        userValidator.isUserLoggedIn
    ],
    async (req: Request, res: Response) => {
        const curUserId = (req.session.userId as string) ?? '';
        const menu = await MenuCollection.findOneByUserId(curUserId);
        const response = util.constructMenuResponse(menu);
        res.status(200).json(response);
    }
);

/**
 * Add an item to current user's menu bar, creates menu bar
 * if it doesn't exist
 * 
 * @name PUT /api/menus
 * 
 * @param {string} name - The name associated with menu item
 * @param {stirng} url - The url associated with menu item
 * @return {MenuResponse} - The updated menu item
 * @throws {403} - If the user is not logged in
 * @throws {400} - If missing one or both of name or url or is not valid
 */
/**
 * Rearrange items in current user's menu bar, removes item if newLocation is negative,
 * creates menu bar if it doesn't exist
 * 
 * @name PUT /api/menus
 * 
 * @param {string} previousLocation - The previous location of item to be moved,
 * last item if location is greater than number of menu items
 * @param {string} newLocation - The location to move the item, 
 * last item if location is greater than number of menu items
 * @return {MenuResponse} - The updated menu item
 * @throws {403} - If the user is not logged in
 * @throws {400} - If invalid locations or menu bar empty
 */
router.put(
    '/',
    [
        userValidator.isUserLoggedIn,
        menuValidator.isValidMenuBody,
        menuValidator.isValidLocations,
        menuValidator.existEntryItems
    ],
    async(req: Request, res: Response, next: NextFunction) => {
        if (req.body.name !== undefined && req.body.url !== undefined) {
            next();
            return;
        }
        const curUserId = (req.session.userId as string) ?? '';
        const menu = await MenuCollection.updateOneByLocation(curUserId, Number(req.body.previousLocation), Number(req.body.newLocation));
        const response = util.constructMenuResponse(menu);
        res.status(200).json(response);
    },
    [
        menuValidator.isValidName,
        menuValidator.isValidUrl
    ],
    async(req: Request, res: Response) => {
        const curUserId = (req.session.userId as string) ?? '';
        const menu = await MenuCollection.updateOneEntryByUserId(curUserId, req.body.name, req.body.url);
        const response = util.constructMenuResponse(menu);
        res.status(200).json(response);
    }
);

export {router as menuRouter};