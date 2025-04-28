package th.ac.ku.kps.eng.cpe.response;

import java.util.List;

import org.springframework.http.HttpStatus;

public class RegisterResponse {
	private HttpStatus status;
	private List<String> msg;
	
	public RegisterResponse() {}
	
	public RegisterResponse(HttpStatus status, List<String> msg) {
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
	public List<String> getMsg() {
		return msg;
	}
	public void setMsg(List<String> msg) {
		this.msg = msg;
	}
	
	
}
