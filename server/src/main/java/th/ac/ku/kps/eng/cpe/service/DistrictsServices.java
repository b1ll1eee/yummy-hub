package th.ac.ku.kps.eng.cpe.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import th.ac.ku.kps.eng.cpe.model.Districts;
import th.ac.ku.kps.eng.cpe.repository.DistrictsRepository;

@Service
public class DistrictsServices {
	@Autowired
	private DistrictsRepository districtsrepository;
	
	public List<Districts> findAll(){
		return (List<Districts>) districtsrepository.findAll();
	}
	
	public Districts findById(int id) {
		return districtsrepository.findById(id).orElse(null);
	}
	
	public Districts save(Districts districts) {
		return districtsrepository.save(districts);
	}
	
	public void deleteById(int id) {
		districtsrepository.deleteById(id);
	}
	public List<Districts> findByProvinceId(int id){
		return districtsrepository.findByProvinceId(id);
	}
}
