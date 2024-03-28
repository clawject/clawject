import { Column, DataSource, Entity, PrimaryGeneratedColumn, Repository } from 'typeorm';
import { Bean, External, ClawjectApplication, Configuration, Import, PostConstruct } from '@clawject/di';

enum UserGroup {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
class User {
  @PrimaryGeneratedColumn()
    id: number;

  @Column()
    firstName: string;

  @Column()
    lastName: string;

  @Column()
    email: string;

  @Column()
    group: UserGroup;
}

@Configuration
@External
class DatabaseConfiguration {
  @Bean dataSource = (): Promise<DataSource> => {
    const dataSource = new DataSource({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
    });

    return dataSource.initialize();
  };

  @Bean userRepository = (dataSource: DataSource) => dataSource.getRepository(User);
}

@ClawjectApplication
class Application {
  databaseConfiguration = Import(DatabaseConfiguration);

  @PostConstruct
  init(
    userRepository: Repository<User>
  ) {

  }
}
