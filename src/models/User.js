import {Schema, model, models} from 'mongoose';


const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        validate: pass =>{
            if(!pass || pass.length < 5) {
                throw new Error('Password must be at least 5 characters long');
            }
        }
    },
    image: {
        type: String,
    },

}, {timestamps: true});

export const User = models.User || model('User', UserSchema);
