import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import LikeCollection from '../like/collection';
import CommentCollection from './collection';
import * as commentValidator from './middleware';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all comments associated with a freet
 *
 * @name GET /api/comments?freetId=id
 *
 * @return {CommentResponse[]} - An array of comments on a freet with id, freetId
 * @throws {404} - If freetId is invalid or not a recognized id
 */
/**
 * Get comments of a specific category associated with a freet
 *
 * @name GET /api/comments?freetId=id&category=category
 *
 * @return {CommentResponse[]} - An array of comments on a freet with id, freet id and category, category
 * @throws {404} - if freetId is invalid or not a recognized id or if category is not a valid category
 */
router.get(
  '/',
  [
    freetValidator.isFreetExistsInQuery
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.category !== undefined) {
      next();
      return;
    }

    const freetId = (req.query.freetId as string) ?? '';
    const freetComments = await CommentCollection.findAllById(freetId);
    const response = freetComments.map(util.constructCommentResponse);
    res.status(200).json(response);
  },
  [
    commentValidator.isValidCategory
  ],
  async (req: Request, res: Response) => {
    const freetId = (req.query.freetId as string) ?? '';
    const category = Number(req.query.category);
    const freetComments = await CommentCollection.findAllByIdAndCategory(freetId, category);
    const response = freetComments.map(util.constructCommentResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new comment
 *
 * @name POST /api/comments/:freetId?
 *
 * @param {string} freetId - The freetId of freet where comment is being added
 * @param {string} content - The content of the comment
 * @param {string} category - The category of the comment
 * @return {CommentResponse} - The created comment
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the comment `category` is empty or a stream of empty spaces or if `category` is invalid
 * @throws {413} - If the comment content is more than 140 characters long
 * @throws {404} - if `freetId` is invalid or is not a recognized
 */
router.post(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isValidFreetContent,
    commentValidator.isValidCategoryInBody,
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    const curUserId = (req.session.userId as string) ?? '';
    const {freetId} = req.params;
    const content = (req.body.content as string);
    const category = Number(req.body.category);
    const comment = await CommentCollection.addOne(curUserId, freetId, content, category);

    res.status(201).json({
      message: 'Your comment was created successfully',
      comment: util.constructCommentResponse(comment)
    });
  }
);

/**
 * Delete an existing comment
 *
 * @name DELETE /api/comments/:commentId?
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not
 *                 the author of the comment
 * @throws {404} - If the commentId is not valid
 */
router.delete(
  '/:commentId?',
  [
    userValidator.isUserLoggedIn,
    commentValidator.isCommentExists,
    commentValidator.isValidCommentModifier
  ],
  async (req: Request, res: Response) => {
    await CommentCollection.deleteOne(req.params.commentId);
    await LikeCollection.deleteManyByObjectId(req.params.commentId, 'Comment');
    res.status(200).json({
      message: 'Your comment was deleted successfully.'
    });
  }
);

/**
 * Update an existing comment
 *
 * @name PUT /api/comments/:commentId?
 *
 * @param {string} content - The new content for the comment
 * @param {string} category - The new category for the comment
 * @return {CommentResponse} - The updated comment
 * @throws {403} - If the user is not logged in or is not
 *                 the author of the comment
 * @throws {404} - If the commentId is not valid
 * @throws {400} - If the comment content is empty or a stream of empty spaces
 *                 or if the category is not valid
 * @throws {413} - If the comment content is more than 140 characters long
 */
router.put(
  '/:commentId?',
  [
    userValidator.isUserLoggedIn,
    commentValidator.isCommentExists,
    commentValidator.isValidCommentModifier,
    commentValidator.isValidCommentContents,
    commentValidator.isValidCategoryInBody
  ],
  async (req: Request, res: Response) => {
    const comment = await CommentCollection.updateOne(req.params.commentId, req.body);
    res.status(200).json({
      messagte: 'Your comment was updated successfully.',
      comment: util.constructCommentResponse(comment)
    });
  }
);

export {router as commentRouter};
