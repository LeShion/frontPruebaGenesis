import { Component, OnInit } from '@angular/core';
import { TipoCambioRango } from '../tipo-cambio-rango';
import { TipoCambioRangoServiceService } from '../tipo-cambio-rango-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listar-tipo-cambio',
  templateUrl: './listar-tipo-cambio.component.html',
  styleUrls: ['./listar-tipo-cambio.component.css']
})
export class ListarTipoCambioComponent implements OnInit{

  tipoCambio!:TipoCambioRango[];
  fecha_ini: any;
  fecha_final: any;
  page: number = 1; // Página actual
  totalItems: number = 0; // Inicializamos totalItems en 0
  AlertaExito: boolean = false;
  maxFecha!: string;

  constructor(private tipoCambioService:TipoCambioRangoServiceService, private router:Router){
      this.maxFecha = new Date().toISOString().split('T')[0];
    }

  ngOnInit(): void {
    //this.obtenerTipoCambioRango();
  }

  obtenerTipoCambioRango(fecha_ini: string, fecha_final: string) {
    this.tipoCambioService.obtenerListaTipoCambio(fecha_ini, fecha_final).subscribe(dato => {
      this.tipoCambio = dato;
      this.totalItems = this.tipoCambio.length; // Actualizar totalItems después de obtener los datos
      this.AlertaExito = this.totalItems > 0;
    });
  }

  enviarFechas() {
    if (!this.fecha_ini || !this.fecha_final) {
      alert("Por favor, selecciona ambas fechas.");
      return; // Salir de la función si falta alguna fecha
    }
    if(this.fecha_ini > this.fecha_final){
      alert("Por favor, la fecha inicial debe ser menor a la final.");
      return; // Salir de la función si falta alguna fecha
    }

    // Obtener las fechas desde el HTML
    const fecha_ini_raw = (<HTMLInputElement>document.getElementById('fechaInicial')).value;
    const fecha_final_raw = (<HTMLInputElement>document.getElementById('fechaFinal')).value;

    // Convertir formato de fechas de "YYYY-MM-DD" a "dd/mm/YYYY"
    this.fecha_ini = this.formatDate(fecha_ini_raw);
    this.fecha_final = this.formatDate(fecha_final_raw);
    

    // Llamar a la función para obtener el tipo de cambio con las fechas seleccionadas
    if (this.fecha_ini && this.fecha_final) {
      this.obtenerTipoCambioRango(this.fecha_ini, this.fecha_final);
    } else {
      console.error('Las fechas no están definidas.');
    }
  }

  // Función para formatear la fecha en "dd/mm/YYYY"
  formatDate(date: string): string {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }
}
