import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import ModalCustom from './ModalCustom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImport, faDownload, faUpload, faFileExcel, faCheckCircle, faExclamationCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

/**
 * Componente ImportData
 * 
 * Permite importar datos masivos desde archivos CSV o XLSX.
 * Ofrece descarga de plantilla, validación visual y previsualización.
 * 
 * @param {string} title - Título del modal
 * @param {Array} columns - Definición de columnas esperadas: [{ header: 'Nombre', key: 'nombre', required: true, description: 'Texto' }]
 * @param {function} onImport - Callback al confirmar la importación: (data) => { ... }
 * @param {string} templateName - Nombre del archivo de plantilla a descargar (sin extensión)
 * @param {boolean} showBtn - Si true, muestra el botón de abrir modal. Si no, se controla externamente mediante ref o estado elevado (future work). Por defecto true.
 */
const ImportData = ({
    title = "Importación Masiva",
    columns = [],
    onImport,
    templateName = "plantilla_importacion"
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [fileData, setFileData] = useState([]);
    const [fileName, setFileName] = useState("");
    const [loading, setLoading] = useState(false);
    const [headersMatch, setHeadersMatch] = useState(null); // null: no check, true: ok, false: error
    const fileInputRef = useRef(null);

    // --- Funciones de Utilidad ---

    // Descargar Plantilla
    const downloadTemplate = () => {
        // Crear un objeto con las claves de las columnas vacías
        const templateRow = {};
        columns.forEach(col => {
            templateRow[col.header] = ""; // Usamos el header como clave visible en el excel
        });

        // Crear hoja de cálculo
        const ws = XLSX.utils.json_to_sheet([templateRow]);

        // Ajustar anchos de columna (opcional, visual)
        const wscols = columns.map(() => ({ wch: 20 }));
        ws['!cols'] = wscols;

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Plantilla");

        // Descargar
        XLSX.writeFile(wb, `${templateName}.xlsx`);
    };

    // Procesar Archivo
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        setFileName(file.name);
        setHeadersMatch(null);

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];

                // Convertir a JSON
                const data = XLSX.utils.sheet_to_json(ws, { header: 1 }); // Header: 1 devuelve array de arrays

                if (data.length === 0) {
                    Swal.fire('Error', 'El archivo está vacío', 'error');
                    setLoading(false);
                    return;
                }

                const fileHeaders = data[0]; // Primera fila son los headers

                // Validar cabeceras
                const expectedHeaders = columns.map(c => c.header);

                // Normalizar para comparación (trim, lowercase opcional)
                const missingHeaders = expectedHeaders.filter(
                    eh => !fileHeaders.some(fh => fh && fh.toString().trim() === eh.toString().trim())
                );

                if (missingHeaders.length > 0) {
                    setHeadersMatch(false);
                    Swal.fire({
                        title: 'Estructura Incorrecta',
                        text: `Faltan las siguientes columnas: ${missingHeaders.join(', ')}`,
                        icon: 'error',
                        confirmButtonColor: '#ef4444' // red-500
                    });
                    setFileData([]);
                } else {
                    setHeadersMatch(true);

                    // Mapear datos a claves de objeto
                    const jsonData = XLSX.utils.sheet_to_json(ws); // Esto usa la primera fila como keys automáticamente

                    // Filtrar solo las claves que nos interesan (mapear headers a keys internas si es necesario, 
                    // pero para simplificar asumimos que el usuario llena el excel con los headers que le dimos).
                    // Si necesitamos mapeo 'Header Visible' -> 'key_interna', lo hacemos aquí.

                    const mappedData = jsonData.map(row => {
                        const newRow = {};
                        columns.forEach(col => {
                            // Buscar el valor usando el header
                            // A veces xlsx limpia keys, mejor asegurar coincidencia exacta
                            // Aquí asumimos coincidencia directa por simplicidad del template
                            newRow[col.key] = row[col.header];
                        });
                        return newRow;
                    });

                    setFileData(mappedData);
                }
            } catch (error) {
                console.error(error);
                Swal.fire('Error', 'No se pudo procesar el archivo', 'error');
            } finally {
                setLoading(false);
            }
        };
        reader.readAsBinaryString(file);
    };

    const handleProcess = () => {
        if (fileData.length === 0) return;

        onImport(fileData);
        setIsOpen(false);
        resetState();
    };

    const resetState = () => {
        setFileData([]);
        setFileName("");
        setHeadersMatch(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <>
            {/* Botón Trigger */}
            <button
                onClick={() => setIsOpen(true)}
                className="btn btn-primary d-inline-flex align-items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors"
                title="Importar Datos"
            >
                <FontAwesomeIcon icon={faFileImport} />
                <span className="hidden sm:inline">Importar</span>
            </button>

            {/* Modal */}
            <ModalCustom show={isOpen} onClose={() => setIsOpen(false)} maxWidth="2xl">
                <ModalCustom.Header onClose={() => setIsOpen(false)} closeButton>
                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faFileImport} className="text-indigo-500" />
                        {title}
                    </div>
                </ModalCustom.Header>

                <ModalCustom.Body>
                    <div className="space-y-6">

                        {/* 1. Instrucciones y Plantilla */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                            <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-2">Instrucciones:</h4>
                            <p className="text-xs text-blue-700 dark:text-blue-400 mb-3">
                                1. Descarga la plantilla predefinida.<br />
                                2. Llena los datos respetando las columnas.<br />
                                3. Sube el archivo para previsualizar y confirmar.
                            </p>

                            <div className="flex justify-between items-center">
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold">Columnas Requeridas:</span> {columns.filter(c => c.required).length}
                                </div>
                                <button
                                    onClick={downloadTemplate}
                                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 bg-white dark:bg-slate-800 px-3 py-1.5 rounded border border-indigo-200 dark:border-indigo-800 shadow-sm transition-all hover:shadow-md"
                                >
                                    <FontAwesomeIcon icon={faDownload} /> Descargar Plantilla
                                </button>
                            </div>
                        </div>

                        {/* 2. Área de Carga */}
                        <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors bg-gray-50 dark:bg-slate-800/50">
                            <input
                                type="file"
                                accept=".xlsx, .xls, .csv"
                                onChange={handleFileUpload}
                                className="hidden"
                                id="file-upload-input"
                                ref={fileInputRef}
                            />
                            <label htmlFor="file-upload-input" className="cursor-pointer flex flex-col items-center">
                                {loading ? (
                                    <FontAwesomeIcon icon={faSpinner} spin className="text-3xl text-gray-400 mb-2" />
                                ) : (
                                    <FontAwesomeIcon icon={fileName ? faFileExcel : faUpload} className={`text-3xl mb-2 ${fileName ? 'text-green-500' : 'text-gray-400'}`} />
                                )}

                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {fileName || "Haz clic para subir tu archivo (XLSX, CSV)"}
                                </span>
                                {fileName && (
                                    <span className="text-xs text-green-600 dark:text-green-400 mt-1 font-semibold">
                                        Archivo cargado listo para procesar
                                    </span>
                                )}
                            </label>
                        </div>

                        {/* 3. Previsualización y Especificaciones */}
                        {fileData.length > 0 && (
                            <div className="mt-4 animate-fadeIn">
                                <h5 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
                                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                                    Previsualización ({fileData.length} filas)
                                </h5>
                                <div className="overflow-x-auto border border-gray-200 dark:border-slate-700 rounded-lg max-h-48 custom-scrollbar">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700 text-xs">
                                        <thead className="bg-gray-50 dark:bg-slate-800 sticky top-0">
                                            <tr>
                                                {columns.map((col, idx) => (
                                                    <th key={idx} className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                        {col.header} {col.required && <span className="text-red-500">*</span>}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-700">
                                            {fileData.slice(0, 5).map((row, rIdx) => (
                                                <tr key={rIdx}>
                                                    {columns.map((col, cIdx) => (
                                                        <td key={cIdx} className="px-3 py-2 whitespace-nowrap text-gray-700 dark:text-gray-300">
                                                            {row[col.key] || <span className="text-gray-300 italic">-</span>}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                            {fileData.length > 5 && (
                                                <tr>
                                                    <td colSpan={columns.length} className="px-3 py-2 text-center text-gray-400 italic bg-gray-50 dark:bg-slate-800">
                                                        ... {fileData.length - 5} filas más ...
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Especificaciones Técnicas (Collapsible opcional) */}
                        <div className="mt-4">
                            <details className="text-xs text-gray-500 dark:text-gray-400">
                                <summary className="cursor-pointer hover:text-indigo-500 font-medium">Ver especificaciones de columnas</summary>
                                <ul className="mt-2 pl-4 list-disc space-y-1">
                                    {columns.map((col, idx) => (
                                        <li key={idx}>
                                            <strong className="text-gray-700 dark:text-gray-300">{col.header}:</strong> {col.description || "Texto estándar"}
                                            {col.required ? <span className="text-red-500 ml-1">(Requerido)</span> : <span className="text-gray-400 ml-1">(Opcional)</span>}
                                        </li>
                                    ))}
                                </ul>
                            </details>
                        </div>

                    </div>
                </ModalCustom.Body>

                <ModalCustom.Footer>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="btn btn-secondary text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 px-4 py-2 rounded-md mr-2"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleProcess}
                        disabled={fileData.length === 0}
                        className={`btn px-4 py-2 rounded-md text-white transition-all ${fileData.length > 0 ? 'bg-indigo-600 hover:bg-indigo-700 shadow-md' : 'bg-gray-400 cursor-not-allowed'}`}
                    >
                        Procesar Importación
                    </button>
                </ModalCustom.Footer>
            </ModalCustom>
        </>
    );
};

export default ImportData;
