import type {Request, Response, NextFunction} from 'express';
import express from 'express';
import FollowCollection from './collection';
import * as userValidator from '../user/middleware';
import * as followValidator from '../follow/middleware';
import * as util from './util';
import * as freetUtil from '../freet/util';
import FreetCollection from '../freet/collection';

const router = express.Router();

/**
 * Get followings and/or followed of a user
 *
 * @name GET /api/follows?followee=username&followed=username
 *
 * @param {string} followee - The user who follows other users
 * @param {string} followed - The user who receives a follow
 * @return {FollowUserResponse[]} - An array of all the users that satisfy the given query or queries
 * @throws {400} - If neither followee or followed is given
 * @throws {404} - If one or both of followee and followed are not a recognized username
 */
router.get(
  '/',
  [
    followValidator.isValidFollowUsers
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.query.followee || !req.query.followed) {
      next();
      return;
    }

    const followings = await FollowCollection.findAllByUsernames(req.query.followee as string, req.query.followed as string);
    const response = followings.map(util.constructFollowResponse);
    res.status(200).json(response);
  },
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.query.followee) {
      next();
      return;
    }

    const followees = await FollowCollection.findAllFollowingsByUsername(req.query.followee as string);
    const response = followees.map(util.constructFollowResponse);
    res.status(200).json(response);
  },
  async (req: Request, res: Response) => {
    const followers = await FollowCollection.findAllFollowersByUsername(req.query.followed as string);
    const response = followers.map(util.constructFollowResponse);
    res.status(200).json(response);
  }
);

/**
 * Get freets of the current user's followings
 *
 * @name GET /api/follows/following/freet
 *
 * @return {FreetResponse[]} - A list of all the freets of the current user's followings
 * @throws {403} - If the user is not logged in
 */
router.get(
  '/freet',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const curUserId = (req.session.userId as string) ?? '';
    const followings = await FollowCollection.findAllFollowingsByUserId(curUserId);
    const followingsId = followings.map(follow => follow.toUser._id);
    const freets = await FreetCollection.findAllByAuthorIds(followingsId);
    const response = freets.map(freetUtil.constructFreetResponse);
    res.status(200).json(response);
  }
);

/**
 * Follow a user
 *
 * @name PUT /api/follows/:username
 *
 * @param {string} username - The username of the user to follow
 * @return {string} - A success message
 * @throws {400} - If the user tries to follow themselves
 * @throws {403} - If the user is not logged in
 * @throws {404} - If `username` is not a recognized username of any user
 * @throws {409} - If the user tries to follow someone they already follow
 */
router.put(
  '/:username?',
  [
    userValidator.isUserLoggedIn,
    userValidator.isUserParamsExists,
    followValidator.isFollowOneself,
    followValidator.isRepeatFollow
  ],
  async (req: Request, res: Response) => {
    const curUserId = (req.session.userId as string) ?? '';
    const followUsername = req.params.username;
    await FollowCollection.addOne(curUserId, followUsername);
    res.status(200).json({
      message: 'Your follow was created successfully.'
    });
  }
);

/**
 * Delete an existing follow
 *
 * @name DELETE /api/follows/:username
 *
 * @param {string} username - The username of the user to unfollow
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If there does not exists a Follow between the curent user and the username
 */
router.delete(
  '/:username?',
  [
    userValidator.isUserLoggedIn,
    userValidator.isUserParamsExists,
    followValidator.isFollowExists
  ],
  async (req: Request, res: Response) => {
    const curUserId = (req.session.userId as string) ?? '';
    const followUsername = (req.params.username);
    await FollowCollection.deleteOne(curUserId, followUsername);
    res.status(200).json({
      message: 'Your follow was removed successfully.'
    });
  }
);

export {router as followRouter};
