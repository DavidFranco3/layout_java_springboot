import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import ModalCustom from './ModalCustom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImport, faDownload, faUpload, faFileExcel, faCheckCircle, faExclamationCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import Skeleton from './Skeleton';

/**
 * Componente ImportData
 * 
 * Permite importar datos masivos desde archivos CSV o XLSX.
 * Ofrece descarga de plantilla, validación visual y previsualización.
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
    const [headersMatch, setHeadersMatch] = useState(null);
    const fileInputRef = useRef(null);

    // --- Funciones de Utilidad ---

    const downloadTemplate = () => {
        const templateRow = {};
        columns.forEach(col => {
            templateRow[col.header] = "";
        });

        const ws = XLSX.utils.json_to_sheet([templateRow]);
        const wscols = columns.map(() => ({ wch: 20 }));
        ws['!cols'] = wscols;

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Plantilla");
        XLSX.writeFile(wb, `${templateName}.xlsx`);
    };

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
                const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

                if (data.length === 0) {
                    Swal.fire('Error', 'El archivo está vacío', 'error');
                    setLoading(false);
                    return;
                }

                const fileHeaders = data[0];
                const expectedHeaders = columns.map(c => c.header);
                const missingHeaders = expectedHeaders.filter(
                    eh => !fileHeaders.some(fh => fh && fh.toString().trim() === eh.toString().trim())
                );

                if (missingHeaders.length > 0) {
                    setHeadersMatch(false);
                    Swal.fire({
                        title: 'Estructura Incorrecta',
                        text: `Faltan las siguientes columnas: ${missingHeaders.join(', ')}`,
                        icon: 'error',
                        confirmButtonColor: '#ef4444'
                    });
                    setFileData([]);
                } else {
                    setHeadersMatch(true);
                    const jsonData = XLSX.utils.sheet_to_json(ws);
                    const mappedData = jsonData.map(row => {
                        const newRow = {};
                        columns.forEach(col => {
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
            <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg active:scale-95"
                title="Importar Datos"
            >
                <FontAwesomeIcon icon={faFileImport} />
                <span className="hidden sm:inline">Importar Datos</span>
            </button>

            <ModalCustom show={isOpen} onClose={() => setIsOpen(false)} maxWidth="2xl">
                <ModalCustom.Header onClose={() => setIsOpen(false)} closeButton>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <FontAwesomeIcon icon={faFileImport} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white leading-tight">{title}</h3>
                            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Módulo de carga masiva</p>
                        </div>
                    </div>
                </ModalCustom.Header>

                <ModalCustom.Body>
                    <div className="space-y-6">
                        {/* 1. Instrucciones y Plantilla */}
                        <div className="bg-primary/5 dark:bg-primary/10 p-5 rounded-2xl border border-primary/10">
                            <h4 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
                                <i className="fas fa-lightbulb" /> Instrucciones de uso
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="p-3 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-primary/5">
                                    <span className="text-[10px] font-black text-primary/40 block mb-1">Paso 1</span>
                                    <p className="text-[11px] text-slate-600 dark:text-slate-400">Descarga la plantilla oficial Excel.</p>
                                </div>
                                <div className="p-3 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-primary/5">
                                    <span className="text-[10px] font-black text-primary/40 block mb-1">Paso 2</span>
                                    <p className="text-[11px] text-slate-600 dark:text-slate-400">Llena los campos (marcados con *).</p>
                                </div>
                                <div className="p-3 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-primary/5">
                                    <span className="text-[10px] font-black text-primary/40 block mb-1">Paso 3</span>
                                    <p className="text-[11px] text-slate-600 dark:text-slate-400">Sube el archivo y confirma.</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-2">
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                                    <span className="text-primary">{columns.filter(c => c.required).length}</span> columnas obligatorias
                                </div>
                                <button
                                    onClick={downloadTemplate}
                                    className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-primary/20 shadow-sm transition-all hover:shadow-md active:scale-95"
                                >
                                    <FontAwesomeIcon icon={faDownload} /> Descargar Plantilla
                                </button>
                            </div>
                        </div>

                        {/* 2. Área de Carga */}
                        <div className={`relative border-2 border-dashed rounded-3xl p-8 text-center transition-all duration-300 ${fileName ? 'border-emerald-500/50 bg-emerald-50/20 dark:bg-emerald-500/5' : 'border-slate-300 dark:border-slate-700 hover:border-primary/50 bg-slate-50/50 dark:bg-slate-800/20'}`}>
                            <input
                                type="file"
                                accept=".xlsx, .xls, .csv"
                                onChange={handleFileUpload}
                                className="hidden"
                                id="file-upload-input"
                                ref={fileInputRef}
                            />
                            <label htmlFor="file-upload-input" className="cursor-pointer flex flex-col items-center group">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${fileName ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-200 dark:bg-slate-700 text-slate-400 group-hover:bg-primary group-hover:text-white group-hover:shadow-lg'}`}>
                                    {loading ? (
                                        <FontAwesomeIcon icon={faSpinner} spin className="text-2xl" />
                                    ) : (
                                        <FontAwesomeIcon icon={fileName ? faFileExcel : faUpload} className="text-2xl" />
                                    )}
                                </div>

                                <span className={`text-sm font-bold transition-colors ${fileName ? 'text-emerald-600' : 'text-slate-700 dark:text-slate-300'}`}>
                                    {fileName || "Seleccionar archivo XLSX / CSV"}
                                </span>
                                <p className="text-[11px] text-slate-500 mt-1">Arrastra tu archivo aquí o haz clic para explorar</p>
                            </label>
                        </div>

                        {/* 3. Previsualización con Skeletons */}
                        {loading ? (
                            <div className="space-y-3">
                                <Skeleton variant="text" width="150px" />
                                <Skeleton.Table rows={3} cols={4} />
                            </div>
                        ) : fileData.length > 0 && (
                            <div className="mt-4 animate-fade-in">
                                <div className="flex items-center justify-between mb-3">
                                    <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-[10px]">
                                            <FontAwesomeIcon icon={faCheckCircle} />
                                        </div>
                                        Previsualización de datos
                                    </h5>
                                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg font-bold text-slate-500 uppercase">
                                        {fileData.length} registros detectados
                                    </span>
                                </div>
                                <div className="overflow-hidden border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                                    <div className="overflow-x-auto max-h-48 custom-scrollbar">
                                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-[11px]">
                                            <thead className="bg-slate-50 dark:bg-slate-900 sticky top-0 z-10">
                                                <tr>
                                                    {columns.map((col, idx) => (
                                                        <th key={idx} className="px-4 py-3 text-left font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                            {col.header} {col.required && <span className="text-rose-500 ml-0.5">*</span>}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
                                                {fileData.slice(0, 5).map((row, rIdx) => (
                                                    <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                        {columns.map((col, cIdx) => (
                                                            <td key={cIdx} className="px-4 py-3 whitespace-nowrap text-slate-700 dark:text-slate-300 font-medium">
                                                                {row[col.key] || <span className="text-slate-300 italic">-</span>}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                                {fileData.length > 5 && (
                                                    <tr>
                                                        <td colSpan={columns.length} className="px-4 py-3 text-center text-slate-400 font-bold italic bg-slate-50/50 dark:bg-slate-800/30">
                                                            ... y {fileData.length - 5} registros más ...
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </ModalCustom.Body>

                <ModalCustom.Footer className="bg-slate-50/50 dark:bg-slate-900/50 p-6 flex justify-end gap-3 rounded-b-3xl">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="px-6 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleProcess}
                        disabled={fileData.length === 0 || loading}
                        className={`px-8 py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow-md active:scale-95 ${fileData.length > 0 ? 'bg-primary hover:bg-primary-hover hover:shadow-lg' : 'bg-slate-300 dark:bg-slate-800 cursor-not-allowed text-slate-500'}`}
                    >
                        Completar Importación
                    </button>
                </ModalCustom.Footer>
            </ModalCustom>
        </>
    );
};

export default ImportData;
