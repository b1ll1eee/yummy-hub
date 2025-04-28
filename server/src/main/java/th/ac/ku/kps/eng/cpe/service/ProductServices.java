package th.ac.ku.kps.eng.cpe.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import th.ac.ku.kps.eng.cpe.model.Product;
import th.ac.ku.kps.eng.cpe.model.Store;
import th.ac.ku.kps.eng.cpe.model.User;
import th.ac.ku.kps.eng.cpe.repository.ProductRepository;

@Service
public class ProductServices {
	@Autowired
	private ProductRepository productpository;
	
	public List<Product> findAll(){
		return (List<Product>) productpository.findAll();
	}
	
	public List<Product> findByTypeId(int id){
		return (List<Product>) productpository.findByTypeId(id);
	}
	
	public List<Product> findByStore(Store store){
		return (List<Product>) productpository.findByStore(store);
	}
	
	public List<Product> findByStoreId(String id){
		return (List<Product>) productpository.findByStoreId(id);
	}
	
	public List<Product> findByUser(User user){
		return (List<Product>) productpository.findByUser(user);
	}
	
	public List<Product> findByStoreAndType(Store store, int id){
		return (List<Product>) productpository.findByStoreAndType(store, id);
	}
	
	public Product findById(String id) {
		return productpository.findById(id);
	}
	
	public Product save(Product product) {
		return productpository.save(product);
	}
	
	public void deleteById(int id) {
		productpository.deleteById(id);
	}
	
	public void delete(Product product) {
		productpository.delete(product);
	}
}
