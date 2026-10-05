package com.stuba.mathtrainerapi.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;
import javax.sql.DataSource;
import java.nio.charset.StandardCharsets;

@Configuration
public class DemoDataConfiguration {
    private static final String SEED = "legacy-demo-v1";
    private static final String[] DOMAIN_TABLES = {
            "users", "theories", "theory_content", "graph_data", "graph_nodes", "graph_links",
            "practices", "practice_content", "possible_vertex_counts", "possible_edge_counts",
            "graph_properties", "theory_completions", "practice_completions"
    };

    @Bean
    @Profile("demo")
    ApplicationRunner demoSeed(DataSource dataSource, PlatformTransactionManager transactionManager,
                               PasswordEncoder encoder, @Value("${DEMO_ADMIN_PASSWORD}") String password) {
        // The caller supplies demo credentials; no fixed accounts are embedded in the artifact.
        if (password.length() < 8 || password.getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new IllegalStateException("DEMO_ADMIN_PASSWORD must have at least 8 characters and at most 72 UTF-8 bytes");
        }
        return arguments -> new TransactionTemplate(transactionManager).executeWithoutResult(status -> {
            JdbcTemplate jdbc = new JdbcTemplate(dataSource);
            // Serialize first-run seeding across simultaneous application starts.
            jdbc.execute("SELECT pg_advisory_xact_lock(48131220261005)");
            if (Boolean.TRUE.equals(jdbc.queryForObject(
                    "SELECT EXISTS(SELECT 1 FROM app_seed_history WHERE name = ?)", Boolean.class, SEED))) return;
            for (String table : DOMAIN_TABLES) {
                if (Boolean.TRUE.equals(jdbc.queryForObject("SELECT EXISTS(SELECT 1 FROM " + table + ")", Boolean.class))) {
                    throw new IllegalStateException("Demo seed requires an empty, dedicated database");
                }
            }
            jdbc.update("INSERT INTO users(username, password, email, role) VALUES (?, ?, ?, ?)",
                    "demo-admin", encoder.encode(password), "demo-admin@example.invalid", "ADMIN");
            ResourceDatabasePopulator populator = new ResourceDatabasePopulator(new ClassPathResource("demo/legacy-content.sql"));
            populator.setSqlScriptEncoding("UTF-8");
            populator.execute(dataSource);
            jdbc.update("INSERT INTO app_seed_history(name) VALUES (?)", SEED);
        });
    }

    @Bean
    @Profile("!demo")
    ApplicationRunner rejectDemoDatabase(DataSource dataSource) {
        return arguments -> {
            Boolean hasDemo = new JdbcTemplate(dataSource).queryForObject(
                    "SELECT EXISTS(SELECT 1 FROM app_seed_history WHERE name = ?)", Boolean.class, SEED);
            if (Boolean.TRUE.equals(hasDemo)) {
                throw new IllegalStateException("A demo database requires the demo profile; do not promote demo data to production");
            }
        };
    }
}
