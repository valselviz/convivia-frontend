export type GuestGroup = {
  id: number;
  name: string;
  category: string | null;
  members?: Array<{
    id: number;
    guest_id: number;
  }>;
};

export type GuestGroupWithMembers = Omit<GuestGroup, "members"> & {
  members: Array<{
    id: number;
    guest: {
      id: number;
      full_name: string;
      avatar_key: string | null;
    };
  }>;
};

export type GuestGroupCreateInput = {
  name: string;
  category: string | null;
};

export type GuestGroupUpdateInput = Partial<GuestGroupCreateInput> & {
  id: number;
};

export const GROUP_CATEGORIES = [
  "FAMILY",
  "FRIENDS",
  "WORK",
  "SCHOOL",
  "OTHER",
] as const;

export type GroupCategory = (typeof GROUP_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<GroupCategory, string> = {
  FAMILY: "Familia",
  FRIENDS: "Amigos",
  WORK: "Trabajo",
  SCHOOL: "Escuela",
  OTHER: "Otro",
};
