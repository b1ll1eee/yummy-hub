package th.ac.ku.kps.eng.cpe.controller;

import java.math.BigDecimal;
import java.sql.Time;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.jsonwebtoken.Claims;
import th.ac.ku.kps.eng.cpe.auth.JwtUtil;
import th.ac.ku.kps.eng.cpe.model.Orderitem;
import th.ac.ku.kps.eng.cpe.model.Orders;
import th.ac.ku.kps.eng.cpe.model.Product;
import th.ac.ku.kps.eng.cpe.model.User;
import th.ac.ku.kps.eng.cpe.response.Response;
import th.ac.ku.kps.eng.cpe.service.EncryptionServices;
import th.ac.ku.kps.eng.cpe.service.OrderitemServices;
import th.ac.ku.kps.eng.cpe.service.OrdersServices;
import th.ac.ku.kps.eng.cpe.service.ProductServices;
import th.ac.ku.kps.eng.cpe.service.UserServices;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class OrderitemController {
	
	@Autowired
    private JwtUtil jwtUtil;
	
	@Autowired
	private UserServices userservice;
	
	@Autowired
	private OrderitemServices orderitemservice;
	
	@Autowired
	private EncryptionServices encryptionservice;
	
	@Autowired
	private OrdersServices orderservice;
	
	@Autowired
	private ProductServices productservice;
	
	@GetMapping("/auth/orderitem")
	public List<Orderitem> getByUser(@RequestHeader("Authorization") String token) throws Exception {
		String jwtToken = token.replace("Bearer ", "");
		Claims claims = jwtUtil.parseJwtClaims(jwtToken);
		String username = (String) claims.get("username");
		User user = userservice.findByUserId(encryptionservice.encrypt(username));
		if(user!=null && user.getRole().equals("customer")) {
			return orderitemservice.findByUser(user);
		}
		return null;
	}
	
	@GetMapping("/auth/orderitem/{id}")
	public Orderitem getById(@RequestHeader("Authorization") String token,@PathVariable("id") String id) throws Exception {
		String jwtToken = token.replace("Bearer ", "");
		Claims claims = jwtUtil.parseJwtClaims(jwtToken);
		String username = (String) claims.get("username");
		User user = userservice.findByUserId(encryptionservice.encrypt(username));
		if(user!=null && user.getRole().equals("customer")) {
			return orderitemservice.findById(id);
		}
		return null;
	}
	
	@GetMapping("/auth/orderitem/order/{id}")
	public List<Orderitem> getByOrderId(@RequestHeader("Authorization") String token,@PathVariable("id") String id) throws Exception {
		String jwtToken = token.replace("Bearer ", "");
		Claims claims = jwtUtil.parseJwtClaims(jwtToken);
		String username = (String) claims.get("username");
		User user = userservice.findByUserId(encryptionservice.encrypt(username));
		if(user!=null && user.getRole().equals("customer")) {
			return orderitemservice.findByOrderId(id);
		}
		return null;
	}
	
	@GetMapping("/auth/cart")
	public List<Orderitem> getCartByUser(@RequestHeader("Authorization") String token) throws Exception {
		String jwtToken = token.replace("Bearer ", "");
		Claims claims = jwtUtil.parseJwtClaims(jwtToken);
		String username = (String) claims.get("username");
		User user = userservice.findByUserId(encryptionservice.encrypt(username));
		if(user!=null && user.getRole().equals("customer")) {
			return orderitemservice.findCartByUser(user);
		}
		return null;
	}
	
	@PostMapping("/auth/orderitem/{id}")
	public Response addeOrderItem(@RequestHeader("Authorization") String token,@RequestBody Orderitem orderitem,@PathVariable("id") String id) throws Exception {
		String jwtToken = token.replace("Bearer ", "");
		Claims claims = jwtUtil.parseJwtClaims(jwtToken);
		String username = (String) claims.get("username");
		User user = userservice.findByUserId(encryptionservice.encrypt(username));
		if(user!=null && user.getRole().equals("customer")) {
			List<Orders> orders = orderservice.findCartByUser(user);
			Product product = productservice.findById(id);
			BigDecimal subTotal = new BigDecimal(0);
			
			Time storeOpenDate = product.getStore().getStoreOpen();
			Time storeCloseDate = product.getStore().getStoreClose();
			LocalTime storeOpenTime = storeOpenDate.toLocalTime();
			LocalTime storeCloseTime = storeCloseDate.toLocalTime();
			LocalTime currentTime = LocalTime.now();
			LocalTime oneHourBeforeClose = storeCloseTime.minusHours(1);
			
			if(currentTime.isAfter(storeOpenTime) && currentTime.isBefore(storeCloseTime)) {
				if(orderitem.getQuantity()<=product.getQuantityAvailable() && orderitem.getQuantity()>0) {
					if (currentTime.isBefore(storeCloseTime) && currentTime.isAfter(oneHourBeforeClose)) {
						orderitem.setPrice(product.getDiscountPrice());
						subTotal = product.getDiscountPrice().multiply(new BigDecimal(orderitem.getQuantity()));
					} else {
						orderitem.setPrice(product.getPrice());
						subTotal = product.getPrice().multiply(new BigDecimal(orderitem.getQuantity()));				
					}
						
					if(orders != null) {
						boolean ck = true;
						for (Orders order : orders) {
							if(product.getStore().getStoreId().equals(order.getStore().getStoreId())) {
								List<Orderitem> orderitems = orderitemservice.findByOrderId(order.getOrderId());
								for (Orderitem item : orderitems) {
									if(item.getProduct().equals(product)) {
										if ((currentTime.isBefore(storeCloseTime) && currentTime.isAfter(oneHourBeforeClose)) && !item.getPrice().equals(product.getDiscountPrice())) {
											order.setTotalAmount(order.getTotalAmount().subtract(item.getSubtotal()));
											orderitemservice.deleteById(item);
											order.setTotalAmount(order.getTotalAmount().add(subTotal));
											orderitemservice.save(new Orderitem(
													UUID.randomUUID().toString(),
													product,
													order,
													orderitem.getPrice(),
													orderitem.getQuantity(),
													subTotal,
													new Date()
											));
										}
										else {
											item.setQuantity(item.getQuantity()+orderitem.getQuantity());
											item.setSubtotal(item.getSubtotal().add(subTotal));
											item.setUpdatedate(new Date());
											
											order.setTotalAmount(order.getTotalAmount().add(subTotal));
											order.setUpdatedate(new Date());
											orderitemservice.save(item);											
										}
										orderservice.save(order);
										return new Response(HttpStatus.OK,"Created");
									}
								}
								
								order.setTotalAmount(order.getTotalAmount().add(subTotal));
								order.setUpdatedate(new Date());
								
								orderservice.save(order);
								
								orderitem.setOrders(order);
								ck=false;
							}
						}
						if(ck) {
							Orders o = new Orders(UUID.randomUUID().toString(),
									product.getStore(),
									user,
									new Date(),
									"Cart",
									subTotal,null,null,null,null,null,null,
									new Date(),null	
									);
							orderservice.save(o);
							
							orderitem.setOrders(o);
						}
					}else {
						Orders o = new Orders(UUID.randomUUID().toString(),
								product.getStore(),
								user,
								new Date(),
								"Cart",
								subTotal,null,null,null,null,null,null,
								new Date(),null	
								);
						orderservice.save(o);
						
						orderitem.setOrders(o);
					}
					
					orderitem.setOrderItemId(UUID.randomUUID().toString());
					orderitem.setProduct(product);
					orderitem.setSubtotal(subTotal);
					orderitem.setCreatedate(new Date());
					
					orderitemservice.save(orderitem);
					return new Response(HttpStatus.OK,"Created");
				}
				else {
					return new Response(HttpStatus.INTERNAL_SERVER_ERROR,"QuantityAvailable not enough");
				}
			}
			else {
				return new Response(HttpStatus.INTERNAL_SERVER_ERROR,"Time not order!");
			}
		}
		return new Response(HttpStatus.UNAUTHORIZED,"UNAUTHORIZED");	
	}
	
	@PutMapping("/auth/orderitem/{id}")
	public Response updateOrderItem(@RequestHeader("Authorization") String token,@RequestBody Orderitem orderitemBody,@PathVariable("id") String id) throws Exception {
		String jwtToken = token.replace("Bearer ", "");
		Claims claims = jwtUtil.parseJwtClaims(jwtToken);
		String username = (String) claims.get("username");
		User user = userservice.findByUserId(encryptionservice.encrypt(username));
		if(user!=null && user.getRole().equals("customer")) {
			BigDecimal subTotal = new BigDecimal(0);
			Orderitem orderitem = orderitemservice.findById(id);
			Orders order = orderitem.getOrders();
			
			if(orderitem!=null) {
				Product product = orderitem.getProduct();
				
				Time storeOpenDate = product.getStore().getStoreOpen();
				Time storeCloseDate = product.getStore().getStoreClose();
				LocalTime storeOpenTime = storeOpenDate.toLocalTime();
				LocalTime storeCloseTime = storeCloseDate.toLocalTime();
				LocalTime currentTime = LocalTime.now();
				LocalTime oneHourBeforeClose = storeCloseTime.minusHours(1);
				
				if(currentTime.isAfter(storeOpenTime) && currentTime.isBefore(storeCloseTime)) {
					if(orderitemBody.getQuantity()<=product.getQuantityAvailable() && orderitemBody.getQuantity()>0) {
						
						if ((currentTime.isBefore(storeCloseTime) && currentTime.isAfter(oneHourBeforeClose)) && product.getDiscountPrice().equals(orderitem)) {
							subTotal = product.getDiscountPrice().multiply(new BigDecimal(orderitemBody.getQuantity()));
						} else {
							subTotal = product.getPrice().multiply(new BigDecimal(orderitemBody.getQuantity()));				
						}
						
						order.setTotalAmount(order.getTotalAmount().subtract(orderitem.getSubtotal()));
						order.setTotalAmount(order.getTotalAmount().add(subTotal));
						order.setUpdatedate(new Date());
						orderservice.save(order);
						
						orderitem.setQuantity(orderitemBody.getQuantity());
						orderitem.setSubtotal(subTotal);
						orderitem.setUpdatedate(new Date());						
						orderitemservice.save(orderitem);
						return new Response(HttpStatus.OK,"Update");
					}
					else {
						return new Response(HttpStatus.INTERNAL_SERVER_ERROR,"QuantityAvailable not enough");
					}
				}
				else {
					return new Response(HttpStatus.INTERNAL_SERVER_ERROR,"Time not order!");
				
				}
			}
		}
		return new Response(HttpStatus.UNAUTHORIZED,"UNAUTHORIZED");
	}
	
	@DeleteMapping("/auth/orderitem/{id}")
	public Response deleteOrderItem(@RequestHeader("Authorization") String token,@PathVariable("id") String id) throws Exception {
		String jwtToken = token.replace("Bearer ", "");
		Claims claims = jwtUtil.parseJwtClaims(jwtToken);
		String username = (String) claims.get("username");
		User user = userservice.findByUserId(encryptionservice.encrypt(username));
		if(user!=null && user.getRole().equals("customer")) {
			Orderitem item = orderitemservice.findById(id);
			Orders order = orderservice.findById(item.getOrders().getOrderId());				
			List<Orderitem> items = orderitemservice.findByOrderId(order.getOrderId());
			if(items.size() == 1) {
				orderservice.deleteById(order);		
			} else {
				order.setTotalAmount(order.getTotalAmount().subtract(item.getSubtotal()));
				order.setUpdatedate(new Date());
				orderservice.save(order);
				orderitemservice.deleteById(item);
			}
			return new Response(HttpStatus.OK,"Delted");
		}
		return new Response(HttpStatus.UNAUTHORIZED,"UNAUTHORIZED");
	}
}
