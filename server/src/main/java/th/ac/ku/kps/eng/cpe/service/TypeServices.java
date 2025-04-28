package th.ac.ku.kps.eng.cpe.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import th.ac.ku.kps.eng.cpe.model.Type;
import th.ac.ku.kps.eng.cpe.repository.TypeRepository;

@Service
public class TypeServices {
	@Autowired
	private TypeRepository typerepository;
	
	public List<Type> findAll(){
		return (List<Type>) typerepository.findAll();
	}
	
	public Type findById(int id) {
		return typerepository.findById(id).orElse(null);
	}
	
	public Type save(Type type) {
		return typerepository.save(type);
	}
	
	public void deleteById(int id) {
		typerepository.deleteById(id);
	}
}
