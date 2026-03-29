import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
if (args.length === 0) {
    console.error("Error: Debes especificar el nombre de la Entidad. (Ej. npm run make:crud-react Cliente)");
    process.exit(1);
}

const entityNameRaw = args[0];
const entityName = entityNameRaw.charAt(0).toUpperCase() + entityNameRaw.slice(1);
const entityNameLower = entityName.charAt(0).toLowerCase() + entityName.slice(1);
const entityPlural = entityName + "s";
const entityPluralLower = entityNameLower + "s";

console.log(`Generando CRUD moderno (Tailwind + Spring REST) para la entidad: ${entityName}...`);

const BASE_PACKAGE = "com.example.demo";
const JAVA_SRC_DIR = path.join("src", "main", "java", ...BASE_PACKAGE.split("."));
const REACT_PAGES_DIR = path.join("src", "main", "resources", "js", "Pages");

// Ensure directory exists
function ensureDir(dirName) {
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true });
    }
}

// Write to file
function writeContent(filePath, content) {
    if (fs.existsSync(filePath)) {
        console.log(`⚠️ Archivo ${filePath} ya existe. Omitiendo.`);
    } else {
        fs.writeFileSync(filePath, content);
        console.log(`✅ Archivo Creado: ${filePath}`);
    }
}

// 1. Model
ensureDir(path.join(JAVA_SRC_DIR, "model"));
const modelFile = path.join(JAVA_SRC_DIR, "model", `${entityName}.java`);
const modelContent = `package ${BASE_PACKAGE}.model;

import jakarta.persistence.*;

@Entity
@Table(name = "${entityPluralLower}")
public class ${entityName} {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String campoEjemplo;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCampoEjemplo() { return campoEjemplo; }
    public void setCampoEjemplo(String campoEjemplo) { this.campoEjemplo = campoEjemplo; }
}
`;
writeContent(modelFile, modelContent);

// 2. Repository
ensureDir(path.join(JAVA_SRC_DIR, "repository"));
const repoFile = path.join(JAVA_SRC_DIR, "repository", `${entityName}Repository.java`);
const repoContent = `package ${BASE_PACKAGE}.repository;

import ${BASE_PACKAGE}.model.${entityName};
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ${entityName}Repository extends JpaRepository<${entityName}, Long> {
}
`;
writeContent(repoFile, repoContent);

// 2.5 Service
ensureDir(path.join(JAVA_SRC_DIR, "service"));
const serviceFile = path.join(JAVA_SRC_DIR, "service", `${entityName}Service.java`);
const serviceContent = `package ${BASE_PACKAGE}.service;

import ${BASE_PACKAGE}.model.${entityName};
import ${BASE_PACKAGE}.repository.${entityName}Repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ${entityName}Service {

    private final ${entityName}Repository ${entityNameLower}Repository;

    @Autowired
    public ${entityName}Service(${entityName}Repository ${entityNameLower}Repository) {
        this.${entityNameLower}Repository = ${entityNameLower}Repository;
    }

    public List<${entityName}> findAll() {
        return ${entityNameLower}Repository.findAll();
    }

    public Optional<${entityName}> findById(Long id) {
        return ${entityNameLower}Repository.findById(id);
    }

    public ${entityName} save(${entityName} ${entityNameLower}) {
        return ${entityNameLower}Repository.save(${entityNameLower});
    }

    public void deleteById(Long id) {
        ${entityNameLower}Repository.deleteById(id);
    }
}
`;
writeContent(serviceFile, serviceContent);

// 3. Controller (RESTful)
ensureDir(path.join(JAVA_SRC_DIR, "controller"));
const controllerFile = path.join(JAVA_SRC_DIR, "controller", `${entityName}Controller.java`);
const controllerContent = `package ${BASE_PACKAGE}.controller;

import ${BASE_PACKAGE}.model.${entityName};
import ${BASE_PACKAGE}.service.${entityName}Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/${entityPluralLower}")
public class ${entityName}Controller {

    private final ${entityName}Service ${entityNameLower}Service;

    @Autowired
    public ${entityName}Controller(${entityName}Service ${entityNameLower}Service) {
        this.${entityNameLower}Service = ${entityNameLower}Service;
    }

    @GetMapping
    public ResponseEntity<List<${entityName}>> index() {
        return ResponseEntity.ok(${entityNameLower}Service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<${entityName}> show(@PathVariable Long id) {
        return ${entityNameLower}Service.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<${entityName}> store(@RequestBody ${entityName} entity) {
        return ResponseEntity.ok(${entityNameLower}Service.save(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<${entityName}> update(@PathVariable Long id, @RequestBody ${entityName} updateData) {
        return ${entityNameLower}Service.findById(id).map(existing -> {
            existing.setCampoEjemplo(updateData.getCampoEjemplo());
            return ResponseEntity.ok(${entityNameLower}Service.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> destroy(@PathVariable Long id) {
        ${entityNameLower}Service.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
`;
writeContent(controllerFile, controllerContent);

