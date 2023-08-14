import mongoose from "mongoose";

const CommunitySchema = new mongoose.Schema({
    id: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    image: {type: String},
    bio: {type: String},
    createdBy: {type: mongoose.Schema.ObjectId,
            ref: 'User'
    },
    // jedan korisnik moze stvoriti vise tredova sto znaci da threads mora biti objekt od tipa dolje
    // ili ti jedan korisnik moze imati vise referenci za objecId spremljeno u bazu
    threads:[ 
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Thread'
        }
    ],
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
});

// prvi puta modes.User te ce fallback to create moongoose.model User, base of userSchea
const Community = mongoose.models.Community || mongoose.model('Community', CommunitySchema);

export default Community;