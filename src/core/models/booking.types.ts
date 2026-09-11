export type SpaceType = "Desk" | "Room";
export interface SpaceDto {
  id: string;
  name: string;
  type: SpaceType | string;
  floor: number;
  capacity: number;
  isBlocked: boolean;
  maintenanceReason?: string;
  resources?: string;
  requiresApproval: boolean;
}

export type ReservationStatus =
  "Pending" | "CheckedIn" | "Canceled" | "NoShow" | "Completed" | "AwaitingApproval";

export interface ReservationDto {
  id: string;
  spaceId: string;
  spaceName: string;
  startTime: string;
  endTime: string;
  status: ReservationStatus | string;
  checkInAt: string | null;
  batchId?: string | null;
  userName: string;
  userEmail: string;
}

export interface ExtensionRequestDto {
  reservationId: string;
  userName: string;
  spaceName: string;
  requestedMinutes: number;
  justification: string;
  requestedAt: string;
}

export interface DeskMapResource {
  id: string;
  floorId: string;
  name: string;
  type: "desk";
  active: boolean;
  blockedReason?: string;
  bookedBy?: string;
}
