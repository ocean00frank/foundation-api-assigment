import { signToken } from "../utils/jwt.utils";
import { prisma } from "../prisma/client";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "../services/email.service";
// Remove Context type import - use any for now

export async function signup(context: any) {
  try {
    const { email, password } = (await context.body) as {
      email: string;
      password: string;
    };

    // Validate input
    if (!email || !password) {
      return { error: "Email and password are required", status: 400 };
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "User already exists", status: 409 };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (default role is ATTENDEE, not verified)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "ATTENDEE", // All new users are attendees by default
        isVerified: false, // Requires 2FA verification
      },
    });

    // Send verification email (mock)
    const emailResult = await sendVerificationEmail(email, "mock-token");

    // Generate token
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      message: "User created successfully. Please check your email for verification.",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
      requiresVerification: true,
      emailPreview: emailResult.previewUrl,
    };
  } catch (error) {
    console.error("Signup error:", error);
    return {
      error: "Failed to create user",
      status: 500,
    };
  }
}

export async function login(context: any) {
  try {
    const { email, password } = (await context.body) as {
      email: string;
      password: string;
    };

    // Validate input
    if (!email || !password) {
      return { error: "Email and password are required", status: 400 };
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: "Invalid credentials", status: 401 };
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return { error: "Invalid credentials", status: 401 };
    }

    // Check if user is verified (ALL users require 2FA verification)
    if (!user.isVerified) {
      return { 
        error: "Account not verified. Please check your email for verification.", 
        status: 403,
        requiresVerification: true,
        userRole: user.role // Include role for frontend routing
      };
    }

    // Generate token
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
      token,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      error: "Failed to login",
      status: 500,
    };
  }
}

export async function verifyUser(context: any) {
  try {
    const { email, verificationToken } = (await context.body) as {
      email: string;
      verificationToken: string;
    };

    // Validate input
    if (!email || !verificationToken) {
      return { error: "Email and verification token are required", status: 400 };
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: "User not found", status: 404 };
    }

    if (user.isVerified) {
      return { error: "User already verified", status: 400 };
    }

    // For now, accept any token (in production, validate the token)
    if (verificationToken === "mock-token") {
      // Update user as verified
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true },
      });

      return {
        message: "User verified successfully",
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          role: updatedUser.role,
          isVerified: updatedUser.isVerified,
        },
      };
    } else {
      return { error: "Invalid verification token", status: 400 };
    }
  } catch (error) {
    console.error("Verification error:", error);
    return {
      error: "Failed to verify user",
      status: 500,
    };
  }
}

export async function getProfile(context: any) {
  try {
    // User is attached by auth middleware
    if (!context.user) {
      return { error: "Unauthorized", status: 401 };
    }

    const user = await prisma.user.findUnique({
      where: { id: context.user.id },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            organizedEvents: true,
            rsvps: true,
          },
        },
      },
    });

    return {
      user,
    };
  } catch (error) {
    console.error("Get profile error:", error);
    return {
      error: "Failed to get profile",
      status: 500,
    };
  }
}

