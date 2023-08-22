import { Component, OnInit} from '@angular/core';

import { Chart, registerables } from 'chart.js';
import { DashBoardService } from 'src/app/Services/dash-board.service';

Chart.register(...registerables);


@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css']
})
export class DashBoardComponent implements OnInit{

  totalIngresos: string="0";
  totalVentas: string="0";
  totalProductos:string="0";

  constructor(
    private _dashboardServicio:DashBoardService
  ) {}

  
  ngOnInit(): void {
     this._dashboardServicio.resumen().subscribe({
      next:(data)=>{
        if(data.status){
          this.totalIngresos = data.value.totalIngresos;
          this.totalVentas = data.value.totalVentas;
          this.totalProductos = data.value.totalProductos;

          const arrayData: any[] = data.value.ventasUltimaSemana;

          const labelTemp = arrayData.map((value) => value.fecha);
          const dataTemp = arrayData.map((value) => value.total);
          
          console.log(labelTemp, dataTemp);

          
        }
      },
      error:(e)=>{}
     })
    
  }

}
