import type {Request, Response} from 'express';
import express from 'express';
import FollowCollection from './collection';
import * as userValidator from '../user/middleware';
import * as followValidator from '../follow/middleware';
import * as util from './util';
import * as freetUtil from '../freet/util';
import FreetCollection from '../freet/collection';

const router = express.Router();

/**
 * Get followings of a user
 *
 * @name GET /api/follows/following?username=username
 *
 * @param {string} username - The user's username
 * @return {FollowUserResponse[]} - An array of all the followings of the user
 * @throws {400} - If `username` is not given and valid
 * @throws {404} - If `username is not a recognized username of any user
 */
router.get(
  '/following',
  [
    userValidator.isValidUsername,
    userValidator.isUserQueryExists
  ],
  async (req: Request, res: Response) => {
    const followings = await FollowCollection.findAllFollowingsByUsername(req.query.username as string);
    const response = followings.map(util.constructFollowingUserResponse);
    res.status(200).json(response);
  }
);

/**
 * Get followers of a user
 *
 * @name GET /api/follows/follower?username=username
 *
 * @param {string} username - The user's username
 * @return {FollowUserResponse[]} - A list of all the followers of the user
 * @throws {400} - If `username` is not given and valid
 * @throws {404} - If `username is not a recognized username of any user
 */
router.get(
  '/follower',
  [
    userValidator.isValidUsername,
    userValidator.isUserQueryExists
  ],
  async (req: Request, res: Response) => {
    const followers = await FollowCollection.findAllFollowersByUsername(req.query.username as string);
    const response = followers.map(util.constructFollowerUserResponse);
    res.status(200).json(response);
  }
);

/**
 * Get freets of the current user's followings
 *
 * @name GET /api/follows/freet
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
 * @name POST /api/follows
 *
 * @param {string} username - The username of the user to follow
 * @return {string} - A success message
 * @throws {400} - If the user tries to follow themselves
 * @throws {409} - If the user tries to follow someone they already follow
 * @throws {403} - If the user is not logged in
 * @throws {404} - If `username is not a recognized username of any user
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    userValidator.isUserBodyExists,
    followValidator.isFollowOneself,
    followValidator.isRepeatFollow
  ],
  async (req: Request, res: Response) => {
    const curUserId = (req.session.userId as string) ?? '';
    const followUsername = (req.body.username as string);
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
