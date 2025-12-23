// T developed the candidate data with developed candidate.js models
import mongoose from 'mongoose';
//const bcrypt = require('bcrypt'); // with  the use  password  hidden   store in the database

// define the candidate Schema

const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    party: {
        type: String,
        required: true
    }, age: {
        type: Number,
        required: true
    },
    votes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: " true",
        },
        voteAt: {
            type: Date,
            default: Date.now()
        }
    }

    ],
    voteCount:{
        type: Number,
        default: 0
    }
,
 listCandidate:
 {
    type:Number,
    default: 0
 }
});

const Candidate = mongoose.model('Candidate', candidateSchema);
export default  Candidate;