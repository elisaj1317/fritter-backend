import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import MenuCollection from './collection';


const isUrlHelper = (url:string): boolean => {
    try {
        const new_url = new URL(url);
    } catch {
        return false;
    }

    return true;
}

const isNameHelper = (name:string): boolean => {
    if (!name?.trim()) {
        return false;
    }
    return true;
}

/**
 * Checks if req.body has proper fields
 */
const isValidMenuBody = async (req: Request, res: Response, next: NextFunction) => {
    if ((!req.body.previousLocation || !req.body.newLocation) && (!req.body.name || !req.body.url)) {
        res.status(400).json({
            error: 'Request body must contain either (previousLocation and newLocation) or (name and url).'
        });
        return;
    }

    next();
};

/**
 * Checks if req.body contains valid url
 */
const isValidUrl = async (req: Request, res: Response, next: NextFunction) => {
    if(!isUrlHelper(req.body.url)) {
        res.status(400).json({
            error: `The given url ${req.body.url as string} is not valid.`
        });
        return;
    }

    next();
}

/**
 * Checks if req.body contains valid name
 */
const isValidName = async (req: Request, res: Response, next: NextFunction) => {
    if(!isNameHelper(req.body.name)) {
        res.status(400).json({
            error: `The given name ${req.body.name as string} must be at least one character long.`
        });
        return;
    }

    next();
}

/**
 * Checks if locations in req.body are valid
 */
const isValidLocations = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.name || !req.body.url) {
        const previousLocation = Number(req.body.previousLocation);
        const newLocation = Number(req.body.newLocation);

        if (!Number.isInteger(previousLocation) || previousLocation < 0) {
            res.status(400).json({
                error: `Provided previousLocation must be an integer >= 0. The location ${req.body.previousLocation as string} is not valid.`
            });
            return;
        }

        if (!Number.isInteger(newLocation) || newLocation < -1) {
            res.status(400).json({
                error: `Provided newLocation must be an integer >= 0 or -1 to delete the item. The location ${req.body.newLocation as string} is not valid.`
            });
            return;
        }
    }

    next();
}

/**
 * Checks if entries is not empty
 */
const existEntryItems = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.name || !req.body.url) {
        const menu = await MenuCollection.findOneByUserId(req.session.userId as string ?? '');
        
        if (menu.entries.length <= 0) {
            res.status(400).json({
                error: "Entries must have items in order to move them."
            });
            return;
        }
    }

    next();
}

export {
    isValidMenuBody,
    isValidUrl,
    isValidName,
    isValidLocations, 
    existEntryItems
}