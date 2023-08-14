import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    image: {type: String},
    bio: {type: String},

    // jedan korisnik moze stvoriti vise tredova sto znaci da threads mora biti objekt od tipa dolje
    // ili ti jedan korisnik moze imati vise referenci za objecId spremljeno u bazu
    threads:[ 
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Thread'
        }
    ],
    onboarded: {
        type: Boolean,
        default: false,
    },
    communities: [
        {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Comunity'
        }
    ]
});

// prvi puta modes.User te ce fallback to create moongoose.model User, base of userSchea
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;