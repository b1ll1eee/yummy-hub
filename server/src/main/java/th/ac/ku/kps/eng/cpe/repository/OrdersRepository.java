package th.ac.ku.kps.eng.cpe.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import th.ac.ku.kps.eng.cpe.model.Orders;
import th.ac.ku.kps.eng.cpe.model.Store;
import th.ac.ku.kps.eng.cpe.model.User;

@Repository
public interface OrdersRepository extends CrudRepository<Orders, Integer> {
	@Query("from Orders as o where o.orderId = :orderId")
	public Orders findById(@Param("orderId") String orderId);
	
	@Query("from Orders as o where o.user = :user and o.orderStatus != 'Cart'")
	public List<Orders> findByUser(@Param("user") User user);
	
	@Query("from Orders as o where o.user = :user and o.orderStatus = 'Cart'")
	public List<Orders> findCartByUser(@Param("user") User user);
	
	@Query("from Orders as o where o.orderStatus != 'Cart'")
	public List<Orders> findPayment();
	
	@Query("from Orders as o where o.paymentStatus = 'Approve' and o.store.storeId = :storeId")
	public List<Orders> findPickupByStore(@Param("storeId") String storeId);
	
	@Query("from Orders as o where o.orderStatus = 'Pending' and o.paymentStatus = 'Approve'")
	public List<Orders> findPickup();
	
	@Query("from Orders as o where o.orderStatus = 'Cart'")
	public List<Orders> findCart();
	
	@Query("from Orders as o where o.pickupCode = :pickupCode")
	public Orders findPickupCode(@Param("pickupCode") String pickupCode);
}
