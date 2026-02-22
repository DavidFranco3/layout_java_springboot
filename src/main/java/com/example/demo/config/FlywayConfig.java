package com.example.demo.config;

import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile("dev")
public class FlywayConfig {

    @Bean
    public FlywayMigrationStrategy repairMigrationStrategy() {
        return flyway -> {
            System.out.println("🛠️  Reparando historial de Flyway antes de migrar...");
            flyway.repair();
            flyway.migrate();
            System.out.println("✅ Flyway: Repair y Migrate completados.");
        };
    }
}
