package th.ac.ku.kps.eng.cpe.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import th.ac.ku.kps.eng.cpe.model.Favourite;
import th.ac.ku.kps.eng.cpe.model.User;

@Repository
public interface FavouriteRepository extends CrudRepository<Favourite, Integer> {
	@Query("from Favourite as f where f.favouriteId = :favouriteId")
	public Favourite findById(@Param("favouriteId") String favouriteId);
	
	@Query("from Favourite as f where f.store.storeId = :id and f.user = :user")
	public Favourite findByIdStoreAndUser(@Param("id")String id,@Param("user") User user);
	
	@Query("from Favourite as f where f.user = :user")
	public List<Favourite> findByUser(@Param("user") User user);
}
