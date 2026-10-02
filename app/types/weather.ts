export interface GiornoPrevisioni {
  data: string;
  min: number;
  max: number;
emoji: string;
}

export interface Weather {
  nomeCitta: string;
  temperaturaAttuale: number;
  descrizioneCondizioni: string;
  emoji: string;
  temperaturaMin: number;
  temperaturaMax: number;
  previsioni: GiornoPrevisioni[];
}