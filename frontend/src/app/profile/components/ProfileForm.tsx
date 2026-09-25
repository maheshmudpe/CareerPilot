import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  updateProfileSchema,
  type Profile,
  type UpdateProfilePayload,
} from "../profile.schema";
import { updateProfile } from "../profile.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProfileFormProps {
  profile: Profile;
  onUpdated: (profile: Profile) => void;
}

const ProfileForm = ({
  profile,
  onUpdated,
}: ProfileFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
      isDirty,
    },
  } = useForm<UpdateProfilePayload>({
    resolver: zodResolver(updateProfileSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      fullName: profile.fullName,
      phone: profile.phone ?? "",
      location: profile.location ?? "",
      bio: profile.bio ?? "",
      linkedinUrl: profile.linkedinUrl ?? "",
      githubUrl: profile.githubUrl ?? "",
    },
  });

  useEffect(() => {
    reset({
      fullName: profile.fullName,
      phone: profile.phone ?? "",
      location: profile.location ?? "",
      bio: profile.bio ?? "",
      linkedinUrl: profile.linkedinUrl ?? "",
      githubUrl: profile.githubUrl ?? "",
    });
  }, [profile, reset]);

  const onSubmit = async (
    data: UpdateProfilePayload,
  ) => {
    const updatedProfile = await updateProfile(data);

    onUpdated(updatedProfile);

    reset({
      fullName: updatedProfile.fullName,
      phone: updatedProfile.phone ?? "",
      location: updatedProfile.location ?? "",
      bio: updatedProfile.bio ?? "",
      linkedinUrl: updatedProfile.linkedinUrl ?? "",
      githubUrl: updatedProfile.githubUrl ?? "",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Full Name */}
          <div className="space-y-2">
            <label
              htmlFor="fullName"
              className="text-sm font-medium"
            >
              Full Name
            </label>

            <Input
              id="fullName"
              placeholder="Your full name"
              {...register("fullName")}
            />

            {errors.fullName && (
              <p className="text-sm text-destructive">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Phone + Location */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="text-sm font-medium"
              >
                Phone
              </label>

              <Input
                id="phone"
                placeholder="Your phone number"
                {...register("phone")}
              />

              {errors.phone && (
                <p className="text-sm text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="location"
                className="text-sm font-medium"
              >
                Location
              </label>

              <Input
                id="location"
                placeholder="City, Country"
                {...register("location")}
              />

              {errors.location && (
                <p className="text-sm text-destructive">
                  {errors.location.message}
                </p>
              )}
            </div>
          </div>

          {/* LinkedIn + GitHub */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="linkedinUrl"
                className="text-sm font-medium"
              >
                LinkedIn
              </label>

              <Input
                id="linkedinUrl"
                placeholder="https://linkedin.com/in/..."
                {...register("linkedinUrl")}
              />

              {errors.linkedinUrl && (
                <p className="text-sm text-destructive">
                  {errors.linkedinUrl.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="githubUrl"
                className="text-sm font-medium"
              >
                GitHub
              </label>

              <Input
                id="githubUrl"
                placeholder="https://github.com/..."
                {...register("githubUrl")}
              />

              {errors.githubUrl && (
                <p className="text-sm text-destructive">
                  {errors.githubUrl.message}
                </p>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label
              htmlFor="bio"
              className="text-sm font-medium"
            >
              Bio
            </label>

            <Textarea
              id="bio"
              placeholder="Tell us a little about yourself..."
              rows={5}
              {...register("bio")}
            />

            {errors.bio && (
              <p className="text-sm text-destructive">
                {errors.bio.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting || !isDirty}
            >
              {isSubmitting
                ? "Saving..."
                : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;