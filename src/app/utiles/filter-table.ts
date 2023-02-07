export function AplicarFiltro(filtros: Array<IDataFilter>, datos: Array<any>) {
    let tempDatos = datos;
    if (datos) {
        filtros.forEach((filtro) => {
            if (filtro.key && filtro.value)
                tempDatos = tempDatos.filter(fil => fil[filtro.key].toString().toLowerCase().includes(filtro.value.toString().toLowerCase()));
        })
    }
    return tempDatos;
}


export interface IDataFilter {
    key: string;
    value: any;
}