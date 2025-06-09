import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password: string;
    name: string;
    preferences: {
        cuisine: string[];
        priceRange: string;
        dietaryRestrictions: string[];
    };
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
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
    }
}, {
    timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema); 