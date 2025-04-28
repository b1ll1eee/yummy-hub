package th.ac.ku.kps.eng.cpe.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import th.ac.ku.kps.eng.cpe.model.User;
import th.ac.ku.kps.eng.cpe.repository.UserRepository;

@Service
public class UserServices {
	@Autowired
	private UserRepository userrepository;
	
	public List<User> findAll(){
		return (List<User>) userrepository.findAll();
	}
	
	public User findById(int id) {
		return userrepository.findById(id).orElse(null);
	}
	
	public User save(User user) {
		return userrepository.save(user);
	}
	
	public void deleteById(int id) {
		userrepository.deleteById(id);
	}
	
	public User findByUserId(String userId) {
		return userrepository.findByUserId(userId);
	}
}
