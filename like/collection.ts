import type {HydratedDocument, Types} from 'mongoose';
import type {Like, objectsToLike} from './model';
import LikeModel from './model';

/**
 * This files contains a class that has the functionality to explore likes
 * stored in MongoDB, including adding, finding, and deleting follows.
 */
class LikeCollection {
  /**
   * Add a like to the collection
   *
   * @param {string} liker - the username of the user performing the like
   * @param {string} likedObject - the id of the object being liked
   * @param {string} docModel - the model of the likedObject
   * @return {Promise<Boolean>} - true if the like was created successfully, false otherwise
   */
  static async addOne(liker: Types.ObjectId | string, likedObject: Types.ObjectId | string, docModel: objectsToLike): Promise<boolean> {
    const like = new LikeModel({
      liker,
      likedObject,
      docModel
    });
    await like.save();
    return like !== null;
  }

  /**
   * Find a like given userId and likedObject
   *
   * @param {string} userId - The userId of the user who likes other objects
   * @param {string} likedObject - The objectId of the object that was liked
   * @return {Promise<HydratedDocument<Like> | Promise<null>} - The follow with the given liker and likedObject
   */
  static async findOne(userId: Types.ObjectId | string, likedObject: Types.ObjectId | string, docModel: objectsToLike): Promise<HydratedDocument<Like>> {
    return LikeModel.findOne({liker: userId, likedObject, docModel});
  }

  /**
   * Find all likes of a given user by userId and of a given model
   *
   * @param {string} userId - The userId of the user who likes other objects
   * @return {Promise<HydratedDocument<Like>[]>} - An array of all the likes
   */
  static async findAllLikesByIdAndDoc(userId: Types.ObjectId | string, docModel: objectsToLike): Promise<Array<HydratedDocument<Like>>> {
    return LikeModel.find({liker: userId, docModel}).populate([
      'liker',
      {
        path: 'likedObject',
        populate: [{path: 'authorId'}, {path: 'numLikes'}]
      }
    ]);
  }

  /**
   * Find count of likes on a object by objectId
   *
   * @param {string} objectId - The objectId of the object that is liked
   * @param {string} docModel - The model of the object with the objectId
   * @return {Promise<number>} - The number of likes on the post
   */
  static async findCount(objectId: Types.ObjectId | string, docModel: objectsToLike): Promise<number> {
    return LikeModel.count({likedObject: objectId, docModel});
  }

  /**
   * Delete a like from the collection
   *
   * @param {string} likerId - The userId of user liking an object
   * @param {string} likedObject - The objectId of object whose like is deleted
   * @param {string} docModel - The model of likedObject
   * @return {Promise<Boolean>} - true if the like has been deleted, false otherwise
   */
  static async deleteOne(likerId: Types.ObjectId | string, likedObject: Types.ObjectId | string, docModel: objectsToLike) {
    const likeSuccess = await LikeModel.deleteOne({liker: likerId, likedObject, docModel});
    return likeSuccess !== null;
  }

  /**
   * Delete all the likes by the given user
   *
   * @param {string} likerId - The id of user who likes items
   */
  static async deleteManyByUser(likerId: Types.ObjectId | string): Promise<void> {
    await LikeModel.deleteMany({liker: likerId});
  }

  /**
   * Delete all the likes of a given object
   *
   * @param {string} objectId - The id of object liked on
   */
  static async deleteManyByObjectId(objectId: Types.ObjectId | string, docModel: objectsToLike): Promise<void> {
    await LikeModel.deleteMany({likedObject: objectId, docModel});
  }
}

export default LikeCollection;
