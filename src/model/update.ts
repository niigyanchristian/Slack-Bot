import mongoose, { Schema, Document, Model } from 'mongoose';

interface IUpdate extends Document {
    userId: string;
    type: 'yesterday' | 'today' | 'blockers';
    content: string;
    timestamp: Date;
}

const updateSchema: Schema<IUpdate> = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        enum: ['yesterday', 'today', 'blockers'],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const UpdateModel: Model<IUpdate> = mongoose.model<IUpdate>('Update', updateSchema);

export default UpdateModel;
