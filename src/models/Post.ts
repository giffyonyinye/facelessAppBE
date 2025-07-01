import mongoose, {Document, Types, Schema} from "mongoose";

interface IThoughts {
    _id: Types.ObjectId,
    thought: string
}

export interface IPost extends Document {
    userId?: Types.ObjectId;
    sessionId?: string;
    thoughts: IThoughts[];
    likes: Types.ObjectId[];
    savedBy: Types.ObjectId[];
    comments: {
        userId?: Types.ObjectId,
        sessionId?: string,
        comment: string,
        createdAt: Date
    }[],
    reports: {
        userId?: Types.ObjectId,
        sessionId?: string,
        reason: string,
        createdAt: Date
    }[],
    createdAt: Date,
    updatedAt: Date
};

const ThoughtSchema = new Schema<IThoughts>(
 {thought: {type: String, required: true}},
 {id: true}
)

const PostSchema: Schema<IPost> = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: false},
    sessionId: {type: String, required: false},
    thoughts: [ThoughtSchema],
    likes: [{type: Schema.Types.ObjectId, ref: 'User'}],
    savedBy: [{type: Schema.Types.ObjectId, ref: 'User'}],
    reports: [{
        userId: {type: Schema.Types.ObjectId, ref: 'User'},
        sessionId: {type: String},
        reason: { type: String, required: true },
        reportedAt: { type: Date, default: Date.now },
    }],
    comments: [{
        userId: {type: Schema.Types.ObjectId, ref: 'User'},
        sessionId: {type: String},
        comment: {type: String, required: true},
        createdAt: {type: Date, default: Date.now}
    }],
    
}, { timestamps: true });

export default mongoose.model<IPost>('Post', PostSchema)