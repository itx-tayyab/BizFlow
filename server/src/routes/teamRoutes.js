import express from 'express';
import {InviteStaff, InvitedByToken, AcceptInvite, ActiveMembers, pendingInvites, updateRole, removeMember, resendInvite, cancelInvite} from '../controllers/teamControllers.js';
import {authenticate} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/invite", InviteStaff);
router.get("/invite/:token", InvitedByToken);

router.post("/join", AcceptInvite);

router.get("/activemembers", authenticate ,ActiveMembers);
router.get("/pendinginvites", authenticate ,pendingInvites);

router.patch("/updaterole", authenticate, updateRole);
router.delete("/removemember", authenticate, removeMember);

router.post("/resendinvite", authenticate, resendInvite);
router.delete("/cancelinvite", authenticate , cancelInvite);

export default router;