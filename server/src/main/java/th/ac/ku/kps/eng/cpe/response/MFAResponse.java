package th.ac.ku.kps.eng.cpe.response;

import org.springframework.http.HttpStatus;

public class MFAResponse {
	private HttpStatus status;
	private String secret;
	private String Uri;
	
	public MFAResponse() {}
	
	public MFAResponse(HttpStatus status, String secret, String uri) {
		super();
		this.status = status;
		this.secret = secret;
		Uri = uri;
	}
	public HttpStatus getStatus() {
		return status;
	}
	public void setStatus(HttpStatus status) {
		this.status = status;
	}
	public String getSecret() {
		return secret;
	}
	public void setSecret(String secret) {
		this.secret = secret;
	}
	public String getUri() {
		return Uri;
	}
	public void setUri(String uri) {
		Uri = uri;
	}
	
}
