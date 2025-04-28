package th.ac.ku.kps.eng.cpe.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import th.ac.ku.kps.eng.cpe.model.User;

@Repository
public interface UserRepository extends CrudRepository<User, Integer> {
	@Query("from User as u where u.userId=:userId")
	public User findByUserId(@Param("userId") String userId);
}
