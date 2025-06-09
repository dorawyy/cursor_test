import mongoose, { Document, Schema } from 'mongoose';

export interface ISwipe extends Document {
    user: mongoose.Types.ObjectId;
    group: mongoose.Types.ObjectId;
    restaurant: {
        placeId: string;
        name: string;
        address: string;
        rating: number;
        photoUrl?: string;
    };
    action: 'like' | 'dislike';
    createdAt: Date;
}

const SwipeSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    group: {
        type: Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    restaurant: {
        placeId: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true
        },
        photoUrl: String
    },
    action: {
        type: String,
        enum: ['like', 'dislike'],
        required: true
    }
}, {
    timestamps: true
});

// Compound index to ensure a user can only swipe once per restaurant in a group
SwipeSchema.index({ user: 1, group: 1, 'restaurant.placeId': 1 }, { unique: true });

export default mongoose.model<ISwipe>('Swipe', SwipeSchema); 