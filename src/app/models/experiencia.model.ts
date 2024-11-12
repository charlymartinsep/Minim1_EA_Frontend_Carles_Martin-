import { Comentari } from './comentaris.model';  // Importas la interfaz Comentario

export interface Experiencia {
  _id?: string;
  owner: string;
  participants: string[];
  description: string;
  comentaris?: Comentari[];  // Usas el array de Comentarios aquí
}
