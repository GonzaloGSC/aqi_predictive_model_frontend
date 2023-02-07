import { Component, OnInit, HostBinding, Injectable } from '@angular/core';
import { NbToastrService, NbComponentStatus, NbToastComponent, NbSidebarModule, NbLayoutModule, NbGlobalPosition, NbGlobalLogicalPosition } from '@nebular/theme';

@Component({
  selector: 'nb-toastr-statuses',
  template: '',
})

@Injectable()
export class toastrService {
  constructor(private toastrService : NbToastrService) { }
  /**
   * Mensaje de error standar
   * @param mensaje mensaje a mostrar 
   * @param titulo titulo de toast
   * @param position posiciòn mensaje o defecto bottom-right
   * @param status color mensajer o defecto danger
   * @param duration duraciòn mensaje o defecto 3 segundos
   * @param destroyByClick 
   * @param hasIcon 
   * @param preventDuplicates 
   */
  showToast(mensaje, titulo, position: any = 'bottom-right', status:NbComponentStatus = 'danger', duration = 3000, destroyByClick = true, hasIcon = true, preventDuplicates = true ) {
    this.toastrService.show(
      mensaje,
      titulo,
      { position, status, duration, destroyByClick, hasIcon, preventDuplicates });
  }
}