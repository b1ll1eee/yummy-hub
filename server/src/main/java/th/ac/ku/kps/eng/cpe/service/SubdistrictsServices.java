package th.ac.ku.kps.eng.cpe.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import th.ac.ku.kps.eng.cpe.model.Subdistricts;
import th.ac.ku.kps.eng.cpe.repository.SubdistrictsRepository;

@Service
public class SubdistrictsServices {
	@Autowired
	private SubdistrictsRepository subdistrictsrepository;
	
	public List<Subdistricts> findAll(){
		return (List<Subdistricts>) subdistrictsrepository.findAll();
	}
	
	public Subdistricts findById(int id) {
		return subdistrictsrepository.findById(id).orElse(null);
	}
	
	public Subdistricts save(Subdistricts subdistricts) {
		return subdistrictsrepository.save(subdistricts);
	}
	
	public void deleteById(int id) {
		subdistrictsrepository.deleteById(id);
	}
	
	public List<Subdistricts> findByAndDistrictsId(int districtId,int provinceId){
		return subdistrictsrepository.findByDistrictIdAndProvinceId(districtId, provinceId);
	}
}
