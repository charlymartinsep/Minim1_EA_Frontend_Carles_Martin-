import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comentari } from '../models/comentaris.model';  // Asegúrate de tener la interfaz Comentari

@Injectable({
  providedIn: 'root'
})
export class ComentariService {
  private apiUrl = "http://localhost:3000/api/comentarios";  // URL de los comentarios, asegúrate que sea la correcta

  constructor(private http: HttpClient) {}

  // Obtener todos los comentarios sin paginación
  getComentaris(): Observable<Comentari[]> {
    return this.http.get<Comentari[]>(`${this.apiUrl}/all`);  // Usamos GET porque ya no estamos enviando un objeto de paginación
  }

  // Agregar un nuevo comentario
  addComentari(comentari: Comentari): Observable<Comentari> {
    return this.http.post<Comentari>(this.apiUrl, comentari);
  }

  // Actualizar un comentario existente
  updateComentari(comentari: Comentari): Observable<Comentari> {
    return this.http.put<Comentari>(`${this.apiUrl}/${comentari._id}`, comentari);
  }

  // Eliminar un comentario por su _id
  deleteComentariById(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Habilitar o deshabilitar un comentario (si es necesario)
  toggleHabilitacionComentari(id: string, habilitado: boolean): Observable<Comentari> {
    return this.http.patch<Comentari>(`${this.apiUrl}/${id}/habilitacion`, { habilitado });
  }
}
