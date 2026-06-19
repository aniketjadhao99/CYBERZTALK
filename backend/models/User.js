import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Please provide a full name'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },
    phone: {
        type: String,
        match: [/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, 'Please provide a valid phone number']
    },
    avatar: {
        type: String,
        default: null
    },
    role: {
        type: String,
        enum: ['victim', 'expert', 'admin'],
        default: 'victim'
    },
    expertise: [{
        type: String,
        enum: ['phishing', 'malware', 'identity-theft', 'financial-fraud', 'harassment', 'forensics', 'other']
    }],
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcryptjs.genSalt(10);
        this.password = await bcryptjs.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcryptjs.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
