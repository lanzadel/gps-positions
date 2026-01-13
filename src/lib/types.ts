export type GpsPosition = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  createdAt: string;
  updatedAt: string;
};

export type CreatePositionInput = {
  name: string;
  lat: number;
  lng: number;
};

export type UpdatePositionInput = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};