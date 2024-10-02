package net.atos.WorkspaceService.config;

import net.atos.WorkspaceService.repository.MyMongoRepositoryImpl;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@EnableMongoRepositories(basePackages = "net.atos.WorkspaceService.repository",
        repositoryBaseClass = MyMongoRepositoryImpl.class)
public class FileRepositoryConfig {
}
