import * as XLSX from 'xlsx';

export default function exportExcelWithMultipleSheets(data1, data2, sheet1Name, sheet2Name, fileTitle) {
  // Crear el libro de trabajo (workbook)
  const wb = XLSX.utils.book_new();

  // Crear las hojas (sheets)
  const ws1 = XLSX.utils.json_to_sheet(data1); // Convertir el primer array de objetos en una hoja
  const ws2 = XLSX.utils.json_to_sheet(data2); // Convertir el segundo array de objetos en otra hoja

  // Agregar las hojas al libro de trabajo
  XLSX.utils.book_append_sheet(wb, ws1, sheet1Name); // Agregar la primera hoja
  XLSX.utils.book_append_sheet(wb, ws2, sheet2Name); // Agregar la segunda hoja

  // Generar el archivo Excel
  const exportedFilename = fileTitle + '.xlsx';

  // Crear el archivo y disparar la descarga
  XLSX.writeFile(wb, exportedFilename);
}
