package com.example.demo.generator;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Scanner;

public class CrudGenerator {

    private static final String BASE_PACKAGE = "com.example.demo";
    private static final String JAVA_SRC_DIR = "src/main/java/" + BASE_PACKAGE.replace('.', '/');
    private static final String REACT_PAGES_DIR = "src/main/resources/js/Pages";

    public static void runGenerator(String[] args) {
        String entityName;

        if (args.length > 0) {
            entityName = args[0];
        } else {
            try (Scanner scanner = new Scanner(System.in)) {
                System.out.print("Enter Entity Name (e.g., Cliente, Producto): ");
                entityName = scanner.nextLine().trim();
            }
        }

        if (entityName.isEmpty()) {
            System.err.println("Entity name cannot be empty.");
            return;
        }

        // Ensure Capitalized first letter
        entityName = entityName.substring(0, 1).toUpperCase() + entityName.substring(1);
        String entityNameLower = entityName.substring(0, 1).toLowerCase() + entityName.substring(1);
        String entityPlural = entityName + "s"; // Simple pluralization
        String entityPluralLower = entityNameLower + "s"; // Simple pluralization

        System.out.println("Generating CRUD for: " + entityName);

        try {
            generateModel(entityName);
            generateRepository(entityName);
            generateService(entityName);
            generateController(entityName, entityNameLower, entityPlural, entityPluralLower);
            generateReactViews(entityName, entityNameLower, entityPlural, entityPluralLower);
            generateMigration(entityName, entityPluralLower);

            System.out.println("\n✅ CRUD generation completed successfully.");
            System.out.println("💡 Note: You will need to:");
            System.out.println("   1. Add your fields to " + entityName + ".java");
            System.out.println("   2. Restart the Spring Boot app");
            System.out.println("   3. Add a link to /" + entityPluralLower + " in your frontend navigation.");

        } catch (IOException e) {
            System.err.println("❌ Error generating CRUD: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private static void generateModel(String entityName) throws IOException {
        String dir = JAVA_SRC_DIR + "/model";
        createDirIfNotExists(dir);
        File file = new File(dir, entityName + ".java");

        if (file.exists()) {
            System.out.println("⚠️ Model " + entityName + " already exists. Skipping.");
            return;
        }

        String content = "package " + BASE_PACKAGE + ".model;\n\n" +
                "import jakarta.persistence.*;\n\n" +
                "@Entity\n" +
                "@Table(name = \"" + entityName.toLowerCase() + "s\")\n" +
                "public class " + entityName + " {\n\n" +
                "    @Id\n" +
                "    @GeneratedValue(strategy = GenerationType.IDENTITY)\n" +
                "    private Long id;\n\n" +
                "    @Column(nullable = false)\n" +
                "    private String campoEjemplo;\n\n" +
                "    // Getters and Setters\n" +
                "    public Long getId() { return id; }\n" +
                "    public void setId(Long id) { this.id = id; }\n" +
                "    public String getCampoEjemplo() { return campoEjemplo; }\n" +
                "    public void setCampoEjemplo(String campoEjemplo) { this.campoEjemplo = campoEjemplo; }\n" +
                "}\n";

        writeToFile(file, content);
        System.out.println("✅ Created Model: " + file.getPath());
    }

    private static void generateRepository(String entityName) throws IOException {
        String dir = JAVA_SRC_DIR + "/repository";
        createDirIfNotExists(dir);
        File file = new File(dir, entityName + "Repository.java");

        if (file.exists()) {
            System.out.println("⚠️ Repository " + file.getName() + " already exists. Skipping.");
            return;
        }

        String content = "package " + BASE_PACKAGE + ".repository;\n\n" +
                "import " + BASE_PACKAGE + ".model." + entityName + ";\n" +
                "import org.springframework.data.jpa.repository.JpaRepository;\n" +
                "import org.springframework.stereotype.Repository;\n\n" +
                "@Repository\n" +
                "public interface " + entityName + "Repository extends JpaRepository<" + entityName + ", Long> {\n" +
                "}\n";

        writeToFile(file, content);
        System.out.println("✅ Created Repository: " + file.getPath());
    }

    private static void generateService(String entityName) throws IOException {
        String dir = JAVA_SRC_DIR + "/service";
        createDirIfNotExists(dir);
        File file = new File(dir, entityName + "Service.java");

        if (file.exists()) {
            System.out.println("⚠️ Service " + file.getName() + " already exists. Skipping.");
            return;
        }

        String entityNameLower = entityName.substring(0, 1).toLowerCase() + entityName.substring(1);

        String content = "package " + BASE_PACKAGE + ".service;\n\n" +
                "import " + BASE_PACKAGE + ".model." + entityName + ";\n" +
                "import " + BASE_PACKAGE + ".repository." + entityName + "Repository;\n" +
                "import org.springframework.beans.factory.annotation.Autowired;\n" +
                "import org.springframework.stereotype.Service;\n\n" +
                "import java.util.List;\n" +
                "import java.util.Optional;\n\n" +
                "@Service\n" +
                "public class " + entityName + "Service {\n\n" +
                "    private final " + entityName + "Repository " + entityNameLower + "Repository;\n\n" +
                "    @Autowired\n" +
                "    public " + entityName + "Service(" + entityName + "Repository " + entityNameLower
                + "Repository) {\n" +
                "        this." + entityNameLower + "Repository = " + entityNameLower + "Repository;\n" +
                "    }\n\n" +
                "    public List<" + entityName + "> findAll() {\n" +
                "        return " + entityNameLower + "Repository.findAll();\n" +
                "    }\n\n" +
                "    public Optional<" + entityName + "> findById(Long id) {\n" +
                "        return " + entityNameLower + "Repository.findById(id);\n" +
                "    }\n\n" +
                "    public " + entityName + " save(" + entityName + " " + entityNameLower + ") {\n" +
                "        return " + entityNameLower + "Repository.save(" + entityNameLower + ");\n" +
                "    }\n\n" +
                "    public void deleteById(Long id) {\n" +
                "        " + entityNameLower + "Repository.deleteById(id);\n" +
                "    }\n" +
                "}\n";

        writeToFile(file, content);
        System.out.println("✅ Created Service: " + file.getPath());
    }

    private static void generateController(String entityName, String entityNameLower, String entityPlural,
            String entityPluralLower) throws IOException {
        String dir = JAVA_SRC_DIR + "/controller";
        createDirIfNotExists(dir);
        File file = new File(dir, entityName + "Controller.java");

        if (file.exists()) {
            System.out.println("⚠️ Controller " + file.getName() + " already exists. Skipping.");
            return;
        }

        String content = "package " + BASE_PACKAGE + ".controller;\n\n" +
                "import " + BASE_PACKAGE + ".model." + entityName + ";\n" +
                "import " + BASE_PACKAGE + ".service." + entityName + "Service;\n" +
                "import com.example.demo.Inertia;\n" +
                "import org.springframework.beans.factory.annotation.Autowired;\n" +
                "import org.springframework.stereotype.Controller;\n" +
                "import org.springframework.web.bind.annotation.*;\n" +
                "import org.springframework.web.servlet.ModelAndView;\n\n" +
                "import java.util.Map;\n\n" +
                "@Controller\n" +
                "@RequestMapping(\"/" + entityPluralLower + "\")\n" +
                "public class " + entityName + "Controller {\n\n" +
                "    private final " + entityName + "Service " + entityNameLower + "Service;\n\n" +
                "    @Autowired\n" +
                "    public " + entityName + "Controller(" + entityName + "Service " + entityNameLower + "Service) {\n"
                +
                "        this." + entityNameLower + "Service = " + entityNameLower + "Service;\n" +
                "    }\n\n" +
                "    @GetMapping\n" +
                "    public ModelAndView index() {\n" +
                "        return Inertia.render(\"" + entityPlural + "/Index\", Map.of(\n" +
                "            \"" + entityPluralLower + "\", " + entityNameLower + "Service.findAll()\n" +
                "        ));\n" +
                "    }\n\n" +
                "    @GetMapping(\"/create\")\n" +
                "    public ModelAndView create() {\n" +
                "        return Inertia.render(\"" + entityPlural + "/Form\", Map.of(\n" +
                "            \"mode\", \"create\",\n" +
                "            \"routeBase\", \"" + entityPluralLower + "\"\n" +
                "        ));\n" +
                "    }\n\n" +
                "    @PostMapping\n" +
                "    public String store(@ModelAttribute " + entityName + " " + entityNameLower + ") {\n" +
                "        " + entityNameLower + "Service.save(" + entityNameLower + ");\n" +
                "        return \"redirect:/" + entityPluralLower + "\";\n" +
                "    }\n\n" +
                "    @GetMapping(\"/{id}/edit\")\n" +
                "    public ModelAndView edit(@PathVariable Long id) {\n" +
                "        return " + entityNameLower + "Service.findById(id)\n" +
                "            .map(" + entityNameLower + " -> Inertia.render(\"" + entityPlural + "/Form\", Map.of(\n" +
                "                \"mode\", \"update\",\n" +
                "                \"routeBase\", \"" + entityPluralLower + "\",\n" +
                "                \"" + entityNameLower + "\", " + entityNameLower + "\n" +
                "            )))\n" +
                "            .orElseGet(() -> new ModelAndView(\"redirect:/" + entityPluralLower + "\"));\n" +
                "    }\n\n" +
                "    @PutMapping(\"/{id}\")\n" +
                "    public String update(@PathVariable Long id, @ModelAttribute " + entityName + " updateData) {\n" +
                "        return " + entityNameLower + "Service.findById(id).map(" + entityNameLower + " -> {\n" +
                "            " + entityNameLower + ".setCampoEjemplo(updateData.getCampoEjemplo());\n" +
                "            " + entityNameLower + "Service.save(" + entityNameLower + ");\n" +
                "            return \"redirect:/" + entityPluralLower + "\";\n" +
                "        }).orElse(\"redirect:/" + entityPluralLower + "\");\n" +
                "    }\n\n" +
                "    @DeleteMapping(\"/{id}\")\n" +
                "    public String destroy(@PathVariable Long id) {\n" +
                "        " + entityNameLower + "Service.deleteById(id);\n" +
                "        return \"redirect:/" + entityPluralLower + "\";\n" +
                "    }\n" +
                "}\n";

        writeToFile(file, content);
        System.out.println("✅ Created Controller: " + file.getPath());
    }

    private static void generateReactViews(String entityName, String entityNameLower, String entityPlural,
            String entityPluralLower) throws IOException {
        String dir = REACT_PAGES_DIR + "/" + entityPlural;
        createDirIfNotExists(dir);

        // Define Index.jsx
        File indexFile = new File(dir, "Index.jsx");
        if (!indexFile.exists()) {
            String indexContent = "import React from \"react\";\n" +
                    "import ContainerLaravel from \"@/Components/Generales/ContainerLaravel\";\n" +
                    "import Authenticated from \"@/Layouts/AuthenticatedLayout\";\n" +
                    "import { Link, router } from \"@inertiajs/react\";\n\n" +
                    "const Index = (props) => {\n" +
                    "    const { auth, errors, " + entityPluralLower + " } = props;\n\n" +
                    "    const handleDelete = (id) => {\n" +
                    "        if (confirm(\"¿Estás seguro de eliminar este registro?\")) {\n" +
                    "            router.delete(`/" + entityPluralLower + "/${id}`);\n" +
                    "        }\n" +
                    "    };\n\n" +
                    "    return (\n" +
                    "        <Authenticated auth={auth} errors={errors}>\n" +
                    "            <div className=\"col-lg-12 d-flex justify-content-center\">\n" +
                    "                <div className=\"col-lg-12 col-lg-offset-1 mt-2\">\n" +
                    "                    <ContainerLaravel titulo={\"Listado de " + entityPlural
                    + "\"} icono={\"fa-list\"}>\n" +
                    "                        \n" +
                    "                        {/* Botón para crear */}\n" +
                    "                        <div className=\"mb-3 text-end\">\n" +
                    "                            <Link\n" +
                    "                                href={`/" + entityPluralLower + "/create`}\n" +
                    "                                className=\"btn btn-success\"\n" +
                    "                            >\n" +
                    "                                <i className=\"fa fa-plus me-2\"></i> Crear " + entityName + "\n" +
                    "                            </Link>\n" +
                    "                        </div>\n\n" +
                    "                        <div className=\"table-responsive\">\n" +
                    "                            <table className=\"table table-striped\">\n" +
                    "                                <thead>\n" +
                    "                                    <tr>\n" +
                    "                                        <th>ID</th>\n" +
                    "                                        <th>Campo Ejemplo</th>\n" +
                    "                                        <th>Acciones</th>\n" +
                    "                                    </tr>\n" +
                    "                                </thead>\n" +
                    "                                <tbody>\n" +
                    "                                    {" + entityPluralLower + "?.map((item) => (\n" +
                    "                                        <tr key={item.id}>\n" +
                    "                                            <td>{item.id}</td>\n" +
                    "                                            <td>{item.campoEjemplo}</td>\n" +
                    "                                            <td>\n" +
                    "                                                <Link href={`/" + entityPluralLower
                    + "/${item.id}/edit`} className=\"btn btn-sm btn-primary me-2\">\n" +
                    "                                                    <i className=\"fa fa-edit\"></i> Editar\n" +
                    "                                                </Link>\n" +
                    "                                                <button onClick={() => handleDelete(item.id)} className=\"btn btn-sm btn-danger\">\n"
                    +
                    "                                                    <i className=\"fa fa-trash\"></i> Eliminar\n" +
                    "                                                </button>\n" +
                    "                                            </td>\n" +
                    "                                        </tr>\n" +
                    "                                    ))}\n" +
                    "                                </tbody>\n" +
                    "                            </table>\n" +
                    "                            {!" + entityPluralLower
                    + "?.length && <p className=\"text-center mt-3\">No hay registros.</p>}\n" +
                    "                        </div>\n" +
                    "                    </ContainerLaravel>\n" +
                    "                </div>\n" +
                    "            </div>\n" +
                    "        </Authenticated>\n" +
                    "    );\n" +
                    "};\n\n" +
                    "export default Index;\n";
            writeToFile(indexFile, indexContent);
            System.out.println("✅ Created React View: " + indexFile.getPath());
        } else {
            System.out.println("⚠️ React View " + indexFile.getName() + " already exists. Skipping.");
        }

        // Define Form.jsx
        File formFile = new File(dir, "Form.jsx");
        if (!formFile.exists()) {
            String formContent = "import React from \"react\";\n" +
                    "import { useForm, Link } from \"@inertiajs/react\";\n" +
                    "import Authenticated from \"@/Layouts/AuthenticatedLayout\";\n" +
                    "import ContainerLaravel from \"@/Components/Generales/ContainerLaravel\";\n\n" +
                    "export default function Form(props) {\n" +
                    "    const { auth, errors, mode, routeBase, " + entityNameLower + " } = props;\n" +
                    "    const isEdit = mode === \"update\";\n\n" +
                    "    const { data, setData, post, put, processing, errors: formErrors } = useForm({\n" +
                    "        campoEjemplo: isEdit && " + entityNameLower + " ? " + entityNameLower
                    + ".campoEjemplo : \"\",\n" +
                    "    });\n\n" +
                    "    const handleSubmit = (e) => {\n" +
                    "        e.preventDefault();\n\n" +
                    "        if (isEdit && " + entityNameLower + "?.id) {\n" +
                    "            put(`/${routeBase}/${" + entityNameLower + ".id}`);\n" +
                    "        } else {\n" +
                    "            post(`/${routeBase}`);\n" +
                    "        }\n" +
                    "    };\n\n" +
                    "    return (\n" +
                    "        <Authenticated auth={auth} errors={errors}>\n" +
                    "            <div className=\"col-lg-12 d-flex justify-content-center\">\n" +
                    "                <div className=\"col-lg-12 col-lg-offset-1 mt-2\">\n" +
                    "                    <ContainerLaravel\n" +
                    "                        titulo={isEdit ? \"Editar " + entityName + "\" : \"Crear " + entityName
                    + "\"}\n" +
                    "                        icono={isEdit ? \"fa-edit\" : \"fa-plus\"}\n" +
                    "                    >\n" +
                    "                        <form onSubmit={handleSubmit}>\n" +
                    "                            <div className=\"mb-3\">\n" +
                    "                                <label className=\"form-label\">Campo Ejemplo</label>\n" +
                    "                                <input\n" +
                    "                                    type=\"text\"\n" +
                    "                                    className={`form-control ${formErrors.campoEjemplo ? \"is-invalid\" : \"\"}`}\n"
                    +
                    "                                    value={data.campoEjemplo}\n" +
                    "                                    onChange={(e) => setData(\"campoEjemplo\", e.target.value)}\n"
                    +
                    "                                />\n" +
                    "                                {formErrors.campoEjemplo && <div className=\"invalid-feedback\">{formErrors.campoEjemplo}</div>}\n"
                    +
                    "                            </div>\n" +
                    "                            <div className=\"d-flex justify-content-between\">\n" +
                    "                                <Link href={`/${routeBase}`} className=\"btn btn-secondary\">\n" +
                    "                                    Cancelar\n" +
                    "                                </Link>\n" +
                    "                                <button type=\"submit\" disabled={processing} className=\"btn btn-primary\">\n"
                    +
                    "                                    {isEdit ? \"Actualizar\" : \"Guardar\"}\n" +
                    "                                </button>\n" +
                    "                            </div>\n" +
                    "                        </form>\n" +
                    "                    </ContainerLaravel>\n" +
                    "                </div>\n" +
                    "            </div>\n" +
                    "        </Authenticated>\n" +
                    "    );\n" +
                    "}\n";
            writeToFile(formFile, formContent);
            System.out.println("✅ Created React View: " + formFile.getPath());
        } else {
            System.out.println("⚠️ React View " + formFile.getName() + " already exists. Skipping.");
        }
    }

    private static void generateMigration(String entityName, String entityPluralLower) throws IOException {
        String dir = "src/main/resources/db/migration";
        createDirIfNotExists(dir);

        File migrationDir = new File(dir);
        File[] files = migrationDir.listFiles((d, name) -> name.startsWith("V") && name.endsWith(".sql"));

        int nextVersion = 1;
        if (files != null && files.length > 0) {
            int maxVersion = 0;
            for (File file : files) {
                String name = file.getName();
                try {
                    int underscoreIndex = name.indexOf("__");
                    if (underscoreIndex > 1) {
                        int version = Integer.parseInt(name.substring(1, underscoreIndex));
                        if (version > maxVersion) {
                            maxVersion = version;
                        }
                    }
                } catch (NumberFormatException | IndexOutOfBoundsException e) {
                    // Ignore files that don't follow the pattern
                }
            }
            nextVersion = maxVersion + 1;
        }

        String fileName = String.format("V%d__create_%s_table.sql", nextVersion, entityPluralLower);
        File file = new File(dir, fileName);

        if (file.exists()) {
            System.out.println("⚠️ Migration " + fileName + " already exists. Skipping.");
            return;
        }

        String content = "CREATE TABLE IF NOT EXISTS " + entityPluralLower + " (\n" +
                "    id BIGINT AUTO_INCREMENT PRIMARY KEY,\n" +
                "    campo_ejemplo VARCHAR(255) NOT NULL,\n" +
                "    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n" +
                "    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP\n" +
                ");\n";

        writeToFile(file, content);
        System.out.println("✅ Created Migration: " + file.getPath());
    }

    private static void createDirIfNotExists(String dirPath) throws IOException {
        Path path = Paths.get(dirPath);
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }
    }

    private static void writeToFile(File file, String content) throws IOException {
        try (FileWriter writer = new FileWriter(file)) {
            writer.write(content);
        }
    }
}