// 4. React Views (Modern Tailwind + Router)
const reactDir = path.join(REACT_PAGES_DIR, entityPlural);
ensureDir(reactDir);

// Index.tsx
const indexFile = path.join(reactDir, "Index.tsx");
const indexContent = `import React, { useEffect, useState } from "react";
import ContainerApp from "@/Components/Generales/ContainerApp";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faList, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import useAuth from "@/hooks/useAuth";
import DataTablecustom from "@/Components/Generales/DataTable";

const Index = () => {
    const { user, hasModuleAccess } = useAuth();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const response = await axios.get("/api/${entityPluralLower}");
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "var(--app-primary)",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar"
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(\`/api/${entityPluralLower}/\${id}\`);
                Swal.fire({
                    title: "Eliminado", 
                    text: "El registro ha sido eliminado.", 
                    icon: "success",
                    background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
                    color: document.documentElement.classList.contains('dark') ? '#f8fafc' : '#0f172a'
                });
                fetchData();
            } catch (error) {
                Swal.fire("Error", "No se pudo eliminar el registro.", "error");
            }
        }
    };

    const columns = [
        { name: "ID", selector: (row: any) => row.id, sortable: true, width: "100px" },
        { name: "Campo Ejemplo", selector: (row: any) => row.campoEjemplo, sortable: true },
        {
            name: "Acciones",
            width: "140px",
            cell: (row: any) => (
                <div className="flex gap-3 justify-center">
                    <Link to={\`/${entityPluralLower}/\${row.id}/edit\`} className="group w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 flex items-center justify-center hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-500 transition-all duration-300 shadow-sm hover:shadow-indigo-500/30 hover:-translate-y-0.5">
                        <FontAwesomeIcon icon={faEdit} className="group-hover:scale-110 transition-transform" />
                    </Link>
                    <button onClick={() => handleDelete(row.id)} className="group w-9 h-9 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 flex items-center justify-center hover:bg-rose-500 hover:text-white dark:hover:bg-rose-500 transition-all duration-300 shadow-sm hover:shadow-rose-500/30 hover:-translate-y-0.5">
                        <FontAwesomeIcon icon={faTrash} className="group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            )
        }
    ];

    if (!hasModuleAccess('${entityName}')) return <Authenticated user={user}><div>Acceso Denegado</div></Authenticated>;

    return (
        <Authenticated user={user}>
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 animate-fade-in text-slate-900 dark:text-slate-100">
                <ContainerApp titulo={\`Gestión de ${entityPlural}\`} icono={faList}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <div>
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600 dark:from-indigo-400 dark:to-primary">
                                Listado de ${entityPlural}
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                                Administra los registros de la base de datos de forma eficiente.
                            </p>
                        </div>
                        <Link to="/${entityPluralLower}/create" className="group flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all duration-300 active:scale-95 bg-gradient-to-r from-primary to-indigo-600 text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1">
                            <FontAwesomeIcon icon={faPlus} className="group-hover:rotate-90 transition-transform duration-300" />
                            <span>Nuevo ${entityName}</span>
                        </Link>
                    </div>
                    
                    <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl p-4 shadow-sm border border-slate-200/60 dark:border-slate-700/60">
                        <DataTablecustom 
                            columnas={columns} 
                            datos={data} 
                            isLoading={loading}
                        />
                    </div>
                </ContainerApp>
            </div>
        </Authenticated>
    );
};

export default Index;
`;
writeContent(indexFile, indexContent);

