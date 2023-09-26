import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const projectSchema = new Schema({
	title: { type: String, required: true },
	order: { type: String },
	author_id: { type: String, required: true },
	creationDate: { type: String, required: true },
	images: { type: [String] },
	characters: { type: [String] },
	image: { type: String },
	genre: { type: String },
	setting: { type: [String] },
	episodes: Schema.Types.Mixed,
});
const Project = mongoose.model('Project', projectSchema);

export default Project;
