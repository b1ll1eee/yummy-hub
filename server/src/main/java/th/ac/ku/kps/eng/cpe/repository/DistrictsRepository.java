package th.ac.ku.kps.eng.cpe.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import th.ac.ku.kps.eng.cpe.model.Districts;

@Repository
public interface DistrictsRepository extends CrudRepository<Districts, Integer> {

	@Query("from Districts as d where d.provinces.id = :provinceId")
	public List<Districts> findByProvinceId(@Param("provinceId") int provinceId);
}
