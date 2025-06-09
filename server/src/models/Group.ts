import mongoose, { Document, Schema } from 'mongoose';

export interface IGroup extends Document {
    name: string;
    creator: mongoose.Types.ObjectId;
    members: string[];
    status: 'active' | 'completed';
    preferences: {
        cuisine: string[];
        priceRange: string;
        dietaryRestrictions: string[];
    };
    matchedRestaurant?: {
        placeId: string;
        name: string;
        address: string;
        rating: number;
        photoUrl?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const GroupSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active'
    },
    preferences: {
        cuisine: [{
            type: String,
            enum: ['italian', 'chinese', 'japanese', 'mexican', 'indian', 'american', 'thai', 'vietnamese', 'korean', 'mediterranean']
        }],
        priceRange: {
            type: String,
            enum: ['$', '$$', '$$$', '$$$$'],
            default: '$$'
        },
        dietaryRestrictions: [{
            type: String,
            enum: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher']
        }]
    },
    matchedRestaurant: {
        placeId: String,
        name: String,
        address: String,
        rating: Number,
        photoUrl: String
    }
}, {
    timestamps: true
});

export default mongoose.model<IGroup>('Group', GroupSchema); 