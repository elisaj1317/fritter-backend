import type {HydratedDocument} from 'mongoose';
import type {Like, PopulatedLike} from './model';
import type {Freet, PopulatedFreet} from '../freet/model';

/**
 * Return the liked object from a raw Like object.
 *
 * @param {HydratedDocument<Like>} like - A like object
 * @returns {Freet} - The freet object associated with the like
 */
const getPopulatedFreetFromLike = (like: HydratedDocument<Like>): PopulatedFreet => {
    const likeCopy: PopulatedLike = {
        ...like.toObject({
            versionKey: false // Cosmetics; prevents returning of __v property
        })
    };
    return likeCopy.likedObject;
};

export {
    getPopulatedFreetFromLike
};

