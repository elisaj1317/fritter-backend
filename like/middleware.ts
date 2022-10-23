import { Request, Response, NextFunction } from "express";
import LikeCollection from "./collection";

/**
 * Checks if unable to add a like due to repeat in user and freetId in req.body
 */
const isLikeRepeat = async (req: Request, res: Response, next: NextFunction) => {
    const curUserId = (req.session.userId as string) ?? '';
    const freetId = (req.body.freetId as string);
    const like = await LikeCollection.findOne(curUserId, freetId);
    if (like) {
        res.status(409).json({
            error: `Like between current user and ${freetId} already exists.`
        });
        return;
    }

    next();
};

/**
 * Checks if a Like between the current user and the freetId in req.params exists
 */
 const isLikeExist = async (req: Request, res: Response, next: NextFunction) => {
    const curUserId = (req.session.userId as string) ?? '';
    const freetId = (req.params.freetId);
    const like = await LikeCollection.findOne(curUserId, freetId);
    if (!like) {
        res.status(404).json({
            error: {
                likeNotFound: `Like between current user and ${freetId} does not exist.`
            }
        });
        return;
    }

    next();
};

export {
    isLikeRepeat,
    isLikeExist
}