package th.ac.ku.kps.eng.cpe.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.samstevens.totp.code.CodeGenerator;
import dev.samstevens.totp.code.CodeVerifier;
import dev.samstevens.totp.code.DefaultCodeGenerator;
import dev.samstevens.totp.code.DefaultCodeVerifier;
import dev.samstevens.totp.code.HashingAlgorithm;
import dev.samstevens.totp.exceptions.QrGenerationException;
import dev.samstevens.totp.qr.QrData;
import dev.samstevens.totp.secret.DefaultSecretGenerator;
import dev.samstevens.totp.secret.SecretGenerator;
import dev.samstevens.totp.time.SystemTimeProvider;
import dev.samstevens.totp.time.TimeProvider;
import dev.samstevens.totp.qr.ZxingPngQrGenerator;
import dev.samstevens.totp.recovery.RecoveryCodeGenerator;
import dev.samstevens.totp.qr.QrGenerator;
import static dev.samstevens.totp.util.Utils.getDataUriForImage;

import th.ac.ku.kps.eng.cpe.auth.JwtUtil;
import th.ac.ku.kps.eng.cpe.dto.LoginDTO;
import th.ac.ku.kps.eng.cpe.dto.RegisterDTO;
import th.ac.ku.kps.eng.cpe.dto.UserDTO;
import th.ac.ku.kps.eng.cpe.dto.UserLogin;
import th.ac.ku.kps.eng.cpe.model.User;
import th.ac.ku.kps.eng.cpe.response.LoginResponse;
import th.ac.ku.kps.eng.cpe.response.MFAResponse;
import th.ac.ku.kps.eng.cpe.response.RegisterResponse;
import th.ac.ku.kps.eng.cpe.service.DecryptionServices;
import th.ac.ku.kps.eng.cpe.service.EncryptionServices;
import th.ac.ku.kps.eng.cpe.service.HashServices;
import th.ac.ku.kps.eng.cpe.service.UserServices;

