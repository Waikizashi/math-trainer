package com.stuba.mathtrainerapi;

import com.stuba.mathtrainerapi.api.dto.RegisterRequest;
import com.stuba.mathtrainerapi.api.service.UserService;
import com.stuba.mathtrainerapi.entity.Theory;
import com.stuba.mathtrainerapi.repository.TheoryRepository;
import com.stuba.mathtrainerapi.repository.UserRepository;
import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.MapPropertySource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import javax.sql.DataSource;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.concurrent.TimeUnit;
import static org.junit.jupiter.api.Assertions.*;

/** Opt-in real PostgreSQL tests. Every test owns randomly named schemas/databases. */
class PersistenceIT {
    private static String url;
    private static String username;
    private static String password;
    private final List<String> schemas = new ArrayList<>();
    private final List<String> databases = new ArrayList<>();

    @BeforeAll static void requireIsolatedDatabase() {
        url = requireEnv("POSTGRES_TEST_URL");
        username = requireEnv("POSTGRES_TEST_USERNAME");
        password = requireEnv("POSTGRES_TEST_PASSWORD");
        assertTrue(url.startsWith("jdbc:postgresql://"), "Use the isolated PostgreSQL test database");
        URI target = URI.create(url.substring(5));
        assertTrue(Set.of("localhost", "127.0.0.1").contains(target.getHost()), "Tests require loopback PostgreSQL");
        assertEquals("/math_trainer_test", target.getPath(), "Refusing an unmarked database");
        assertNull(target.getQuery(), "Use an unmodified JDBC URL");
        assertNull(target.getUserInfo(), "Credentials belong in environment inputs");
        assertNull(target.getFragment());
    }

    @AfterEach void removeOnlyOwnedFixtures() {
        JdbcTemplate jdbc = new JdbcTemplate(dataSource(url));
        for (String schema : schemas) jdbc.execute("DROP SCHEMA IF EXISTS " + schema + " CASCADE");
        for (String database : databases) jdbc.execute("DROP DATABASE IF EXISTS " + database);
    }

    @Test void freshInstallAndApplicationRestartPreserveRegisteredAccountsAndContent() {
        String schema = newSchema();
        String jdbcUrl = inSchema(url, schema);
        long userId;
        long theoryId;
        try (ConfigurableApplicationContext app = start(jdbcUrl, schema, false)) {
            JdbcTemplate jdbc = jdbc(app);
            assertEquals(0, count(jdbc, "users"));
            assertEquals(0, count(jdbc, "theories"));
            assertEquals(0, count(jdbc, "app_seed_history"));
            assertEquals(2, count(jdbc, "flyway_schema_history"));
            RegisterRequest request = registration();
            userId = app.getBean(UserService.class).registerUser(request).getId();
            Theory theory = new Theory(); theory.setTitle("Persistent lesson");
            theoryId = app.getBean(TheoryRepository.class).save(theory).getId();
            assertFalse(app.getBean(UserRepository.class).findById(userId).orElseThrow().getPassword().equals(request.getPassword()));
            assertThrows(RuntimeException.class, () -> app.getBean(Flyway.class).clean());
        }
        try (ConfigurableApplicationContext app = start(jdbcUrl, schema, false)) {
            assertEquals("alice", app.getBean(UserRepository.class).findById(userId).orElseThrow().getUsername());
            assertEquals("Persistent lesson", app.getBean(TheoryRepository.class).findById(theoryId).orElseThrow().getTitle());
            assertEquals(1, count(jdbc(app), "users"));
            assertEquals(2, count(jdbc(app), "flyway_schema_history"));
        }
    }

    @Test void demoSeedRunsOnceKeepsIdentitySequencesAndRequiresExplicitProfile() {
        String schema = newSchema();
        String jdbcUrl = inSchema(url, schema);
        int theoryCount;
        int nodeCount;
        try (ConfigurableApplicationContext app = start(jdbcUrl, schema, true)) {
            assertEquals(1, count(jdbc(app), "users"));
            assertEquals(1, count(jdbc(app), "app_seed_history"));
            theoryCount = count(jdbc(app), "theories");
            nodeCount = count(jdbc(app), "graph_nodes");
            assertTrue(theoryCount > 0);
            assertTrue(nodeCount > 0);
            assertEquals("ADMIN", app.getBean(UserRepository.class).findByUsername("demo-admin").orElseThrow().getRole().name());
            long maxNode = jdbc(app).queryForObject("SELECT max(id) FROM graph_nodes", Long.class);
            long newNodeId = jdbc(app).queryForObject("INSERT INTO graph_nodes(node_id) VALUES ('new-node') RETURNING id", Long.class);
            assertTrue(newNodeId > maxNode);
        }
        try (ConfigurableApplicationContext app = start(jdbcUrl, schema, true)) {
            assertEquals(theoryCount, count(jdbc(app), "theories"));
            assertEquals(nodeCount + 1, count(jdbc(app), "graph_nodes"));
            assertEquals(1, count(jdbc(app), "users"));
        }
        assertThrows(RuntimeException.class, () -> start(jdbcUrl, schema, false));
        assertEquals(1, count(new JdbcTemplate(dataSource(jdbcUrl)), "users"));
    }

