package th.ac.ku.kps.eng.cpe.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import th.ac.ku.kps.eng.cpe.model.Product;
import th.ac.ku.kps.eng.cpe.model.Store;
import th.ac.ku.kps.eng.cpe.model.User;

@Repository
public interface ProductRepository extends CrudRepository<Product, Integer> {
	@Query("from Product as p where p.productId = :productId")
	public Product findById(@Param("productId") String id);
	
	@Query("from Product as p where p.type.typeId = :typeId and p.quantityAvailable>0")
	public List<Product> findByTypeId(@Param("typeId") int id);
	
	@Query("from Product as p where p.store = :store")
	public List<Product> findByStore(@Param("store") Store store);
	
	@Query("from Product as p where p.type.typeId = :typeId and p.store = :store and p.quantityAvailable>0")
	public List<Product> findByStoreAndType(@Param("store") Store store, @Param("typeId") int id);
	
	@Query("from Product as p where p.store.storeId = :storeId and p.quantityAvailable>0")
	public List<Product> findByStoreId(@Param("storeId") String storeId);
	
	@Query("from Product as p where p.store.user = :user")
	public List<Product> findByUser(@Param("user")User user);
	
	
}
