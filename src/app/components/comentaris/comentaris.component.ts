import { Component, OnInit } from '@angular/core';
import { ComentariService } from '../../services/comentari.service';  // Servicio de Comentaris
import { Comentari } from '../../models/comentaris.model';  // Interfaz de Comentaris
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { pageInterface } from '../../models/paginacion.model';

@Component({
  selector: 'app-comentaris',
  templateUrl: './comentaris.component.html',
  standalone: true,
  styleUrls: ['./comentaris.component.css'],
  imports: [FormsModule, CommonModule, HttpClientModule, TruncatePipe]
})
export class ComentarisComponent implements OnInit {
  comentaris: Comentari[] = [];  // Lista de comentaris
  users: User[] = [];  // Lista de usuarios para los desplegables
  selectedComentario: string = '';  // Comentari seleccionado
  errorMessage: string = '';  // Mensaje de error
  experienciaIdFilter: string = '';  // Filtro para las experiencias

  nuevapaginacion: pageInterface = {
    paginas: 1,
    numerodecaracterespp: 5
  };

  newComentari: Comentari = {
    texto: '',
    autor: [''],  // Esto es un arreglo de strings, aunque esté vacío
    fecha: new Date()
  };
  

  constructor(private comentariService: ComentariService, private userService: UserService) {}

  filterComentarios = '';

  ngOnInit(): void {
    this.getComentaris();  // Obtener la lista de comentaris
  }

  // Obtener la lista de comentaris desde la API
  getComentaris(): void {
    this.comentariService.getComentaris().subscribe(
      (data: Comentari[]) => {
        // Filtrar comentaris que tengan _id definido
        this.comentaris = data.filter(com => com._id !== undefined);
        console.log('Comentaris recibidos:', data);
      },
      (error) => {
        console.error('Error al obtener los comentaris:', error);
      }
    );
  }
  // Método para eliminar un comentari por su ID
  deleteComentari(comentariId: string): void {
    this.comentariService.deleteComentariById(comentariId).subscribe(
      () => {
        console.log(`Comentari con ID ${comentariId} eliminado`);
        this.getComentaris();  // Actualizar la lista de comentaris después de la eliminación
      },
      (error) => {
        console.error('Error al eliminar el comentari:', error);
      }
    );
  }
  // Obtener el nombre de un usuario dado su ObjectId
  getComentariById(comentariId: string): string|null {
    const comentari = this.comentaris.find((c) => c._id === comentariId);
    return comentari ? comentari.texto : 'Bon comentari';
  }

  // Obtener los comentaris filtrados por experiencia
  getComentarisFiltrados(comentariId: string): void {
    if (comentariId === '') {
      this.getComentaris();  // Si no hay filtro, traemos todos los comentaris
    } else {
      this.comentariService.getComentaris().subscribe(
        (data: Comentari[]) => {
          this.comentaris = data.filter(com => com._id !== undefined && com._id === comentariId);
          console.log('Comentaris filtrados:', data);
        },
        (error) => {
          console.error('Error al obtener los comentaris filtrados:', error);
        }
      );
    }
  }

  

  // Manejar el envío del formulario para agregar un nuevo comentari
  onSubmit(): void {
    this.errorMessage = '';  // Limpiar mensajes de error

    // Verificar si los campos están vacíos
    if (!this.newComentari.texto || !this.newComentari.autor) {
      this.errorMessage = 'Todos los campos son obligatorios.';
      return;
    }

    // Llamar al servicio para agregar el nuevo comentari
    this.comentariService.addComentari(this.newComentari).subscribe(
      (response) => {
        console.log('Comentari creado:', response);
        this.getComentaris();  // Actualizar la lista de comentaris después de crear uno nuevo
        this.resetForm();  // Limpiar el formulario
      },
      (error) => {
        console.error('Error al crear el comentari:', error);
      }
    );
  }

  

  // Resetear el formulario después de crear un comentari
  resetForm(): void {
    this.newComentari = {
      texto: '',
      autor: [''],  // Limpiar el autor (ObjectId)
      fecha: new Date()
    };
    this.errorMessage = '';  // Limpiar el mensaje de error
  }
  
  elFilter(): void {
    this.experienciaIdFilter = '';
    this.getComentarisFiltrados(this.experienciaIdFilter);  // Eliminar el filtro
  }
}
