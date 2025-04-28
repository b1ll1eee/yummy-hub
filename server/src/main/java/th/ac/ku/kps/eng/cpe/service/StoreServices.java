package th.ac.ku.kps.eng.cpe.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import th.ac.ku.kps.eng.cpe.model.Store;
import th.ac.ku.kps.eng.cpe.model.User;
import th.ac.ku.kps.eng.cpe.repository.StoreRepository;

@Service
public class StoreServices {
	@Autowired
	private StoreRepository storerepository;
	
	public List<Store> findAll(){
		return (List<Store>) storerepository.findAll();
	}
	
	public Store findById(String id) {
		return storerepository.findById(id);
	}
	
	public List<Store> findByLocation(String district,String subdistrict,String province){
		return storerepository.findByLocation(district, subdistrict, province);
	}
	
	public Store save(Store store) {
		return storerepository.save(store);
	}
	
	public void deleteById(int id) {
		storerepository.deleteById(id);
	}
	
	public Store findByOwner(User user) {
		return storerepository.findByOwner(user);
	}
}
