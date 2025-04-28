package th.ac.ku.kps.eng.cpe.response;

import java.util.List;

import org.springframework.http.HttpStatus;

public class BooleanResponse {
	private HttpStatus status;
	private boolean result;
	private String msg;
	
	public BooleanResponse() {
		super();
	}
	
	public BooleanResponse(HttpStatus status, boolean result, String msg) {
		super();
		this.status = status;
		this.result = result;
		this.msg = msg;
	}
	
	public BooleanResponse(HttpStatus status, String msg) {
		super();
		this.status = status;
		this.msg = msg;
	}
	
	public HttpStatus getStatus() {
		return status;
	}
	
	public void setStatus(HttpStatus status) {
		this.status = status;
	}
	
	public boolean isResult() {
		return result;
	}
	
	public void setResult(boolean result) {
		this.result = result;
	}
	
	public String getMsg() {
		return msg;
	}
	
	public void setMsg(String msg) {
		this.msg = msg;
	}
	
}
