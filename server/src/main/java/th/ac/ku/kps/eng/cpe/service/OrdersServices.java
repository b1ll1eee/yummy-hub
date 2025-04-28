package th.ac.ku.kps.eng.cpe.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import th.ac.ku.kps.eng.cpe.model.Orders;
import th.ac.ku.kps.eng.cpe.model.Store;
import th.ac.ku.kps.eng.cpe.model.User;
import th.ac.ku.kps.eng.cpe.repository.OrdersRepository;

@Service
public class OrdersServices {
	@Autowired
	private OrdersRepository ordersrepository;
	
	public List<Orders> findAll(){
		return (List<Orders>) ordersrepository.findAll();
	}
	
	public List<Orders> findByUser(User user){
		return (List<Orders>) ordersrepository.findByUser(user);
	}
	
	public List<Orders> findPayment(){
		return (List<Orders>) ordersrepository.findPayment();
	}
	
	public List<Orders> findPickupByStore(String storeId){
		return (List<Orders>) ordersrepository.findPickupByStore(storeId);
	}
	
	public List<Orders> findPickup(){
		return (List<Orders>) ordersrepository.findPickup();
	}
	
	public List<Orders> findCart(){
		return (List<Orders>) ordersrepository.findCart();
	}
	
	public Orders findPickupCode(String code){
		return  ordersrepository.findPickupCode(code);
	}
	
	public List<Orders> findCartByUser(User user){
		return  (List<Orders>) ordersrepository.findCartByUser(user);
	}
	
	public Orders findById(int id) {
		return ordersrepository.findById(id).orElse(null);
	}
	
	public Orders findById(String id) {
		return ordersrepository.findById(id);
	}
	
	public Orders save(Orders orders) {
		return ordersrepository.save(orders);
	}
	
	public void deleteById(Orders order) {
		ordersrepository.delete(order);
	}
}
