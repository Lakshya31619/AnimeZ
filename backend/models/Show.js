import mongoose from 'mongoose';

const showSchema = new mongoose.Schema(
    {
        movie: {type: String, required:true, ref: 'Movie'},
    }, {minimize: false}
)
const Show = mongoose.model("Show", showSchema);

export default Show;