package th.ac.ku.kps.eng.cpe.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RestController;

import th.ac.ku.kps.eng.cpe.model.Orders;

@Service
public class ScheduledService {

	@Autowired
	OrdersServices orderservice;
	
    @Scheduled(cron = "0 0 0 * * *") 
    public void ScheduledMethod() {
        List<Orders> ordersPickup = orderservice.findPickup();
        List<Orders> ordersCart = orderservice.findCart();
        if(ordersPickup.size()>0) {
        	for (Orders order : ordersPickup) {
				order.setOrderStatus("Failed");
				order.setPickupStatus("Failed");
				order.setUpdatedate(new Date());
				orderservice.save(order);
			}
        }
        if(ordersCart.size()>0) {
        	for (Orders order : ordersCart) {
				orderservice.deleteById(order);
			}
        }
    }
}
