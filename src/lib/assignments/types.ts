export type AssignmentDTO = {
  id: number;
  table_id: number;
  guest_id: number;
  seat_number: number | null;
  locked: boolean;
  guest: {
    id: number;
    full_name: string;
    avatar_key: string | null;
    status: string;
  };
};

export type ReassignInput = {
  guest_id: number;
  table_id: number;
  seat_number?: number | null;
};

export type ReassignResult = {
  assignment: AssignmentDTO;
  warnings: string[];
};