    @Test void demoCannotSeedAnExistingUserDatabase() {
        String schema = newSchema();
        String jdbcUrl = inSchema(url, schema);
        try (ConfigurableApplicationContext app = start(jdbcUrl, schema, false)) {
            app.getBean(UserService.class).registerUser(registration());
        }
        assertThrows(RuntimeException.class, () -> start(jdbcUrl, schema, true));
        JdbcTemplate jdbc = new JdbcTemplate(dataSource(jdbcUrl));
        assertEquals(1, count(jdbc, "users"));
        assertEquals(0, count(jdbc, "theories"));
        assertEquals(0, count(jdbc, "app_seed_history"));
    }

    @Test void existingUnmanagedSchemaIsRefusedUntilExplicitBaselineWithoutErasingRows() {
        String schema = newSchema();
        String jdbcUrl = inSchema(url, schema);
        DataSource ds = dataSource(jdbcUrl);
        new ResourceDatabasePopulator(new ClassPathResource("db/migration/V1__legacy_schema.sql")).execute(ds);
        JdbcTemplate jdbc = new JdbcTemplate(ds);
        jdbc.update("INSERT INTO users(username,password,email,role) VALUES ('legacy','retained-hash','legacy@example.com','USER')");
        assertThrows(RuntimeException.class, () -> start(jdbcUrl, schema, false));
        assertEquals(1, count(jdbc, "users"));
        // Explicit operator action, performed only on the randomly named test schema.
        Flyway.configure().dataSource(ds).schemas(schema).defaultSchema(schema)
                .baselineVersion("1").baselineOnMigrate(false).cleanDisabled(true).load().baseline();
        try (ConfigurableApplicationContext app = start(jdbcUrl, schema, false)) {
            assertEquals("retained-hash", app.getBean(UserRepository.class).findByUsername("legacy").orElseThrow().getPassword());
            assertEquals(0, count(jdbc(app), "app_seed_history"));
            assertEquals(2, count(jdbc(app), "flyway_schema_history"));
        }
    }

    @Test void changedMigrationChecksumFailsBeforeTouchingUserData() {
        String schema = newSchema();
        String jdbcUrl = inSchema(url, schema);
        try (ConfigurableApplicationContext app = start(jdbcUrl, schema, false)) {
            app.getBean(UserService.class).registerUser(registration());
        }
        JdbcTemplate jdbc = new JdbcTemplate(dataSource(jdbcUrl));
        jdbc.update("UPDATE flyway_schema_history SET checksum = 0 WHERE version = '1'");
        assertThrows(RuntimeException.class, () -> start(jdbcUrl, schema, false));
        assertEquals(1, count(jdbc, "users"));
    }

