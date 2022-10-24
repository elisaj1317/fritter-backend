import type {Request, Response, NextFunction} from 'express';
import LikeCollection from './collection';

/**
 * Checks if unable to add a like due to repeat in user and freetId in req.params
 */
const isFreetLikeRepeat = async (req: Request, res: Response, next: NextFunction) => {
  const curUserId = (req.session.userId as string) ?? '';
  const {freetId} = req.params;
  const like = await LikeCollection.findOne(curUserId, freetId, 'Freet');
  if (like) {
    res.status(409).json({
      error: `Like between current user and the freet ${freetId} already exists.`
    });
    return;
  }

  next();
};

/**
 * Checks if unable to add a like due to repeat in user and commentId in req.params
 */
const isCommentLikeRepeat = async (req: Request, res: Response, next: NextFunction) => {
  const curUserId = (req.session.userId as string) ?? '';
  const {commentId} = req.params;
  const like = await LikeCollection.findOne(curUserId, commentId, 'Comment');
  if (like) {
    res.status(409).json({
      error: `Like between current user and the comment ${commentId} already exists.`
    });
    return;
  }

  next();
};

/**
 * Checks if a Like between the current user and the freetId in req.params exists
 */
const isFreetLikeExist = async (req: Request, res: Response, next: NextFunction) => {
  const curUserId = (req.session.userId as string) ?? '';
  const {freetId} = req.params;
  const like = await LikeCollection.findOne(curUserId, freetId, 'Freet');
  if (!like) {
    res.status(404).json({
      error: {
        likeNotFound: `Like between current user and the freet ${freetId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a Like between the current user and the commentId in req.params exists
 */
const isCommentLikeExist = async (req: Request, res: Response, next: NextFunction) => {
  const curUserId = (req.session.userId as string) ?? '';
  const {commentId} = req.params;
  const like = await LikeCollection.findOne(curUserId, commentId, 'Comment');
  if (!like) {
    res.status(404).json({
      error: {
        likeNotFound: `Like between current user and the comment${commentId} does not exist.`
      }
    });
    return;
  }

  next();
};

export {
  isFreetLikeRepeat,
  isCommentLikeRepeat,
  isFreetLikeExist,
  isCommentLikeExist
};
