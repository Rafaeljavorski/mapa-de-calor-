
export interface Activity {
  "Recurso": string;
  "ID Atividade": string;
  "Status da Atividade": string;
  "Tipo de Atividade": string;
  "Cidade": string;
  "Latitude": string;
  "Longitude": string;
  "Motivo de Não Realizado": string;
  [key: string]: string;
}

export interface LatLng {
  lat: number;
  lng: number;
}