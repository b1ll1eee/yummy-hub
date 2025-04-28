package th.ac.ku.kps.eng.cpe.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import th.ac.ku.kps.eng.cpe.model.Type;

@Repository
public interface TypeRepository extends CrudRepository<Type, Integer> {

}