import java.net.UnknownHostException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class AuthenticationController {
	private final String secret = "T5JDCOA5B5B6NPEUPC5V3RXCWSLKWBZ2I4MRYMXSERNW7I6E27YH7J6WMLTIBDQD";

	@Autowired
	private UserServices userservice;
	
	@Autowired
    private HashServices hashservices;
	
	@Autowired
	private EncryptionServices encryptionservice;
	
	@Autowired
	private DecryptionServices decryptionservice;
	
	private JwtUtil jwtUtil;
    public AuthenticationController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }
	
	@GetMapping("/generateMFACode/{userId}")
	public MFAResponse generateMFA(@PathVariable("userId") String userId) throws QrGenerationException {
		MFAResponse resp = new MFAResponse();
		
		SecretGenerator secretGenerator = new DefaultSecretGenerator();
		String secret = secretGenerator.generate();
		
		QrData data = new QrData.Builder()
				   .label(userId)
				   .secret(secret)
				   .issuer("Yummy Hub")
				   .algorithm(HashingAlgorithm.SHA1) // More on this below
				   .digits(6)
				   .period(30)
				   .build();
		QrGenerator generator = new ZxingPngQrGenerator();
		byte[] imageData = generator.generate(data);
		String mimeType = generator.getImageMimeType();
		String dataUri = getDataUriForImage(imageData, mimeType);
		
		resp.setStatus(HttpStatus.CREATED);
		resp.setSecret(secret);
		resp.setUri(dataUri);
		
		return resp;
	}
	
	@PostMapping("/register")
	public RegisterResponse register(@Valid @RequestBody RegisterDTO user, BindingResult bindingResult) throws Exception {
		RegisterResponse resp = new RegisterResponse();
		
		String userId = encryptionservice.encrypt(user.getUserId());
		
		if(bindingResult.hasErrors()||(userservice.findByUserId(userId)!=null)) {
			resp.setStatus(HttpStatus.BAD_REQUEST);
			List<String> errors = bindingResult.getAllErrors().stream()
					.map(ObjectError::getDefaultMessage)
					.collect(Collectors.toList());
			if(userservice.findByUserId(userId)!=null) {
				errors.add("Invalid USER ID: USER ID DUPLICATE");
			}
			resp.setMsg(errors);
			
			return resp;
		}
		else {
			resp.setStatus(HttpStatus.OK);
			List<String> msg = new ArrayList<String>();
			msg.add("Success");
			
			return resp;
		}
	}
	
	@PostMapping("/register/totp")
	public RegisterResponse registertotp(@Valid @RequestBody UserDTO user, BindingResult bindingResult) throws Exception {
		RegisterResponse resp = new RegisterResponse();
		TimeProvider timeProvider = new SystemTimeProvider();
		CodeGenerator codeGenerator = new DefaultCodeGenerator();
		CodeVerifier verifier = new DefaultCodeVerifier(codeGenerator, timeProvider);
		boolean successful = verifier.isValidCode(user.getSecretCode(), user.getCodeTwoFactorAuthentication());
		
		if(successful) {
			String userId = encryptionservice.encrypt(user.getUserId());
			String firstname = encryptionservice.encrypt(user.getFirstname());
			String lastname = encryptionservice.encrypt(user.getLastname());
			String salt = hashservices.generateSalt();
			String password = hashservices.hashPassword(user.getPassword(),salt);
			
			if(bindingResult.hasErrors()||(userservice.findByUserId(userId)!=null)) {
				resp.setStatus(HttpStatus.BAD_REQUEST);
				List<String> errors = bindingResult.getAllErrors().stream()
						.map(ObjectError::getDefaultMessage)
						.collect(Collectors.toList());
				if(userservice.findByUserId(userId)!=null) {
					errors.add("Invalid USER ID: USER ID DUPLICATE");
				}
				resp.setMsg(errors);
				
				return resp;
			}
			else {
				userservice.save(new User(userId,firstname,lastname,password,salt,"customer",null,false,0,null,true,user.getSecretCode()));
				resp.setStatus(HttpStatus.CREATED);
				List<String> msg = new ArrayList<String>();
				msg.add("Register Success");
				
				return resp;
			}
		}
		else {
			resp.setStatus(HttpStatus.BAD_REQUEST);
			List<String> msg = new ArrayList<String>();
			msg.add("Code not Match!");
			resp.setMsg(msg);
			
			return resp;
		}
	}
	
	@PostMapping("/login")
	public LoginResponse login(@RequestBody LoginDTO login, BindingResult bindingResult) throws Exception {
		LoginResponse loginresp = new LoginResponse();
		String userId = decryptionservice.Decrypt(login.getUsername());
		String password = decryptionservice.Decrypt(login.getPassword());
		
		String encodedUserId = encryptionservice.encrypt(userId);
		
		User user = userservice.findByUserId(encodedUserId);
		if(user!=null) {
			Date current = new Date();
			
			if(user.getAttemptTimeLogin()!=null && user.getAccountLockStatus()) {
				Calendar calendarDatabaseDate = Calendar.getInstance();
				calendarDatabaseDate.setTime(user.getAttemptTimeLogin());
				
				Calendar calendarCurrentDate = Calendar.getInstance();
				calendarCurrentDate.setTime(current);
				
				calendarDatabaseDate.add(Calendar.HOUR, 1);	
				
				if(calendarCurrentDate.after(calendarDatabaseDate)) {
					user.setAccountLockStatus(false);
					user.setAttemptLogin(0);
					user.setAttemptTimeLogin(null);
					userservice.save(user);
				}
			}
			
			if(!user.getAccountLockStatus()) {
				if(hashservices.verifyPassword(password, user.getSalt(), user.getPassword())) {
					loginresp.setStatus(HttpStatus.OK);
					List<String> msg = new ArrayList<String>();
					msg.add("Success");
					loginresp.setMsg(msg);
					return loginresp;
				}
				else {
					user.setAttemptLogin(user.getAttemptLogin()+1);
					if(user.getAttemptLogin()>3) {
						user.setAccountLockStatus(true);
						user.setAttemptTimeLogin(new Date());
					}
					userservice.save(user);
					loginresp.setStatus(HttpStatus.UNAUTHORIZED);
					List<String> msg = new ArrayList<String>();
					if(user.getAttemptLogin()==4) {
						msg.add("Invalid Password attempt left: "+(4-user.getAttemptLogin())+" ,Your Account Lock!");
					}
					else {
						msg.add("Invalid Password attempt left: "+(4-user.getAttemptLogin()));						
					}
					loginresp.setMsg(msg);
					return loginresp;
				}
			}
			else {
				loginresp.setStatus(HttpStatus.UNAUTHORIZED);
				List<String> msg = new ArrayList<String>();
				user.getAttemptTimeLogin().setHours(user.getAttemptTimeLogin().getHours()+1);
				msg.add("Account Lock ,Try again at "+(user.getAttemptTimeLogin()));
				loginresp.setMsg(msg);
				return loginresp;
			}	
		}
		else {
			loginresp.setStatus(HttpStatus.UNAUTHORIZED);
			List<String> errors = new ArrayList<String>();
			if(user == null) {
				errors.add("Invalid USER not Found");
			}
			loginresp.setMsg(errors);
			return loginresp;
		}
	}
	
	@PostMapping("/login/totp")
	public LoginResponse logintotp(@RequestBody LoginDTO login, BindingResult bindingResult) throws Exception {
		LoginResponse loginresp = new LoginResponse();
		String userId = decryptionservice.Decrypt(login.getUsername());
		String password = decryptionservice.Decrypt(login.getPassword());
		
		String encodedUserId = encryptionservice.encrypt(userId);
		
		User user = userservice.findByUserId(encodedUserId);

		if(user!=null) {
			Date current = new Date();
			if(user.getAttemptTimeLogin()!=null && user.getAccountLockStatus()) {
				Calendar calendarDatabaseDate = Calendar.getInstance();
				calendarDatabaseDate.setTime(user.getAttemptTimeLogin());
				
				Calendar calendarCurrentDate = Calendar.getInstance();
				calendarCurrentDate.setTime(current);
				
				calendarDatabaseDate.add(Calendar.HOUR, 1);	
				
				if(calendarCurrentDate.after(calendarDatabaseDate)) {
					user.setAccountLockStatus(false);
					user.setAttemptLogin(0);
					user.setAttemptTimeLogin(null);
					userservice.save(user);
				}
			}
			
			if(!user.getAccountLockStatus()) {
				TimeProvider timeProvider = new SystemTimeProvider();
				CodeGenerator codeGenerator = new DefaultCodeGenerator();
				CodeVerifier verifier = new DefaultCodeVerifier(codeGenerator, timeProvider);
				boolean successful = verifier.isValidCode(user.getCodeTwoFactorAuthentication(),login.getSecretcode());
				
				if(successful) {
					if(hashservices.verifyPassword(password, user.getSalt(), user.getPassword())) {
						String token = jwtUtil.createToken(user);
						loginresp.setStatus(HttpStatus.OK);
						loginresp.setAccessToken(token);
						List<String> msg = new ArrayList<String>();
						msg.add("Login Success");
						loginresp.setMsg(msg);
						loginresp.setUser(new UserLogin(encryptionservice.decrypt(user.getUserId()),encryptionservice.decrypt(user.getFirstname()),encryptionservice.decrypt(user.getLastname()),user.getRole()));
						user.setLastLoginTimestamp(new Date());
						user.setAttemptLogin(0);
						userservice.save(user);
						return loginresp;
					}
					else {
						user.setAttemptLogin(user.getAttemptLogin()+1);
						System.out.print(user.getAttemptLogin());
						if(user.getAttemptLogin()>3) {
							user.setAccountLockStatus(true);
							user.setAttemptTimeLogin(new Date());
						}
						userservice.save(user);
						loginresp.setStatus(HttpStatus.UNAUTHORIZED);
						List<String> msg = new ArrayList<String>();
						if(user.getAttemptLogin()==4) {
							msg.add("Invalid Password attempt left: "+(4-user.getAttemptLogin())+" ,Your Account Lock!");
						}
						else {
							msg.add("Invalid Password attempt left: "+(4-user.getAttemptLogin()));						
						}
						loginresp.setMsg(msg);
						return loginresp;
					}
				}
				else {
					user.setAttemptLogin(user.getAttemptLogin()+1);
					List<String> msg = new ArrayList<String>();
					if(user.getAttemptLogin()>3) {
						user.setAccountLockStatus(true);
						user.setAttemptTimeLogin(new Date());
						user.getAttemptTimeLogin().setHours(user.getAttemptTimeLogin().getHours()+1);
						msg.add("Code not match, attempt left: "+(4-user.getAttemptLogin())+" ,Your Account Lock! ,Try again at ");
					}
					else {		
						msg.add("Code not match, attempt left: "+(4-user.getAttemptLogin()));						
					}
					userservice.save(user);
					loginresp.setStatus(HttpStatus.UNAUTHORIZED);
					loginresp.setMsg(msg);
					return loginresp;
				}
			}
			else {
				loginresp.setStatus(HttpStatus.UNAUTHORIZED);
				List<String> msg = new ArrayList<String>();
				user.getAttemptTimeLogin().setHours(user.getAttemptTimeLogin().getHours()+1);
				msg.add("Account Lock ,Try again at "+(user.getAttemptTimeLogin()));
				loginresp.setMsg(msg);
				return loginresp;
			}	
		}
		else {
			loginresp.setStatus(HttpStatus.UNAUTHORIZED);
			List<String> errors = new ArrayList<String>();
			if(user == null) {
				errors.add("Invalid USER not Found");
			}
			loginresp.setMsg(errors);
			return loginresp;
		}
	}
	
	@PostMapping("/login/test")
	public LoginResponse logintest(@Valid @RequestBody LoginDTO login, BindingResult bindingResult) throws Exception {
		LoginResponse loginresp = new LoginResponse();
//		String userId = decryptionservice.decrypt(login.getUsername());
//		String password = decryptionservice.decrypt(login.getPassword());
		
		String encodedUserId = encryptionservice.encrypt(login.getUsername());
		
		User user = userservice.findByUserId(encodedUserId);
		if(!bindingResult.hasErrors() && user!=null) {
			Date current = new Date();
			
			if(user.getAttemptTimeLogin()!=null && user.getAccountLockStatus()) {
				Calendar calendarDatabaseDate = Calendar.getInstance();
				calendarDatabaseDate.setTime(user.getAttemptTimeLogin());
				
				Calendar calendarCurrentDate = Calendar.getInstance();
				calendarCurrentDate.setTime(current);
				
				calendarDatabaseDate.add(Calendar.HOUR, 1);	
				
				if(calendarCurrentDate.after(calendarDatabaseDate)) {
					user.setAccountLockStatus(false);
					user.setAttemptLogin(0);
					user.setAttemptTimeLogin(null);
					userservice.save(user);
				}
			}
			
			if(!user.getAccountLockStatus()) {
				TimeProvider timeProvider = new SystemTimeProvider();
				CodeGenerator codeGenerator = new DefaultCodeGenerator();
				CodeVerifier verifier = new DefaultCodeVerifier(codeGenerator, timeProvider);
				boolean successful = verifier.isValidCode(user.getCodeTwoFactorAuthentication(),login.getSecretcode());
				
//				if(successful) {
					if(hashservices.verifyPassword(login.getPassword(), user.getSalt(), user.getPassword())) {
						String token = jwtUtil.createToken(user);
						loginresp.setStatus(HttpStatus.OK);
						loginresp.setAccessToken(token);
						List<String> msg = new ArrayList<String>();
						msg.add("Login Success");
						loginresp.setMsg(msg);
						loginresp.setUser(new UserLogin(encryptionservice.decrypt(user.getUserId()),encryptionservice.decrypt(user.getFirstname()),encryptionservice.decrypt(user.getFirstname()),user.getRole()));
						user.setLastLoginTimestamp(new Date());
						user.setAttemptLogin(0);
						userservice.save(user);
						return loginresp;
//					}
//					else {
//						user.setAttemptLogin(user.getAttemptLogin()+1);
//						if(user.getAttemptLogin()==3) {
//							user.setAccountLockStatus(true);
//							user.setAttemptTimeLogin(new Date());
//						}
//						userservice.save(user);
//						loginresp.setStatus(HttpStatus.UNAUTHORIZED);
//						List<String> msg = new ArrayList<String>();
//						msg.add("Invalid Password");
//						loginresp.setMsg(msg);
//						return loginresp;
//					}
				}
				else {
					user.setAttemptLogin(user.getAttemptLogin()+1);
					if(user.getAttemptLogin()==3) {
						user.setAccountLockStatus(true);
						user.setAttemptTimeLogin(new Date());
					}
					userservice.save(user);
					loginresp.setStatus(HttpStatus.UNAUTHORIZED);
					List<String> msg = new ArrayList<String>();
					msg.add("Code not Match");
					loginresp.setMsg(msg);
					return loginresp;
				}
			}
			else {
				loginresp.setStatus(HttpStatus.UNAUTHORIZED);
				List<String> msg = new ArrayList<String>();
				msg.add("Account Lock");
				loginresp.setMsg(msg);
				return loginresp;
			}	
		}
		else {
			loginresp.setStatus(HttpStatus.UNAUTHORIZED);
			List<String> errors = bindingResult.getAllErrors().stream()
					.map(ObjectError::getDefaultMessage)
					.collect(Collectors.toList());
			if(user == null) {
				errors.add("Invalid USER not Found");
			}
			loginresp.setMsg(errors);
			return loginresp;
		}
	}
	
	@PostMapping("/check/{code}")
	public Boolean check(@PathVariable("code")String code) throws UnknownHostException  {
		TimeProvider timeProvider = new SystemTimeProvider();
		CodeGenerator codeGenerator = new DefaultCodeGenerator();
		CodeVerifier verifier = new DefaultCodeVerifier(codeGenerator, timeProvider);
		boolean successful = verifier.isValidCode(secret, code);
		return successful;
	}
	
	@PostMapping("/recovery")
	public String[] Recovery() {
		RecoveryCodeGenerator recoveryCodes = new RecoveryCodeGenerator();
		String[] codes = recoveryCodes.generateCodes(16);
		return codes;
	}
    
}
