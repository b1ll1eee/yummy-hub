package th.ac.ku.kps.eng.cpe.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import th.ac.ku.kps.eng.cpe.model.Store;
import th.ac.ku.kps.eng.cpe.model.User;

@Repository
public interface StoreRepository extends CrudRepository<Store, Integer> {
	@Query("from Store as s where s.user = :user")
	public Store findByOwner(@Param("user")User user);
	
	@Query("from Store as s where s.storeId = :storeId")
	public Store findById(@Param("storeId")String id);
	
	@Query("from Store as s where s.districts.nameInThai = :district and s.provinces.nameInThai = :province and s.subdistricts.nameInThai = :subdistrict")
	public List<Store> findByLocation(@Param("district") String district, @Param("subdistrict") String subdistrict, @Param("province") String province);
}
