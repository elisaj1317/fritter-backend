import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

// Type definition for Menu on the backend
export type Menu = {
    _id: Types.ObjectId;
    ownerId: Types.ObjectId;
    entries: Array<{name: string; url: string}>;
    dateModified: Date;
}

export type PopulatedMenu = {
    _id: Types.ObjectId;
    ownerId: User;
    entries: Array<{name: string; url: string}>;
    dateModified: Date;
}

const MenuSchema = new Schema({
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    entries: {
        type: [{
            name: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }],
        _id: false,
        required: true,
        default: []
    },
    dateModified: {
        type: Date,
        required: true
    }
});

const MenuModel = model<Menu>('Menu', MenuSchema);
export default MenuModel;