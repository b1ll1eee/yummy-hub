package th.ac.ku.kps.eng.cpe.response;

import org.springframework.http.HttpStatus;

import th.ac.ku.kps.eng.cpe.model.Orders;

public class OrderResponse {
	private HttpStatus status;
	private Orders orders;
	private String msg;
	
	public OrderResponse() {
		super();
	}

	public OrderResponse(HttpStatus status, Orders orders, String msg) {
		super();
		this.setStatus(status);
		this.setOrders(orders);
		this.setMsg(msg);
	}

	public HttpStatus getStatus() {
		return status;
	}

	public void setStatus(HttpStatus status) {
		this.status = status;
	}

	public Orders getOrders() {
		return orders;
	}

	public void setOrders(Orders orders) {
		this.orders = orders;
	}

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}
	
	
}
