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
 * Checks if current user already follows the user in req.params
 */
const isRepeatFollow = async (req: Request, res: Response, next: NextFunction) => {
  const curUserId = (req.session.userId as string) ?? '';
  const followUsername = req.params.username;
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
 * Checks if user in req.params same as current user
 */
const isFollowOneself = async (req: Request, res: Response, next: NextFunction) => {
  const curUserId = (req.session.userId as string) ?? '';
  const followUsername = req.params.username;
  const followUser = await UserCollection.findOneByUsername(followUsername);
  const followUserId = (followUser._id);
  if (followUserId.toString() === curUserId) {
    res.status(400).json({
      error: 'You cannot follow yourself.'
    });
    return;
  }

  next();
};

/**
 * Checks if followee and/or followed in req.query are existing users
 */
 const isValidFollowUsers = async (req: Request, res: Response, next: NextFunction) => {
  if (req.query.followee === undefined && req.query.followed === undefined) {
    res.status(400).json({
      error: 'Neither followee nor followed were given.'
    });
    return;
  }

  if (req.query.followee !== undefined) {
    const followeeUsername = (req.query.followee as string) ?? '';
    const followeeUser = await UserCollection.findOneByUsername(followeeUsername);

    if (!followeeUser) {
      res.status(404).json({
        error: {
          userNotFound: `The followee user ${followeeUsername} is not a valid user.`
        }
      });
      return;
    }
  }

  if (req.query.followed !== undefined) {
    const followedUsername = (req.query.followed as string) ?? '';
    const followedUser = await UserCollection.findOneByUsername(followedUsername);

    if (!followedUser) {
      res.status(404).json({
        error: {
          userNotFound: `The followed user ${followedUsername} is not a valid user.`
        }
      });
      return;
    }
  }

  next();
};



export {
  isFollowExists,
  isFollowOneself,
  isRepeatFollow,
  isValidFollowUsers
};
