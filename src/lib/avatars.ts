import { API_BASE_URL } from "./api/client";

export const avatarKeys = [
  "female-1",
  "female-2",
  "female-3",
  "female-4",
  "female-5",
  "female-6",
  "female-7",
  "male-1",
  "male-2",
  "male-3",
  "male-4",
  "male-5",
  "male-6",
  "male-7",
  "girl-1",
  "girl-2",
  "boy-1",
  "boy-2",
] as const;
export type AvatarKey = (typeof avatarKeys)[number];

export const getAvatarUrl = (key: string) =>
  `${API_BASE_URL}/static/avatars/${key}.png`;
