import type {Request, Response} from 'express';
import express from 'express';
import LikeCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as commentValidator from '../comment/middleware';
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
    const likes = await LikeCollection.findAllLikesByIdAndDoc(curUserId, 'Freet');
    const likedPosts = likes.map(util.getPopulatedFreetFromLike);
    const response = likedPosts.map(freetUtil.constructFreetResponseFromPopulatedFreet);
    res.status(200).json(response);
  }
);

/**
 * Like a freet
 *
 * @name PUT /api/likes/freet/:freetId?
 *
 * @param {string} freetId - The id of the freet being liked
 * @returns {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {409} - If the user attempts to like a freet they've liked before
 * @throws {404} - If the `freetId` is not a recognized freetId of any freet
 */
router.put(
  '/freet/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    likeValidator.isFreetLikeRepeat
  ],
  async (req: Request, res: Response) => {
    const curUserId = (req.session.userId as string) ?? '';
    const {freetId} = req.params;
    await LikeCollection.addOne(curUserId, freetId, 'Freet');
    res.status(201).json({
      message: 'Your like was completed successfully'
    });
  }
);

/**
 * Delete an existing like
 *
 * @name DELETE /api/likes/freet/:freetId?
 *
 * @param {string} freetId - The id of the freet being unliked
 * @returns {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If there does not exist a like from the current user on freetId
 * or if the given freet does not exist
 */
router.delete(
  '/freet/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    likeValidator.isFreetLikeExist
  ],
  async (req: Request, res: Response) => {
    const curUserId = (req.session.userId as string) ?? '';
    const {freetId} = req.params;
    await LikeCollection.deleteOne(curUserId, freetId, 'Freet');
    res.status(200).json({
      message: 'Your like was removed successfully.'
    });
  }
);

/**
 * Like a comment
 *
 * @name PUT /api/likes/comment/:commentId?
 *
 * @param {string} commentId - The id of the comment being liked
 * @returns {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {409} - If the user attempts to like a comment they've liked before
 * @throws {404} - If the `commentId` is not a recognized commentId of any comment
 */
router.put(
  '/comment/:commentId?',
  [
    userValidator.isUserLoggedIn,
    commentValidator.isCommentExists,
    likeValidator.isCommentLikeRepeat
  ],
  async (req: Request, res: Response) => {
    const curUserId = (req.session.userId as string) ?? '';
    const {commentId} = req.params;
    await LikeCollection.addOne(curUserId, commentId, 'Comment');
    res.status(201).json({
      message: 'Your like was completed successfully'
    });
  }
);

/**
 * Delete an existing like on a comment
 *
 * @name DELETE /api/likes/comment/:commentId?
 *
 * @param {string} commentId - The id of the comment being unliked
 * @returns {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If there does not exist a like from the current user on commentId
 * or if the given comment does not exist
 */
router.delete(
  '/comment/:commentId?',
  [
    userValidator.isUserLoggedIn,
    commentValidator.isCommentExists,
    likeValidator.isCommentLikeExist
  ],
  async (req: Request, res: Response) => {
    const curUserId = (req.session.userId as string) ?? '';
    const {commentId} = req.params;
    await LikeCollection.deleteOne(curUserId, commentId, 'Comment');
    res.status(200).json({
      message: 'Your like was removed successfully.'
    });
  }
);

export {router as likeRouter};
