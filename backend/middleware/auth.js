import { clerkClient } from "@clerk/express";

export const protectAdmin = async (req, res, next) => {
  try {
    const { userId } = req.auth();

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const user = await clerkClient.users.getUser(userId);

    const role = user.privateMetadata?.role;

    if (!role) {
      return res.status(401).json({
        success: false,
        message: "No role found"
      });
    }

    if (role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not Authorized"
      });
    }

    next();

  } catch (error) {
    console.error(error);
    return res.status(401).json({
      success: false,
      message: "Not Authorized"
    });
  }
};