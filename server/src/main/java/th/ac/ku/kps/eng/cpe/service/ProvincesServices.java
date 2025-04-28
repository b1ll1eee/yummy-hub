package th.ac.ku.kps.eng.cpe.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import th.ac.ku.kps.eng.cpe.model.Provinces;
import th.ac.ku.kps.eng.cpe.repository.ProvincesRepository;

@Service
public class ProvincesServices {
	@Autowired
	private ProvincesRepository provincesrepository;
	
	public List<Provinces> findAll(){
		return (List<Provinces>) provincesrepository.findAll();
	}
	
	public Provinces findById(int id) {
		return provincesrepository.findById(id).orElse(null);
	}
	
	public Provinces save(Provinces provinces) {
		return provincesrepository.save(provinces);
	}
	
	public void deleteById(int id) {
		provincesrepository.deleteById(id);
	}
}
