import type {HydratedDocument} from 'mongoose';
import type {Follow, PopulatedFollow} from './model';

// Contains all the information needed from user for follows
type FollowUserResponse = {
    _id: string;
    username: string;
}

/**
 * Transform a raw Follow object from the database into a user response
 * of who was followed (`toUser`). The user response only contains information
 * needed for follows.
 *
 * @param {HydratedDocument<Follow>} follow - A follow
 * @returns {FollowUserResponse} - The user object formatted for the follow frontend
 */
 const constructFollowingUserResponse = (follow: HydratedDocument<Follow>): FollowUserResponse => {
    const followCopy: PopulatedFollow = {
      ...follow.toObject({
        versionKey: false // Cosmetics; prevents returning of __v property
      })
    };
    const toUser = followCopy.toUser;
    return {
      _id: toUser._id.toString(),
      username: toUser.username
    };
  };

/**
 * Transform a raw Follow object from the database into a user response
 * of followers (`fromUser`). The user response only contains information
 * needed for follows.
 *
 * @param {HydratedDocument<Follow>} follow - A follow
 * @returns {FollowUserResponse} - The user object formatted for the follow frontend
 */
 const constructFollowerUserResponse = (follow: HydratedDocument<Follow>): FollowUserResponse => {
    const followCopy: PopulatedFollow = {
      ...follow.toObject({
        versionKey: false // Cosmetics; prevents returning of __v property
      })
    };
    const fromUser = followCopy.fromUser;
    return {
      _id: fromUser._id.toString(),
      username: fromUser.username
    };
  };
  
  export {
    constructFollowingUserResponse,
    constructFollowerUserResponse
  };