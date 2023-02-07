import { Directive, Input, Renderer2, ElementRef, HostListener } from '@angular/core';
import { SortTable } from '../utiles/sort-table';

@Directive({
  selector: '[appSortAux]'
})

export class SortDirectiveAux {

    @Input() appSortAux: Array<any>;

    constructor(private renderer: Renderer2, private targetElement: ElementRef) { }

    @HostListener("click")
    sortData() {

        const sort = new SortTable();

        const elem = this.targetElement.nativeElement;

        const order = elem.getAttribute("data-order");

        const type = elem.getAttribute("data-type");

        const property = elem.getAttribute("data-name");

        if (order === "desc") {
            this.appSortAux.sort(sort.startSort(property, order, type));
            elem.setAttribute("data-order", "asc");
        }
        else {
            this.appSortAux.sort(sort.startSort(property, order, type));
            elem.setAttribute("data-order", "desc");
        }
    }
}