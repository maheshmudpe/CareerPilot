import { useEffect, useState } from "react";

import {
  addSkill,
  getSkills,
  removeSkill,
} from "../profile.service";

import type { Skill } from "../profile.schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SkillsSection = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillName, setSkillName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [removingSkillId, setRemovingSkillId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadSkills = async () => {
    try {
      setError(null);
      const data = await getSkills();
      setSkills(data.skills);
    } catch (error) {
      console.error("Failed to load skills:", error);
      setError("Unable to load skills.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleAddSkill = async () => {
    const trimmedName = skillName.trim();

    if (!trimmedName) {
      return;
    }

    try {
      setIsAdding(true);
      setError(null);

      const skill = await addSkill(trimmedName);

      setSkills((currentSkills) => [...currentSkills, skill]);
      setSkillName("");
    } catch (error) {
      console.error("Failed to add skill:", error);
      setError("Unable to add skill.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveSkill = async (skillId: string) => {
    try {
      setRemovingSkillId(skillId);
      setError(null);

      await removeSkill(skillId);

      setSkills((currentSkills) =>
        currentSkills.filter((skill) => skill.id !== skillId),
      );
    } catch (error) {
      console.error("Failed to remove skill:", error);
      setError("Unable to remove skill.");
    } finally {
      setRemovingSkillId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">
            Loading skills...
          </p>
        ) : skills.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No skills added yet.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm"
              >
                <span>{skill.name}</span>

                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill.id)}
                  disabled={removingSkillId === skill.id}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-50"
                  aria-label={`Remove ${skill.name}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Input
            value={skillName}
            onChange={(event) => setSkillName(event.target.value)}
            placeholder="Enter a skill"
            disabled={isAdding}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void handleAddSkill();
              }
            }}
          />

          <Button
            type="button"
            onClick={() => void handleAddSkill()}
            disabled={isAdding || !skillName.trim()}
          >
            {isAdding ? "Adding..." : "Add Skill"}
          </Button>
        </div>

        {error && (
          <p className="text-sm text-destructive">
            {error}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default SkillsSection;