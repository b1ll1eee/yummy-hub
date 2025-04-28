package th.ac.ku.kps.eng.cpe.dto;

public class UserLogin {
	private String email;
	private String firstname;
	private String lasname;
	private String role;
	
	public UserLogin() {}
	
	public UserLogin(String email, String firstname, String lasname, String role) {
		super();
		this.email = email;
		this.firstname = firstname;
		this.lasname = lasname;
		this.role = role;
	}
	
	public String getFirstname() {
		return firstname;
	}
	public void setFirstname(String firstname) {
		this.firstname = firstname;
	}
	public String getLasname() {
		return lasname;
	}
	public void setLasname(String lasname) {
		this.lasname = lasname;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}
}
