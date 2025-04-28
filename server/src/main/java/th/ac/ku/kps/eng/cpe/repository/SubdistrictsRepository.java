package th.ac.ku.kps.eng.cpe.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import th.ac.ku.kps.eng.cpe.model.Subdistricts;

@Repository
public interface SubdistrictsRepository extends CrudRepository<Subdistricts, Integer> {
	@Query("from Subdistricts as s inner join s.districts as d where s.districts.id = :districtId and d.provinces.id = :provinceId")
	public List<Subdistricts> findByDistrictIdAndProvinceId(@Param("districtId") int districtsId, @Param("provinceId") int provincesId);
}
