import express from "express";
import User from "../models/user.js";
import Candidate from "../models/candidate.js";
import { jwtAuthMiddleware, adminOnly } from "../jwt.js";

const router = express.Router();




// post route to add a candidate 

router.post('/', jwtAuthMiddleware, adminOnly, async (req, res) => {
    try {

        const data = req.body //assuming the request bodt conatins the candidate data
        //create a new user document using the mangoose model 
        const newCandidate = new Candidate(data);

        //save the new user to the  database 
        const response = await newCandidate.save();
        console.log("data saved ");
        res.status(200).json({ response: response });

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal  Server Error " });
    }
});
router.patch('/update/:candidateID', jwtAuthMiddleware, async (req, res) => {
    try {

        const candidateID = req.params.candidateID; // extract the id from the URL parameter
        const updatedCandidateData = req.body; //update for the person 
        const response = await Candidate.findByIdAndUpdate(candidateID, updatedCandidateData, {
            new: true, // return the  updated document 
            runValidators: true, // run Momgoose validation 
        })
        if (!response) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        console.log('candidate data  updated ');
        res.status(200).json(response);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});
router.delete('/:candidateID', jwtAuthMiddleware, adminOnly, async (req, res) => {
    try {

        const candidateID = req.params.candidateID; // extract the id  from the URL  parameter
        const response = await Candidate.findByIdAndDelete(candidateID);

        if (!response) {
            return res.status(404).json({ eror: 'candidate not found ' })
        }
        console.log('candidate data deleted  ')
        res.status(200).json({ message: "user deleted sucessfully" });

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }

});

// lets start the  voting 
router.post('/vote/:candidateID', jwtAuthMiddleware, async (req, res) => {
    // No admi  can vote
    // user can only vote once
    const candidateID = req.params.candidateID;
    const userID = req.user.id;

    try {
        // Find the candidate document with the specified candidateID
        const candidate = await Candidate.findById(candidateID);
        console.log(candidate)
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "user are not found" });
        }
        // if (user.isVoted) {
        //     res.status(400).json({ message: 'You have already voted' });
        // }
        if (user.role == 'admin') {
            res.status(403).json({ message: 'admin is not allowed' });
        }
        //Update the candidate document to record the vote
        candidate.votes.push({ user: userID })
        candidate.voteCount++;
        await candidate.save();

        // update the user document 

        user.isVoted = true;
        await user.save();
        res.status(200).json({ message: " vote recorded successfully" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error " });

    }
})

// vote count 
router.get('/vote/count', async (req, res) => {
    try {
        // cont vote which are sorted form  whose candidate get vote is large is  firs and whose candidate low vote get this  candidate are last
        // find all candidates and sort them by votecout in descending order
        const candidate = await Candidate.find().sort({ voteCount: 'desc' });
        // Map the candidate to only  return their name and votecount

        const voteRecord = candidate.map((data) => {
            return {
                party: data.party,
                count: data.voteCount
            }
        });
        return res.status(200).json(voteRecord)
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });

    }
})
router.get('/count', async (req, res) => {
    try {

        // list of candidate
        const candidateCount = await Candidate.countDocuments();


        return res.status(200).json(candidateCount);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal server error " });
    }
})

export default router;

