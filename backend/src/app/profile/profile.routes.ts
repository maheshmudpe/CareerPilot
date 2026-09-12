import {Router ,  type Router as ExpressRouter } from 'express';
import { authMiddleware } from '../../common/middleware/authMiddleware.js';
import { asyncHandler } from '../../common/errors/asyncHandler.js';
import { getProfileController ,
        updateProfileController,
        getSkillsController,
        addSkillController,
        removeSkillController,

} from './profile.controller.js';


const profileRouter:ExpressRouter  = Router()


profileRouter.get('/' , authMiddleware , asyncHandler(getProfileController))


profileRouter.patch('/', authMiddleware , asyncHandler(updateProfileController))

profileRouter.get(
    "/skills",
    authMiddleware,
    asyncHandler(getSkillsController)
);

profileRouter.post(
    "/skills",
    authMiddleware,
    asyncHandler(addSkillController)
);

profileRouter.delete(
    "/skills/:skillId",
    authMiddleware,
    asyncHandler(removeSkillController)
);


export default profileRouter;