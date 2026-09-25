import { useEffect, useState } from "react";

import ProfileForm from "../components/ProfileForm";
import SkillsSection from "../components/SkillsSection";
import { getProfile } from "../profile.service";
import type { Profile } from "../profile.schema";

import ResumeSection from "../components/ResumeSection";

const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getProfile();

        setProfile(data);
      } catch (error) {
        console.error("Failed to load profile:", error);

        setError("Unable to load profile.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Profile
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage your personal information, skills, and resume.
        </p>
      </div>

      {/* Profile */}
      <ProfileForm
        profile={profile}
        onUpdated={setProfile}
      />

      {/* Skills */}
      <SkillsSection />

      {/* Resume */}
      <ResumeSection />
    </div>
  );
};

export default ProfilePage;