    @Test void postgresDumpRestoresAccountsContentAndMigrationHistoryToAnotherDatabase() throws Exception {
        String schema = newSchema();
        String jdbcUrl = inSchema(url, schema);
        try (ConfigurableApplicationContext app = start(jdbcUrl, schema, false)) {
            app.getBean(UserService.class).registerUser(registration());
            Theory theory = new Theory(); theory.setTitle("Backup lesson");
            app.getBean(TheoryRepository.class).save(theory);
        }
        String restoredDatabase = "math_trainer_restore_" + UUID.randomUUID().toString().replace("-", "");
        new JdbcTemplate(dataSource(url)).execute("CREATE DATABASE " + restoredDatabase);
        databases.add(restoredDatabase);
        Path directory = Files.createTempDirectory("math-trainer-backup-test-");
        Path dump = directory.resolve("fixture.dump");
        URI source = URI.create(url.substring(5));
        try {
            cli("pg_dump", source, "math_trainer_test", "--format=custom", "--no-owner", "--no-privileges",
                    "--schema=" + schema, "--file=" + dump);
            assertTrue(Files.size(dump) > 0);
            cli("pg_restore", source, restoredDatabase, "--no-owner", "--no-privileges", "--exit-on-error", dump.toString());
            String restoreUrl = "jdbc:postgresql://" + source.getHost() + ":" + port(source) + "/" + restoredDatabase;
            try (ConfigurableApplicationContext app = start(inSchema(restoreUrl, schema), schema, false)) {
                assertEquals("alice", app.getBean(UserRepository.class).findByUsername("alice").orElseThrow().getUsername());
                assertEquals("Backup lesson", app.getBean(TheoryRepository.class).findAll().get(0).getTitle());
                assertEquals(2, count(jdbc(app), "flyway_schema_history"));
                // Restored identity sequences must still accept the next generated key.
                RegisterRequest another = registration(); another.setUsername("bob"); another.setEmail("bob@example.com");
                assertTrue(app.getBean(UserService.class).registerUser(another).getId() > 1);
            }
        } finally {
            Files.deleteIfExists(dump); Files.deleteIfExists(directory);
        }
    }

    private String newSchema() {
        String schema = "mt_it_" + UUID.randomUUID().toString().replace("-", "");
        new JdbcTemplate(dataSource(url)).execute("CREATE SCHEMA " + schema);
        schemas.add(schema);
        return schema;
    }

    private ConfigurableApplicationContext start(String jdbcUrl, String schema, boolean demo) {
        Map<String, Object> properties = new HashMap<>();
        properties.put("spring.datasource.url", jdbcUrl);
        properties.put("spring.datasource.username", username);
        properties.put("spring.datasource.password", password);
        properties.put("spring.flyway.schemas", schema);
        properties.put("spring.flyway.default-schema", schema);
        properties.put("server.port", "0");
        properties.put("server.servlet.session.cookie.secure", "false");
        properties.put("spring.profiles.active", demo ? "demo" : "");
        properties.put("DEMO_ADMIN_PASSWORD", "isolated-demo-password");
        properties.put("spring.main.banner-mode", "off");
        return new SpringApplicationBuilder(MathTrainerApiApplication.class)
                .web(WebApplicationType.SERVLET)
                .initializers(context -> context.getEnvironment().getPropertySources()
                        .addFirst(new MapPropertySource("isolated-persistence-test", properties)))
                .run();
    }

    private static DriverManagerDataSource dataSource(String jdbcUrl) {
        return new DriverManagerDataSource(jdbcUrl, username, password);
    }
    private static String inSchema(String jdbcUrl, String schema) { return jdbcUrl + "?currentSchema=" + schema; }
    private static JdbcTemplate jdbc(ConfigurableApplicationContext app) { return new JdbcTemplate(app.getBean(DataSource.class)); }
    private static int count(JdbcTemplate jdbc, String table) { return jdbc.queryForObject("SELECT count(*) FROM " + table, Integer.class); }
    private static String requireEnv(String key) {
        String value = System.getenv(key);
        if (value == null || value.isBlank()) throw new IllegalStateException("Set " + key + " for the isolated postgres-it profile");
        return value;
    }
    private static RegisterRequest registration() {
        RegisterRequest request = new RegisterRequest(); request.setUsername("alice"); request.setEmail("alice@example.com");
        request.setPassword("isolated-account-password"); return request;
    }
    private static int port(URI uri) { return uri.getPort() < 0 ? 5432 : uri.getPort(); }
    private static void cli(String executable, URI source, String database, String... extra) throws Exception {
        List<String> command = new ArrayList<>(List.of(executable, "--host=" + source.getHost(),
                "--port=" + port(source), "--username=" + username, "--dbname=" + database));
        command.addAll(List.of(extra));
        ProcessBuilder builder = new ProcessBuilder(command).redirectErrorStream(true);
        builder.environment().put("PGPASSWORD", password);
        Path log = Files.createTempFile("postgres-command-", ".log");
        builder.redirectOutput(log.toFile());
        Process process = builder.start();
        try {
            boolean complete = process.waitFor(45, TimeUnit.SECONDS);
            if (!complete) process.destroyForcibly();
            assertTrue(complete, executable + " timed out");
            assertEquals(0, process.exitValue(), () -> {
                try { return executable + " failed: " + Files.readString(log); }
                catch (Exception error) { return executable + " failed"; }
            });
        } finally { Files.deleteIfExists(log); }
    }
}