// Form.tsx
const formFile = path.join(reactDir, "Form.tsx");
const formContent = `import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import ContainerApp from "@/Components/Generales/ContainerApp";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes, faEdit, faPlus, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import useAuth from "@/hooks/useAuth";

export default function Form({ mode }: { mode: "create" | "update" }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const isEdit = mode === "update";

    const [loading, setLoading] = useState(isEdit);
    const [processing, setProcessing] = useState(false);
    const [serverErrors, setServerErrors] = useState<any>({});

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            campoEjemplo: ""
        }
    });

    useEffect(() => {
        if (isEdit && id) {
            axios.get(\`/api/${entityPluralLower}/\${id}\`).then(res => {
                setValue("campoEjemplo", res.data.campoEjemplo || "");
                setLoading(false);
            }).catch(err => {
                console.error("Error loading data", err);
                setLoading(false);
            });
        }
    }, [isEdit, id, setValue]);

    const onSubmit = async (data: any) => {
        setProcessing(true);
        setServerErrors({});
        try {
            const url = isEdit ? \`/api/${entityPluralLower}/\${id}\` : "/api/${entityPluralLower}";
            const method = isEdit ? "put" : "post";
            await axios[method](url, data);
            
            Swal.fire({
                icon: "success",
                title: isEdit ? "¡Actualizado!" : "¡Creado!",
                text: "El registro ha sido guardado correctamente.",
                timer: 2000,
                showConfirmButton: false,
                background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
                color: document.documentElement.classList.contains('dark') ? '#f8fafc' : '#0f172a'
            });
            navigate("/${entityPluralLower}");
        } catch (err: any) {
            if (err.response?.data?.errors) {
                setServerErrors(err.response.data.errors);
            }
            Swal.fire("Error", "Por favor revisa los campos señalados.", "error");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <Authenticated user={user}><div>Cargando...</div></Authenticated>;

    return (
        <Authenticated user={user}>
            <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8 animate-fade-in text-slate-900 dark:text-slate-100">
                <Link to="/${entityPluralLower}" className="inline-flex items-center text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 hover:text-primary transition-all mb-4 group">
                    <FontAwesomeIcon icon={faChevronLeft} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Volver al listado
                </Link>

                <ContainerApp titulo={isEdit ? "Editar ${entityName}" : "Crear ${entityName}"} icono={isEdit ? faEdit : faPlus}>
                    <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-slate-200/60 dark:border-slate-700/60">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <InputLabel value="Campo Ejemplo" className="text-slate-700 dark:text-slate-300 font-semibold ml-1" />
                                    <TextInput
                                        className="w-full h-12 bg-white/70 dark:bg-slate-900/70 border-slate-200 dark:border-slate-700 focus:ring-primary focus:border-primary rounded-xl transition-all duration-300"
                                        placeholder="Ingrese el valor..."
                                        isError={!!errors.campoEjemplo || !!serverErrors.campoEjemplo}
                                        {...register("campoEjemplo", { required: "El campo es requerido" })}
                                    />
                                    <InputError message={errors.campoEjemplo?.message?.toString() || serverErrors.campoEjemplo} className="ml-1" />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-4 pt-8 border-t border-slate-200/60 dark:border-slate-700/60">
                                <Link to="/${entityPluralLower}">
                                    <SecondaryButton type="button" className="h-12 px-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        <FontAwesomeIcon icon={faTimes} className="mr-2 opacity-70" /> Cancelar
                                    </SecondaryButton>
                                </Link>

                                <PrimaryButton type="submit" disabled={processing} className="h-12 px-8 rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 hover:-translate-y-0.5">
                                    {processing ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span className="font-semibold">Procesando...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <FontAwesomeIcon icon={faSave} className="text-lg" />
                                            <span className="font-semibold">{isEdit ? "Guardar Cambios" : "Crear Registro"}</span>
                                        </div>
                                    )}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </ContainerApp>
            </div>
        </Authenticated>
    );
}
`;
writeContent(formFile, formContent);

// 5. Migration
const migrationDir = path.join("src", "main", "resources", "db", "migration");
ensureDir(migrationDir);

const migrationFiles = fs.readdirSync(migrationDir).filter(f => f.startsWith('V') && f.endsWith('.sql'));
let nextVersion = 1;

if (migrationFiles.length > 0) {
    let maxVersion = 0;
    migrationFiles.forEach(file => {
        const match = file.match(/^V(\\d+)__/);
        if (match) {
            const version = parseInt(match[1]);
            if (version > maxVersion) {
                maxVersion = version;
            }
        }
    });
    nextVersion = maxVersion + 1;
}

const migrationFileName = `V${nextVersion}__create_${entityPluralLower}_table.sql`;
const migrationFile = path.join(migrationDir, migrationFileName);
const migrationContent = `CREATE TABLE IF NOT EXISTS ${entityPluralLower} (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    campo_ejemplo VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;

writeContent(migrationFile, migrationContent);

console.log("\n✅ CRUD generation (REST + Tailwind) completed successfully.");
console.log("💡 Note: You will need to:");
console.log(`   1. Add your fields to ${entityName}.java (and the SQL migration)`);
console.log("   2. Run your app to execute Flyway");
console.log(`   3. Add a route in router.tsx for /${entityPluralLower} and /${entityPluralLower}/create`);
