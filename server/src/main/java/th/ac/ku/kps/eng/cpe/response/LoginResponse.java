package th.ac.ku.kps.eng.cpe.response;

import java.util.List;

import org.springframework.http.HttpStatus;

import th.ac.ku.kps.eng.cpe.dto.UserDTO;
import th.ac.ku.kps.eng.cpe.dto.UserLogin;

public class LoginResponse {
	private HttpStatus status;
	private UserLogin user;
    private String accessToken;
    private List<String> msg;
    
    public LoginResponse() {}

	public LoginResponse(HttpStatus status, UserLogin user, String accessToken, List<String> msg) {
		super();
		this.status = status;
		this.user = user;
		this.accessToken = accessToken;
		this.msg = msg;
	}

	public UserLogin getUser() {
		return user;
	}

	public void setUser(UserLogin user) {
		this.user = user;
	}

	public HttpStatus getStatus() {
		return status;
	}

	public void setStatus(HttpStatus status) {
		this.status = status;
	}

	public String getAccessToken() {
		return accessToken;
	}

	public void setAccessToken(String accessToken) {
		this.accessToken = accessToken;
	}

	public List<String> getMsg() {
		return msg;
	}

	public void setMsg(List<String> msg) {
		this.msg = msg;
	}
}
