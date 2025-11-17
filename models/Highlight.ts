// --- models/Highlight.ts ---
import mongoose, { Document, Model } from "mongoose";


export interface HighlightDoc extends Document {
title: string;
slug: string;
sourceUrl?: string;
summary: string;
keyTips?: string[];
category?: string;
image?: string;
seoMeta?: {
title?: string;
description?: string;
};
updatedAt?: Date;
}


const highlightSchema = new mongoose.Schema<HighlightDoc>(
{
title: String,
slug: String,
sourceUrl: String,
summary: String,
keyTips: [String],
category: String,
image: String,
seoMeta: {
title: String,
description: String,
},
},
{ timestamps: true }
);


const Highlight: Model<HighlightDoc> =
mongoose.models.Highlight ||
mongoose.model<HighlightDoc>("Highlight", highlightSchema);


export default Highlight;