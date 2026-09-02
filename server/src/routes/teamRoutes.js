import express from 'express';
import {InviteStaff, InvitedByToken, AcceptInvite, ActiveMembers, pendingInvites, updateRole, removeMember, resendInvite, cancelInvite} from '../controllers/teamControllers.js';
import {authenticate} from '../middlewares/authMiddleware.js';
import { requirePermission } from '../middlewares/rbacMiddleware.js';

const router = express.Router();

router.post("/invite", authenticate, requirePermission("manage:team"), InviteStaff);
router.get("/invite/:token", InvitedByToken);

router.post("/join", AcceptInvite);

router.get("/activemembers", authenticate, requirePermission("manage:team"), ActiveMembers);
router.get("/pendinginvites", authenticate, requirePermission("manage:team"), pendingInvites);

router.patch("/updaterole", authenticate, requirePermission("manage:team"), updateRole);
router.delete("/removemember", authenticate, requirePermission("manage:team"), removeMember);

router.post("/resendinvite", authenticate, requirePermission("manage:team"), resendInvite);
router.delete("/cancelinvite", authenticate, requirePermission("manage:team"), cancelInvite);

export default router;