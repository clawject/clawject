import { Bean, ClawjectApplication } from '@clawject/di';

class Cat {}

interface ReadOnlyRepository<T> { /*...*/ }

interface Repository<T> extends ReadOnlyRepository<T> { /*...*/ }

class HttpRepository<T> implements Repository<T> { /*...*/ }

class ReadCatsService {
  constructor(
    private repository: ReadOnlyRepository<Cat>
  ) {}
}

class WriteCatsService {
  constructor(
    private repository: Repository<Cat>
  ) {}
}

@ClawjectApplication
class Application {
  httpCatsRepository = Bean(HttpRepository<Cat>);

  readCatsService = Bean(ReadCatsService);
  writeCatsService = Bean(WriteCatsService);
}
