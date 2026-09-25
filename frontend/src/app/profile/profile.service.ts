import api from "@/services/api";

import {
  addSkillResponseSchema,
  profileSchema,
  removeSkillResponseSchema,
  skillsResponseSchema,
  updateProfileSchema,
  type UpdateProfilePayload,
} from "./profile.schema";

export const getProfile = async () => {
  const response = await api.get("/profile");

  return profileSchema.parse(response.data);
};

export const updateProfile = async (
  payload: UpdateProfilePayload,
) => {
  const validatedPayload =
    updateProfileSchema.parse(payload);

  const response = await api.patch(
    "/profile",
    validatedPayload,
  );

  return profileSchema.parse(response.data);
};

export const getSkills = async () => {
  const response = await api.get("/profile/skills");

  return skillsResponseSchema.parse(response.data);
};

export const addSkill = async (name: string) => {
  const response = await api.post("/profile/skills", {
    name,
  });

  return addSkillResponseSchema.parse(response.data);
};

export const removeSkill = async (skillId: string) => {
  const response = await api.delete(
    `/profile/skills/${skillId}`,
  );

  return removeSkillResponseSchema.parse(response.data);
};