package th.ac.ku.kps.eng.cpe.service;

import java.security.SecureRandom;
import java.util.Base64;

import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class HashServices {
	
	@Value("${secret.pepper}")
	private String pepper;
	
	public String hashPassword(String password, String salt) {
        String combinedPassword = salt + pepper + password;
        return DigestUtils.sha256Hex(combinedPassword);
    }
	
	public boolean verifyPassword(String rawPassword, String salt, String encodedPassword) {
	        String combinedPassword = salt + pepper + rawPassword;
	        String hashedPasswordToCheck = DigestUtils.sha256Hex(combinedPassword);
	        return hashedPasswordToCheck.equals(encodedPassword);
	}
	
	public String generateSalt() {
        byte[] saltBytes = new byte[16];
        SecureRandom random = new SecureRandom();
        random.nextBytes(saltBytes);
        return Base64.getEncoder().encodeToString(saltBytes);
    }
	
}
