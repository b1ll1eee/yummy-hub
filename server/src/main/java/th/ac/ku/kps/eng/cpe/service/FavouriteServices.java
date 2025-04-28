package th.ac.ku.kps.eng.cpe.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import th.ac.ku.kps.eng.cpe.model.Favourite;
import th.ac.ku.kps.eng.cpe.model.User;
import th.ac.ku.kps.eng.cpe.repository.FavouriteRepository;

@Service
public class FavouriteServices {
	@Autowired
	private FavouriteRepository favouriterepository;
	
	public List<Favourite> findAll(){
		return (List<Favourite>) favouriterepository.findAll();
	}
	
	public List<Favourite> findByUser(User user){
		return (List<Favourite>) favouriterepository.findByUser(user);
	}

	public Favourite findById(String id) {
		return favouriterepository.findById(id);
	}
	
	public Favourite findByIdStoreAndUser(String id,User user) {
		return favouriterepository.findByIdStoreAndUser(id, user);
	}
	
	public Favourite save(Favourite favourite) {
		return favouriterepository.save(favourite);
	}
	
	public void deleteById(int id) {
		favouriterepository.deleteById(id);
	}
	public void delete(Favourite favourite) {
		favouriterepository.delete(favourite);
	}
}
