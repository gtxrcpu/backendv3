import { NextResponse } from "next/server";
import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://bentarramadhan:bentar@cvbentarramadhan.618cs.mongodb.net/?retryWrites=true&w=majority&appName=cvBentarramadhan";

// Koneksi MongoDB
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("✅ MongoDB Connected (comments)");
};

// Schema Comment
const commentSchema = new mongoose.Schema({
  text: String,
  date: { type: Date, default: Date.now },
});

const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema);

// POST: Tambah komentar
export async function POST(req) {
  try {
    await connectDB();
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const newComment = new Comment({ text });
    await newComment.save();
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("❌ Error in POST comment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// GET: Ambil semua komentar
export async function GET() {
  try {
    await connectDB();
    const comments = await Comment.find().sort({ date: -1 });
    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error("❌ Error in GET comments:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
