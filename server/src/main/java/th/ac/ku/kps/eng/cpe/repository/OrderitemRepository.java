package th.ac.ku.kps.eng.cpe.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import th.ac.ku.kps.eng.cpe.model.Orderitem;
import th.ac.ku.kps.eng.cpe.model.User;

@Repository
public interface OrderitemRepository extends CrudRepository<Orderitem, Integer> {
	@Query("from Orderitem oi inner join oi.orders o where o.orderId = :orderId")
	public List<Orderitem> findByOrderId(@Param("orderId") String orderId);
	
	@Query("from Orderitem oi inner join oi.orders o where o.user = :user")
	public List<Orderitem> findByUser(@Param("user") User user);
	
	@Query("from Orderitem oi inner join oi.orders o where o.user = :user and o.orderStatus = 'Cart'")
	public List<Orderitem> findCartByUser(@Param("user")User user);
	
	@Query("from Orderitem oi where oi.orderItemId = :orderItemId")
	public Orderitem findById(@Param("orderItemId") String orderItemId);
	
}
