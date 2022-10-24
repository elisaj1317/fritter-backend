import type {HydratedDocument} from 'mongoose';
import type {Follow, PopulatedFollow} from './model';

// Contains all the information needed from user for follows
type FollowResponse = {
  _id: string;
  followee: string;
  followed: string;
};

/**
 * Transform a raw Follow object from the database into a follow response containing only the usernames
 * of the followee and followed users
 *
 * @param {HydratedDocument<Follow>} follow - A follow
 * @returns {FollowResponse} - The follow object formatted for the frontend
 */
const constructFollowResponse = (follow: HydratedDocument<Follow>): FollowResponse => {
  const followCopy: PopulatedFollow = {
    ...follow.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {toUser} = followCopy;
  const {fromUser} = followCopy;
  return {
    _id: followCopy._id.toString(),
    followee: fromUser.username,
    followed: toUser.username
  };
};

export {
  constructFollowResponse
};
