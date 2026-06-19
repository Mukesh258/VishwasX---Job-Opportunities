// Guest mode utilities
import type { UserProfile } from "./mockData";

export const GUEST_PROFILE: UserProfile = {
  previousRole: "Software Developer",
  yearsExperience: 5,
  careerBreakDuration: "2 years",
  currentSkills: ["Python", "JavaScript", "CSS", "React"],
  desiredRole: "Data Analyst",
  educationLevel: "Bachelor's",
};

export function isGuestMode(): boolean {
  return localStorage.getItem("sheReboot_guestMode") === "true";
}

export function enableGuestMode(): void {
  localStorage.setItem("sheReboot_guestMode", "true");
  localStorage.setItem("restartai_profile", JSON.stringify(GUEST_PROFILE));
}

export function disableGuestMode(): void {
  localStorage.removeItem("sheReboot_guestMode");
  localStorage.removeItem("restartai_profile");
}

export function getGuestProfile(): UserProfile {
  return GUEST_PROFILE;
}
