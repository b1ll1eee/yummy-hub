package th.ac.ku.kps.eng.cpe.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.jsonwebtoken.Claims;
import th.ac.ku.kps.eng.cpe.auth.JwtUtil;
import th.ac.ku.kps.eng.cpe.model.Store;
import th.ac.ku.kps.eng.cpe.model.User;
import th.ac.ku.kps.eng.cpe.response.Response;
import th.ac.ku.kps.eng.cpe.service.EncryptionServices;
import th.ac.ku.kps.eng.cpe.service.StoreServices;
import th.ac.ku.kps.eng.cpe.service.UserServices;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class StoreController {

	@Autowired
	private StoreServices storeservice;
	
	@Autowired
    private JwtUtil jwtUtil;
	
	@Autowired
	private UserServices userservice;
	
	@Autowired
	private EncryptionServices encryptionservice;
	
	@GetMapping("/store")
	public List<Store> all(){
		return storeservice.findAll();
	}
	
	@GetMapping("/store/{id}")
	public Store storeById(@PathVariable("id")String id) {
		return storeservice.findById(id);
	}
	
	@GetMapping("/auth/store")
	public Store storeByOwner(@RequestHeader("Authorization") String token) throws Exception {
		String jwtToken = token.replace("Bearer ", "");
		Claims claims = jwtUtil.parseJwtClaims(jwtToken);
		String username = (String) claims.get("username");
		User user = userservice.findByUserId(encryptionservice.encrypt(username));
		if(user != null && user.getRole().equals("store owner")) {
			return storeservice.findByOwner(user);
		}
		return null;
	}
	
	@GetMapping("/store/{district}/{subdistrict}/{province}")
	public List<Store> storeByLoacation(@PathVariable("district")String district,@PathVariable("subdistrict")String subdistrict,@PathVariable("province")String province){
		return storeservice.findByLocation(district, subdistrict, province);
	}
}
