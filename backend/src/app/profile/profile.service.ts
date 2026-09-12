import { eq, and } from "drizzle-orm";
import { db } from "../../db/index.js";
import { profilesTable, skillsTable, userSkillsTable } from "../../db/schema.js";
import { ConflictError, NotFoundError } from "../../common/errors/HttpErrors.js";
import type { AddSkillPayload, UpdateProfilePayload } from "./profile.schema.js";
import { BadRequestError } from "../../common/errors/HttpErrors.js";

export const getProfileService = async (userId: string) => {
    const [profile] = await db
        .select()
        .from(profilesTable)
        .where(eq(profilesTable.userId, userId));

    if (!profile) {
        throw new NotFoundError("Profile not found");
    }

    return profile;
};



export const updateProfileService = async (
    userId: string,
    payload: UpdateProfilePayload
) => {
    const [existingProfile] = await db
        .select()
        .from(profilesTable)
        .where(eq(profilesTable.userId, userId));

    if (existingProfile) {
        const [updatedProfile] = await db
            .update(profilesTable)
            .set({
                ...payload,
                updatedAt: new Date(),
            })
            .where(eq(profilesTable.userId, userId))
            .returning();

        return updatedProfile;
    }

    if (!payload.fullName) {
    throw new BadRequestError(
        "Full name is required when creating a profile"
    );
}

const [createdProfile] = await db
    .insert(profilesTable)
    .values({
        userId,
        fullName: payload.fullName,
        phone: payload.phone,
        location: payload.location,
        bio: payload.bio,
        linkedinUrl: payload.linkedinUrl,
        githubUrl: payload.githubUrl,
    })
    .returning();

return createdProfile;

  
};


export const getSkillsService = async (userId: string) => {
    const skills = await db
        .select({
            id: skillsTable.id,
            name: skillsTable.name,
        })
        .from(userSkillsTable)
        .innerJoin(
            skillsTable,
            eq(userSkillsTable.skillId, skillsTable.id)
        )
        .where(eq(userSkillsTable.userId, userId));

    return skills;
};



export const addSkillService = async (
    userId: string,
    payload: AddSkillPayload
) => {
    const [existingSkill] = await db
        .select()
        .from(skillsTable)
        .where(eq(skillsTable.name, payload.name));

    let skillId: string;

    if (existingSkill) {
        skillId = existingSkill.id;
    } else {
        const [newSkill] = await db
            .insert(skillsTable)
            .values({
                name: payload.name,
            })
            .returning({
                id: skillsTable.id,
            });

        if (!newSkill) {
            throw new Error("Failed to create skill");
        }

        skillId = newSkill.id;
    }

    const [relationship] = await db
        .insert(userSkillsTable)
        .values({
            userId,
            skillId,
        })
        .onConflictDoNothing()
        .returning();

    if (!relationship) {
        throw new ConflictError("Skill already added to profile");
    }

    return {
        id: skillId,
        name: payload.name,
    };
};



export const removeSkillService = async (
    userId: string,
    skillId: string
) => {
    const [deletedRelationship] = await db
        .delete(userSkillsTable)
        .where(
            and(
                eq(userSkillsTable.userId, userId),
                eq(userSkillsTable.skillId, skillId)
            )
        )
        .returning();

    if (!deletedRelationship) {
        throw new NotFoundError(
            "Skill is not associated with this profile"
        );
    }

    return {
        message: "Skill removed successfully",
    };
};