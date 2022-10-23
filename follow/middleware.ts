import type {Request, Response, NextFunction} from 'express';
import UserCollection from '../user/collection';
import FollowCollection from '../follow/collection';

/**
 * Checks if a Follow between the current user and the username in req.params exists
 */
const isFollowExists = async (req: Request, res: Response, next: NextFunction) => {
  const curUserId = (req.session.userId as string) ?? '';
  const followUsername = (req.params.username);
  const follow = await FollowCollection.findOne(curUserId, followUsername);
  if (!follow) {
    res.status(404).json({
      error: {
        followNotFound: `Follow between current user and ${followUsername} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if current user already follows the user in req.body
 */
const isRepeatFollow = async (req: Request, res: Response, next: NextFunction) => {
  const curUserId = (req.session.userId as string) ?? '';
  const followUsername = (req.body.username as string);
  const follow = await FollowCollection.findOne(curUserId, followUsername);
  if (follow) {
    res.status(409).json({
      error: `Follow between current user and ${followUsername} already exists.`
    });
    return;
  }

  next();
};

/**
 * Checks if user in req.body same as current user
 */
const isFollowOneself = async (req: Request, res: Response, next: NextFunction) => {
  const curUserId = (req.session.userId as string) ?? '';
  const followUsername = (req.body.username as string);
  const followUser = await UserCollection.findOneByUsername(followUsername);
  const followUserId = (followUser._id);
  if (followUserId.toString() === curUserId) {
    res.status(400).json({
      error: 'Following yourself is not allowed.'
    });
    return;
  }

  next();
};

export {
  isFollowExists,
  isFollowOneself,
  isRepeatFollow
};
