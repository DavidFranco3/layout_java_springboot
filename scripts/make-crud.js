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

console.log(`Generando CRUD para la entidad: ${entityName}...`);

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

// 3. Controller
ensureDir(path.join(JAVA_SRC_DIR, "controller"));
const controllerFile = path.join(JAVA_SRC_DIR, "controller", `${entityName}Controller.java`);
const controllerContent = `package ${BASE_PACKAGE}.controller;

import ${BASE_PACKAGE}.model.${entityName};
import ${BASE_PACKAGE}.service.${entityName}Service;
import com.example.demo.Inertia;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.Map;

@Controller
@RequestMapping("/${entityPluralLower}")
public class ${entityName}Controller {

    private final ${entityName}Service ${entityNameLower}Service;

    @Autowired
    public ${entityName}Controller(${entityName}Service ${entityNameLower}Service) {
        this.${entityNameLower}Service = ${entityNameLower}Service;
    }

    @GetMapping
    public Object index() {
        return Inertia.render("${entityPlural}/Index", Map.of(
            "${entityPluralLower}", ${entityNameLower}Service.findAll()
        ));
    }

    @GetMapping("/create")
    public Object create() {
        return Inertia.render("${entityPlural}/Form", Map.of(
            "mode", "create",
            "routeBase", "${entityPluralLower}"
        ));
    }

    @PostMapping
    public String store(@ModelAttribute ${entityName} ${entityNameLower}) {
        ${entityNameLower}Service.save(${entityNameLower});
        return "redirect:/${entityPluralLower}";
    }

    @GetMapping("/{id}/edit")
    public Object edit(@PathVariable Long id) {
        return ${entityNameLower}Service.findById(id)
            .map(${entityNameLower} -> Inertia.render("${entityPlural}/Form", Map.of(
                "mode", "update",
                "routeBase", "${entityPluralLower}",
                "${entityNameLower}", ${entityNameLower}
            )))
            .orElseGet(() -> new ModelAndView("redirect:/${entityPluralLower}"));
    }

    @PutMapping("/{id}")
    public String update(@PathVariable Long id, @ModelAttribute ${entityName} updateData) {
        return ${entityNameLower}Service.findById(id).map(${entityNameLower} -> {
            ${entityNameLower}.setCampoEjemplo(updateData.getCampoEjemplo());
            ${entityNameLower}Service.save(${entityNameLower});
            return "redirect:/${entityPluralLower}";
        }).orElse("redirect:/${entityPluralLower}");
    }

    @DeleteMapping("/{id}")
    public String destroy(@PathVariable Long id) {
        ${entityNameLower}Service.deleteById(id);
        return "redirect:/${entityPluralLower}";
    }
}
`;
writeContent(controllerFile, controllerContent);

// 4. React Views
const reactDir = path.join(REACT_PAGES_DIR, entityPlural);
ensureDir(reactDir);

// Index.jsx
const indexFile = path.join(reactDir, "Index.jsx");
const indexContent = `import React from "react";
import ContainerLaravel from "@/Components/Generales/ContainerLaravel";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Link, router } from "@inertiajs/react";

const Index = (props) => {
    const { auth, errors, ${entityPluralLower} } = props;

    const handleDelete = (id) => {
        if (confirm("¿Estás seguro de eliminar este registro?")) {
            router.delete(\`/${entityPluralLower}/\${id}\`);
        }
    };

    return (
        <Authenticated auth={auth} errors={errors}>
            <div className="col-lg-12 d-flex justify-content-center">
                <div className="col-lg-12 col-lg-offset-1 mt-2">
                    <ContainerLaravel titulo={"Listado de ${entityPlural}"} icono={"fa-list"}>
                        
                        <div className="mb-3 text-end">
                            <Link
                                href={\`/${entityPluralLower}/create\`}
                                className="btn btn-success"
                            >
                                <i className="fa fa-plus me-2"></i> Crear ${entityName}
                            </Link>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Campo Ejemplo</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {${entityPluralLower}?.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.id}</td>
                                            <td>{item.campoEjemplo}</td>
                                            <td>
                                                <Link href={\`/${entityPluralLower}/\${item.id}/edit\`} className="btn btn-sm btn-primary me-2">
                                                    <i className="fa fa-edit"></i> Editar
                                                </Link>
                                                <button onClick={() => handleDelete(item.id)} className="btn btn-sm btn-danger">
                                                    <i className="fa fa-trash"></i> Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {!${entityPluralLower}?.length && <p className="text-center mt-3">No hay registros.</p>}
                        </div>
                    </ContainerLaravel>
                </div>
            </div>
        </Authenticated>
    );
};

export default Index;
`;
writeContent(indexFile, indexContent);

// Form.jsx
const formFile = path.join(reactDir, "Form.jsx");
const formContent = `import React from "react";
import { useForm, Link } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import ContainerLaravel from "@/Components/Generales/ContainerLaravel";

export default function Form(props) {
    const { auth, errors, mode, routeBase, ${entityNameLower} } = props;
    const isEdit = mode === "update";

    const { data, setData, post, put, processing, errors: formErrors } = useForm({
        campoEjemplo: isEdit && ${entityNameLower} ? ${entityNameLower}.campoEjemplo : "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEdit && ${entityNameLower}?.id) {
            put(\`/\${routeBase}/\${${entityNameLower}.id}\`);
        } else {
            post(\`/\${routeBase}\`);
        }
    };

    return (
        <Authenticated auth={auth} errors={errors}>
            <div className="col-lg-12 d-flex justify-content-center">
                <div className="col-lg-12 col-lg-offset-1 mt-2">
                    <ContainerLaravel
                        titulo={isEdit ? "Editar ${entityName}" : "Crear ${entityName}"}
                        icono={isEdit ? "fa-edit" : "fa-plus"}
                    >
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Campo Ejemplo</label>
                                <input
                                    type="text"
                                    className={\`form-control \${formErrors.campoEjemplo ? "is-invalid" : ""}\`}
                                    value={data.campoEjemplo}
                                    onChange={(e) => setData("campoEjemplo", e.target.value)}
                                />
                                {formErrors.campoEjemplo && <div className="invalid-feedback">{formErrors.campoEjemplo}</div>}
                            </div>
                            <div className="d-flex justify-content-between">
                                <Link href={\`/\${routeBase}\`} className="btn btn-secondary">
                                    Cancelar
                                </Link>
                                <button type="submit" disabled={processing} className="btn btn-primary">
                                    {isEdit ? "Actualizar" : "Guardar"}
                                </button>
                            </div>
                        </form>
                    </ContainerLaravel>
                </div>
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
        const match = file.match(/^V(\d+)__/);
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

console.log("\n✅ CRUD generation completed successfully.");
console.log("💡 Note: You will need to:");
console.log(`   1. Add your fields to ${entityName}.java`);
console.log("   2. Restart the Spring Boot app");
console.log(`   3. Add a link to /${entityPluralLower} in your frontend navigation.`);
