package th.ac.ku.kps.eng.cpe.response;

import org.springframework.http.HttpStatus;

public class QRCodeResponse {
	private HttpStatus status;
	private String results;
	private String msg;
	
	public String getResults() {
		return results;
	}
	public void setResults(String results) {
		this.results = results;
	}
	public String getMsg() {
		return msg;
	}
	public void setMsg(String msg) {
		this.msg = msg;
	}
	public HttpStatus getStatus() {
		return status;
	}
	public void setStatus(HttpStatus status) {
		this.status = status;
	}
}
