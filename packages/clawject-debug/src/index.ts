@Configuration
class PetsConfiguration {
  catRepository = Bean(Repository<Cat>);
  dogRepository = Bean(Repository<Dog>);
  foxRepository = Bean(Repository<Fox>);

  catService = Bean(Service<Cat>);
  dogService = Bean(Service<Dog>);
  foxService = Bean(Service<Fox>);

  @External petService = Bean(PetService);
}
