export interface Comentari {
    _id?: string;      // MongoDB genera automáticamente este campo al insertar
  texto: string;              // Texto del comentario
  autor: string[];            // Array de referencias a los autores (usamos string para los IDs en lugar de ObjectId)
  fecha: Date;                // Fecha del comentario
}
