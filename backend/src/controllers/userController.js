import User from "../models/UserModel.js";

// Kullanıcıyı bul veya oluştur
export const upsertUser = async (req, res) => {
  try {
    const { uid, email, displayName } = req.body;

    if (!uid) return res.status(400).json({ error: "UID is required" });

    // User varsa döndür, yoksa oluştur
    let user = await User.findOne({ uid });
    if (!user) {
      user = await User.create({ uid, email, displayName });
      console.log("New user created:", user.uid);
    } else {
      console.log("User already exists:", user.uid);
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error creating/updating user:", err);
    res.status(500).json({ error: "Failed to upsert user" });
  }
};
