package th.ac.ku.kps.eng.cpe.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import th.ac.ku.kps.eng.cpe.model.Orderitem;
import th.ac.ku.kps.eng.cpe.model.User;
import th.ac.ku.kps.eng.cpe.repository.OrderitemRepository;

@Service
public class OrderitemServices {
	@Autowired
	private OrderitemRepository orderitemrepository;
	
	public List<Orderitem> findAll(){
		return (List<Orderitem>) orderitemrepository.findAll();
	}
	
	public List<Orderitem> findByOrderId(String id){
		return (List<Orderitem>) orderitemrepository.findByOrderId(id);
	}
	
	public List<Orderitem> findByUser(User user){
		return (List<Orderitem>) orderitemrepository.findByUser(user);
	}
	
	public List<Orderitem> findCartByUser(User user){
		return (List<Orderitem>) orderitemrepository.findCartByUser(user);
	}
	
	public Orderitem findById(String id) {
		return orderitemrepository.findById(id);
	}
	
	public Orderitem save(Orderitem orderitem) {
		return orderitemrepository.save(orderitem);
	}
	
	public void deleteById(Orderitem orderitem) {
		orderitemrepository.delete(orderitem);
	}
}
