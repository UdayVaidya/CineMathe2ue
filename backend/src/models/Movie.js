import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Movie title is required'],
            trim: true,
        },
        poster: {
            type: String,
            default: '',
        },
        description: {
            type: String,
            default: 'Description not available',
        },
        tmdbId: {
            type: Number,
            default: null,
        },
        releaseDate: {
            type: String,
            default: '',
        },
        trailerUrl: {
            type: String,
            default: '',
        },
        genre: {
            type: [String],
            default: [],
        },
        category: {
            type: String,
            enum: ['movie', 'tv', 'anime', 'documentary', 'other'],
            default: 'movie',
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 10,
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true }
);

const Movie = mongoose.model('Movie', movieSchema);
export default Movie;
