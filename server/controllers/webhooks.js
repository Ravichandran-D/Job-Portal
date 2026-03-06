import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async (req, res) => {
  try {
    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    const reqBody = req.body;
  
    const { data, type } = reqBody;

    await webhook.verify(JSON.stringify(reqBody), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    console.log("Webhook received:", type);

    switch (type) {
      case "user.created": {
        console.log("User created webhook:", data);
        const userData = {
          _id: data.id,
          email: data.email_addresses[0]?.email_address || "",
          name: (data.first_name || "") + " " + (data.last_name || ""),
          image: data.image_url || "",
          resume: "",
        };
        const createdUser = await User.create(userData);
        console.log("User created in DB:", createdUser);
        res.json({});
        break;
      }
      case "user.updated": {
        console.log("User updated webhook:", data);
        const userData = {
          email: data.email_addresses[0]?.email_address || "",
          name: (data.first_name || "") + " " + (data.last_name || ""),
          image: data.image_url || "",
        };
        const updatedUser = await User.findByIdAndUpdate(data.id, userData, { new: true });
        console.log("User updated in DB:", updatedUser);
        res.json({});
        break;
      }
      case "user.deleted": {
        console.log("User deleted webhook:", data.id);
        const deletedUser = await User.findByIdAndDelete(data.id);
        console.log("User deleted from DB:", deletedUser);
        res.json({});
        break;
      }
      default:
        console.log("Unhandled webhook type:", type);
        res.json({});
        break;
    }
  } catch (error) {
    console.error("Webhook error:", error.message);
    res.status(400).json({ success: false, message: "Webhooks Error: " + error.message });
  }
};