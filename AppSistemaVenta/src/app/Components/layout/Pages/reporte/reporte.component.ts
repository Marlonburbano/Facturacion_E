import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';

import * as Xlsx from "xlsx"

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;



import { Reporte } from 'src/app/Interfaces/reporte';
import { VentaService } from 'src/app/Services/venta.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';







export const MY_DATA_FORMATS= {
  parse:{
    dateInput: 'DD/MM/YYYY'
  },
  display:{
    dateInput: 'DD/MM/YYYY',
    monthYearLabel:'MMMM YYYY'
  }
}

@Component({
  
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css'],
  providers: [
    {provide:MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS}

    
  ]
})
export class ReporteComponent implements OnInit {

  formularioFiltro: FormGroup;
  listaVentasReporte: Reporte[] = [];
  columnasTabla: string[] = ['fechaRegistro', 'numeroVenta', 'tipoPago', 'total', 'producto', 'cantidad', 'precio', 'totalProducto'];
  dataVentaReporte = new MatTableDataSource(this.listaVentasReporte);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private fb:FormBuilder,
    private _ventaServicio:VentaService,
    private _utilidadServicio:UtilidadService
  ) {
    this.formularioFiltro = this.fb.group({
      fechaInicio: [''],
      fechaFin: ['']
    }) 
  }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    this.dataVentaReporte.paginator = this.paginacionTabla; 
  }

  buscarVentas(){
    const _fechaInicio =moment( this.formularioFiltro.value.fechaInicio).format('DD/MM/YYYY');
    const _fechaFin =moment( this.formularioFiltro.value.fechaFin).format('DD/MM/YYYY');

    if(_fechaInicio === "Invalid date" || _fechaFin === "Invalid date"){
      this._utilidadServicio.mostrarAlerta("Debe Ingresar ambas fechas", "OOpps!!");
      return;
    }

    this._ventaServicio.reporte(
      _fechaInicio, 
      _fechaFin
    ).subscribe({
      next: (data) => {
        if(data.status){
          this.listaVentasReporte = data.value;
          this.dataVentaReporte.data = data.value;
        }else{
          this.listaVentasReporte = [];
          this.dataVentaReporte.data = [];
          this._utilidadServicio.mostrarAlerta("No se encontraron Datos", "Opps!!")
        }
      },
      error: (e)=>{}
    })
  }

  exportarExcel(){
    const wb = Xlsx.utils.book_new();
    const ws = Xlsx.utils.json_to_sheet(this.listaVentasReporte);

    Xlsx.utils.book_append_sheet(wb, ws, "Reporte");

    Xlsx.writeFile(wb, "Reporte Ventas Remastes Moreno .xlsx");
  }

  exportarPDF() {
    const tableBody = [];
  
    // Preparar los datos para la tabla
    this.listaVentasReporte.forEach(venta => {
      tableBody.push([
        venta.numeroDocumento || '',
        venta.tipoPago || '',
        venta.fechaRegistro || '',
        venta.totalVenta || '',
        venta.producto|| '',
        venta.cantidad || '',
        venta.precio || '',
        venta.total || ''
      ]);
    });
  
    const content = [
      { text: 'Reporte de Ventas', style: 'header' },
      {
        table: {
          headerRows: 1,
          widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
          body: [
            ['Número Venta', 'Tipo Pago', 'Fecha Registro', 'Total Venta', 'Producto', 'Cantidad', 'Precio', 'Total '],
            ...tableBody
          ]
        }
      }
    ];
  
    const docDefinition = {
      content,
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        }
      }
    };
  
    pdfMake.createPdf(docDefinition).download('Reporte_Ventas_Remastes_Moreno.pdf');
  }
  
  
}
