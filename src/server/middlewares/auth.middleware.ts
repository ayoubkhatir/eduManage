import { createMiddleware } from "@tanstack/react-start";
import { authService } from "../modules/auth/auth.service";
import { jwtVerify } from "jose";

export const authMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const accessToken = request.headers
      .get("authorization")
      ?.replace("Bearer ", "");
    
    if (!accessToken) {
      return Response.json(
        { message: "Unauthorized"},
        { status: 401}
      );
    }
    const secret = process.env.JWT_SECRET
    if (!secret) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = await jwtVerify(
      accessToken,
      new TextEncoder().encode(process.env.JWT_SECRET)
    ).catch(() => null);

    const userId =
      decoded && typeof decoded.payload.userId === "string"
        ? decoded.payload.userId
        : null;
    const sessionId =
      decoded && typeof decoded.payload.sid === "string"
        ? decoded.payload.sid
        : null;

    if (!userId || !sessionId) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const publicUser = await authService.findUserById(userId);

    if (!publicUser) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const hasActiveSession = await authService.hasActiveSession(
      publicUser.id,
      sessionId
    );
    if (!hasActiveSession) {
      return Response.json(
        { message: "Session revoked" },
        { status: 401 }
      );
    }

    const userInfo = await authService.getUserInfo(publicUser.role, publicUser.id);

    const context = {
      user: {
        ...publicUser,
        info: userInfo,
      },
      sessionId,
    };

    return next({ context });
  }
);