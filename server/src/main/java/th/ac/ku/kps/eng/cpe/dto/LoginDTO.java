package th.ac.ku.kps.eng.cpe.dto;

public class LoginDTO {
	private String username;
	private String password;
	private String secretcode;
	
	public LoginDTO() {}

	public LoginDTO(String username, String password, String secretcode) {
		super();
		this.username = username;
		this.password = password;
		this.setSecretcode(secretcode);
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getSecretcode() {
		return secretcode;
	}

	public void setSecretcode(String secretcode) {
		this.secretcode = secretcode;
	}
	
}
