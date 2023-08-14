import mongoose from "mongoose";


const threadSchema = new mongoose.Schema({
  text: {type: String, reqired: true},
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required: true,
},
community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
    // in case a thread is a comment
    parentId: {
        type: String
    },
    // 0ne thread can have multiple threads as childrens
    children: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Thread'
        }
    ]

});

const Thread = mongoose.models.Thread || mongoose.model('Thread', threadSchema);

export default Thread;