import type {Request, Response} from 'express';
import express from 'express';
import LikeCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as likeValidator from '../like/middleware';
import * as util from './util';
import * as freetUtil from '../freet/util';

const router = express.Router();

/**
 * Get current user's liked freets
 *
 * @name GET /api/likes/freets
 *
 * @returns {FreetResponse[]} - A list of all liked freets of the user by date liked
 * @throws {403} - If the user is not logged in
 */
router.get(
  '/freets',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const curUserId = (req.session.userId as string) ?? '';
    const likes = await LikeCollection.findAllLikesById(curUserId);
    const likedPosts = likes.map(util.getPopulatedFreetFromLike);
    const response = likedPosts.map(freetUtil.constructFreetResponseFromPopulatedFreet);
    res.status(200).json(response);
  }
);

/**
 * Get count of likes on a freet
 *
 * @name GET /api/likes/count?freetId=FREETID
 *
 * @param {string} freetId - The id of the freet to get like count
 * @returns {number} - The number of likes on the freet
 * @throws {404} - If `freetId` is not a recognized freetId of any freet
 */
router.get(
  '/count',
  [
    freetValidator.isFreetExistsInQuery
  ],
  async (req: Request, res: Response) => {
    const numLikes = await LikeCollection.findCount(req.query.freetId as string);
    res.status(200).json(numLikes);
  }
);

/**
 * Like an object
 *
 * @name POST /api/likes/
 *
 * @param {string} freetId - The id of the freet being liked
 * @returns {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {409} - If the user attempts to like a post they've liked before
 * @throws {404} - If the `freetId` is not a recognized freetId of any freet
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExistsInBody,
    likeValidator.isLikeRepeat
  ],
  async (req: Request, res: Response) => {
    const curUserId = (req.session.userId as string) ?? '';
    const freetId = (req.body.freetId as string);
    await LikeCollection.addOne(curUserId, freetId);
    res.status(201).json({
      message: 'Your like was completed successfully'
    });
  }
);

/**
 * Delete an existing like
 *
 * @name DELETE /api/likes/:freetId?
 *
 * @param {string} freetId - The id of the freet being unliked
 * @returns {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If there does not exist a like between the current user and the freetId
 * or if the given freet does not exist
 */
router.delete(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    likeValidator.isLikeExist
  ],
  async (req: Request, res: Response) => {
    const curUserId = (req.session.userId as string) ?? '';
    const {freetId} = req.params;
    await LikeCollection.deleteOne(curUserId, freetId);
    res.status(200).json({
      message: 'Your like was removed successfully.'
    });
  }
);

export {router as likeRouter};
