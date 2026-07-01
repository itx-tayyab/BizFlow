import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { sendInviteEmail } from '../utils/mailer.js';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const InviteStaff = async (req, res) => {
  try {
    const { email, role, businessId } = req.body;

    if (!email || !role || !businessId) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User is already registered." });
    }

    const existingInvite = await prisma.invitation.findFirst({
      where: { email, businessId }
    });
    if (existingInvite) {
      return res.status(400).json({ success: false, message: "Invitation already sent to this email." });
    }

    const token = crypto.randomBytes(32).toString("hex");

    const newInvitation = await prisma.invitation.create({
      data: {
        email,
        role,
        businessId,
        token
      }
    });

    await sendInviteEmail(email, role, token);

    return res.status(200).json({
      success: true,
      message: "Invitation sent successfully!"
    });

  } catch (error) {
    console.error("Invite Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const InvitedByToken = async (req, res) => {
  try {
    const { token } = req.params;
    const { name, password } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: "Token is required" });
    }

    const invitation = await prisma.invitation.findUnique({
      where: { token },
      select: {
        email: true,
        role: true,
        businessId: true,
      },
    });

    if (!invitation) {
      return res.status(404).json({ success: false, message: "Invitation not found" });
    }

    return res.status(200).json({ success: true, ...invitation });
  } catch (error) {
    console.error("Invitation lookup error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const AcceptInvite = async (req, res) => {
  try {
    const { token, name, password } = req.body;

    if (!token || !name || !password) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    const invitation = await prisma.invitation.findUnique({
      where: { token: token }
    });

    if (!invitation) {
      return res.status(400).json({ success: false, message: "Invalid or expired invitation link." });
    }

    const result = await prisma.$transaction(async (tx) => {

      const hashPassword = await bcrypt.hash(password, 10);

      const newUser = await tx.user.create({
        data: {
          name: name,
          email: invitation.email,
          password: hashPassword,
          role: invitation.role,
          businessId: invitation.businessId
        }
      });

      await tx.invitation.delete({
        where: { id: invitation.id }
      });

      return newUser;
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully!",
      user: result
    });

  } catch (error) {
    console.error("Accept Invite Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export const ActiveMembers = async (req, res) => {
  try {
    const user = req.user?.id;

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found." });
    }

    const BusinessID = await prisma.user.findMany({
      where: { id: user },
      select: {
        businessId: true,
      },
    });

    const activeMembers = await prisma.user.findMany({
      where: { businessId: BusinessID[0].businessId },
      select: {
        name: true,
        email: true,
        role: true,
      },
    });

    return res.status(200).json(
      {
        success: true,
        businessId: BusinessID[0].businessId,
        members: activeMembers
      });
  }
  catch (error) {
    console.error("Active Members Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export const pendingInvites = async (req, res) => {
  try {
    const user = req.user?.id;

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found." });
    }

    const BusinessID = await prisma.user.findMany({
      where: { id: user },
      select: {
        businessId: true,
      },
    });

    const pendingInvitations = await prisma.invitation.findMany({
      where: { businessId: BusinessID[0].businessId },
      select: {
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(200).json(
      {
        success: true,
        businessId: BusinessID[0].businessId,
        pendingInvites: pendingInvitations
      });
  }
  catch (error) {
    console.error("Pending Invites Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export const updateRole = async (req, res) => {
  try {
    const user = req.user?.id;
    const { email, role } = req.body;

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found." });
    }

    const currentRole = await prisma.user.findUnique({
      where: { id: user },
      select: {
        role: true,
        businessId: true,
      },
    });

    if (currentRole.role !== "OWNER") {
      return res.status(403).json({ success: false, message: "You are not authorized to change roles." });
    }

    const targetUser = await prisma.user.findUnique({
      where: { email: email },
      select: {
        id: true,
        businessId: true,
      },
    });

    if (targetUser.businessId !== currentRole.businessId) {
      return res.status(403).json({ success: false, message: "You can only manage users in your own workspace." });
    }

    if (targetUser.id === user) {
      return res.status(400).json({ success: false, message: "You cannot change your own role." });
    }

    const updatedUser = await prisma.user.update({
      where: { email: email },
      data: { role: role },
      select: { id: true, name: true, email: true, role: true }
    });

    return res.status(200).json({
      success: true,
      message: "Role updated successfully.",
      user: updatedUser
    });

  }
  catch (error) {
    console.error("Change Role Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export const removeMember = async (req, res) => {
  try {
    const user = req.user?.id;
    const { email } = req.body;

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found." });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: user },
      select: {
        role: true,
        businessId: true,
      },
    });

    if (currentUser.role !== "OWNER") {
      return res.status(403).json({ success: false, message: "You are not authorized to remove members." });
    }

    const targetUser = await prisma.user.findUnique({
      where: { email: email },
      select: {
        id: true,
        businessId: true,
      },
    });

    if (!targetUser) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    if (targetUser.businessId !== currentUser.businessId) {
      return res.status(403).json({ success: false, message: "You can only remove users from your own workspace." });
    }

    await prisma.user.delete({
      where: { email: email }
    });

    return res.status(200).json({ success: true, message: "Member removed successfully." });
  }
  catch (error) {
    console.error("Remove Member Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export const resendInvite = async (req, res) => {
  try {
    const user = req.user?.id;
    const { email, businessId } = req.body;

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found." });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: user },
      select: {
        role: true,
        businessId: true,
      },
    });

    if (currentUser.role !== "OWNER") {
      return res.status(403).json({ success: false, message: "You are not authorized to resend invite to members." });
    }

    const targetUser = await prisma.invitation.findUnique({
      where: {
        email_businessId: {
          email,
          businessId: currentUser.businessId,
        },
      },
      select: {
        id: true,
        businessId: true,
        role: true,
      },
    });

    if (!targetUser) {
      return res.status(404).json({ success: false, message: "Invitation not found." });
    }

    if (targetUser.businessId !== currentUser.businessId) {
      return res.status(403).json({ success: false, message: "You can only resend invites to users from your own workspace." });
    }

    const token = crypto.randomBytes(32).toString("hex");

    await prisma.invitation.update({
      where: {
        email_businessId: {
          email,
          businessId: currentUser.businessId,
        }
      },
      data: { token }
    });

    await sendInviteEmail(email, targetUser.role, token);

    return res.status(200).json({ success: true, message: "Invitation resent successfully!" });

  } catch (error) {
    console.error("Resend Invite Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export const cancelInvite = async (req, res) => {
  try {
    const user = req.user?.id;
    const { email } = req.body;

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found." });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: user },
      select: {
        role: true,
        businessId: true,
      },
    });

    if (currentUser.role !== "OWNER") {
      return res.status(403).json({ success: false, message: "You are not authorized to cancel invites." });
    }

    const targetInvite = await prisma.invitation.findUnique({
      where: {
        email_businessId: {
          email,
          businessId: currentUser.businessId,
        },
      },
      select: {
        id: true,
        businessId: true,
      },
    });

    if (!targetInvite) {
      return res.status(404).json({ success: false, message: "Invitation not found." });
    }

    if (targetInvite.businessId !== currentUser.businessId) {
      return res.status(403).json({ success: false, message: "You can only cancel invites for users from your own workspace." });
    }

    await prisma.invitation.delete({
      where: {
        email_businessId: {
          email,
          businessId: currentUser.businessId,
        },
      }
    });

    return res.status(200).json({ success: true, message: "Invitation canceled successfully." });
  } catch (error) {
    console.error("Cancel Invite Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};
