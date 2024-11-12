import { Component, OnInit } from '@angular/core';
import { ExperienciaService } from '../../services/experiencia.service';
import { ComentariService } from '../../services/comentari.service'; // Servicio para obtener comentarios
import { UserService } from '../../services/user.service';
import { Experiencia } from '../../models/experiencia.model';
import { User } from '../../models/user.model';
import { Comentari } from '../../models/comentaris.model';  // Modelo para comentarios

@Component({
  selector: 'app-experiencia',
  templateUrl: './experiencia.component.html',
  styleUrls: ['./experiencia.component.css']
})
export class ExperienciaComponent implements OnInit {
  experiencias: Experiencia[] = [];
  users: User[] = [];
  selectedParticipants: string[] = [];
  newExperience: Experiencia = {
    owner: '',
    participants: [],
    description: ''
  };
  newExperience2: Experiencia = {
    owner: '',
    participants: [],
    description: ''
  };
  errorMessage: string = '';
  newComment: string = ''; // Nuevo comentario

  constructor(
    private experienciaService: ExperienciaService, 
    private userService: UserService,
    private comentariService: ComentariService // Inyectamos el servicio de comentarios
  ) {}

  ngOnInit(): void {
    this.getExperiencias();
    this.getUsers();
  }

  // Obtener la lista de experiencias
  getExperiencias(): void {
    this.experienciaService.getExperiencias().subscribe(
      (data: Experiencia[]) => {
        this.experiencias = data;
      },
      (error) => {
        console.error('Error al obtener las experiencias:', error);
      }
    );
  }


  // Función para agregar un comentario a una experiencia
addCommentToExperience(experienceId: string, commentText: string): void {
  if (!commentText) {
    this.errorMessage = 'El comentario no puede estar vacío.';
    return;
  }

  // Crear el nuevo comentario
  const newComentario: Comentari = {
    texto: commentText,
    autor: [this.newExperience.owner], // Asumiendo que el comentario lo hace el dueño de la experiencia
    fecha: new Date()
  };

  // Verificar si el comentario es válido (para evitar que sea undefined)
  if (newComentario.texto === undefined || newComentario.texto.trim() === '') {
    this.errorMessage = 'El comentario no puede estar vacío.';
    return;
  }

  this.comentariService.addComentari(newComentario).subscribe(
    (comentario: Comentari) => {
      console.log('Comentario agregado:', comentario);

      // Actualizar la experiencia para agregar el nuevo comentario (usando el ID del comentario)
      this.experienciaService.addComentarioToExperiencia(experienceId, comentario._id).subscribe(
        (updatedExperience: Experiencia) => {
          this.getExperiencias();  // Volver a cargar las experiencias con el nuevo comentario
        },
        (error) => {
          console.error('Error al agregar comentario a la experiencia:', error);
        }
      );
    },
    (error) => {
      console.error('Error al agregar comentario:', error);
    }
  );
}


  // Obtener el texto de un comentario por su ID
getComentarioById(comentarioId: string): string {
  // Buscamos el comentario con el comentarioId dentro de las experiencias.
  const comentario = this.experiencias.flatMap(exp => exp.comentaris || [])
    .find((comentarioId) => comentarioId === comentarioId);
  
  // Si el comentario no existe, devolvemos un texto por defecto
  return comentario ? comentario.texto : 'Comentario desconocido';
}


  // Manejo del filtro, eliminación y otras acciones que ya tienes en tu componente...
}
