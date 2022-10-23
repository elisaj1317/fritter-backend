import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import CommentCollection from '../comment/collection';

/**
 * Checks if a category with a category in req.query is valid
 */
const isValidCategory = async(req: Request, res: Response, next: NextFunction) => {
    if (!req.query.category) {
        res.status(400).json({
            error: 'Provided category must be nonempty'
        });
        return;
    }

    const category = Number(req.query.category);

    if (!Number.isInteger(category) || category < 0) {
        res.status(400).json({
            error: `Provided category must be an integer >= 0. The category ${req.query.category} is not allowed.`
        });
        return;
    }

    next();
};

/**
 * Checks if a comment with a commentId in req.params exists
 */
const isCommentExists = async(req: Request, res:Response, next: NextFunction) => {
    const validFormat = Types.ObjectId.isValid(req.params.commentId);
    const comment = validFormat ? await CommentCollection.findOne(req.params.commentId) : '';
    if (!comment) {
        res.status(404).json({
            error: {
                commentNotFound: `Comment with comment ID ${req.params.commentId} does not exist.`
            }
        });
        return
    }

    next();
}

const isValidCommentModifier = async (req: Request, res: Response, next: NextFunction) => {
    const comment = await CommentCollection.findOne(req.params.commentId);
    const userId = comment.author._id;
    if (req.session.userId !== userId.toString()) {
        res.status(403).json({
            error: 'Cannot modify other users\' comments.'
        });
        return;
    }

    next();
};

export {
    isValidCategory,
    isCommentExists,
    isValidCommentModifier
}
