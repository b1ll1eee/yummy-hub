package th.ac.ku.kps.eng.cpe.controller;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.jsonwebtoken.Claims;
import th.ac.ku.kps.eng.cpe.auth.JwtUtil;
import th.ac.ku.kps.eng.cpe.model.Favourite;
import th.ac.ku.kps.eng.cpe.model.User;
import th.ac.ku.kps.eng.cpe.response.BooleanResponse;
import th.ac.ku.kps.eng.cpe.response.Response;
import th.ac.ku.kps.eng.cpe.service.EncryptionServices;
import th.ac.ku.kps.eng.cpe.service.FavouriteServices;
import th.ac.ku.kps.eng.cpe.service.UserServices;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class FavouriteController {
	
	@Autowired
    private JwtUtil jwtUtil;
	
	@Autowired
	private FavouriteServices favouriteservice;
	
	@Autowired
	private UserServices userservice;
	
	@Autowired
	private EncryptionServices encryptionservice;
	
	@GetMapping("/auth/favorite")
	public List<Favourite> getByUser(@RequestHeader("Authorization") String token) throws Exception{
		String jwtToken = token.replace("Bearer ", "");
		Claims claims = jwtUtil.parseJwtClaims(jwtToken);
		String username = (String) claims.get("username");
		User user = userservice.findByUserId(encryptionservice.encrypt(username));
		if(user!=null && user.getRole().equals("customer")) {
			return favouriteservice.findByUser(user);
		}
		else {
			return null;
		}
	}
	
	@GetMapping("/auth/favorite/{id}")
	public Favourite checkFavorite(@RequestHeader("Authorization") String token,@PathVariable("id") String id) throws Exception{
		String jwtToken = token.replace("Bearer ", "");
		Claims claims = jwtUtil.parseJwtClaims(jwtToken);
		String username = (String) claims.get("username");
		User user = userservice.findByUserId(encryptionservice.encrypt(username));
		if(user!=null && user.getRole().equals("customer")) {new BooleanResponse();
			Favourite favourite = favouriteservice.findByIdStoreAndUser(id, user);
			return favourite;
		}
		return null;
	}
	
	@PostMapping("/auth/favorite")
	public Response create(@RequestHeader("Authorization") String token,@RequestBody Favourite favourite) throws Exception {
		String jwtToken = token.replace("Bearer ", "");
		Claims claims = jwtUtil.parseJwtClaims(jwtToken);
		String username = (String) claims.get("username");
		User user = userservice.findByUserId(encryptionservice.encrypt(username));
		if(user!=null && user.getRole().equals("customer")) {
			favourite.setFavouriteId(UUID.randomUUID().toString());
			favourite.setCreatedate(new Date());
			favourite.setUser(user);
			favouriteservice.save(favourite);		
			return new Response(HttpStatus.OK,"Favourite!");
		}
		return new Response(HttpStatus.UNAUTHORIZED,"Unauthorized!");
	}
	
	@DeleteMapping("/auth/favorite/{id}")
	public Response delete(@RequestHeader("Authorization") String token,@PathVariable("id") String id) throws Exception {
		String jwtToken = token.replace("Bearer ", "");
		Claims claims = jwtUtil.parseJwtClaims(jwtToken);
		String username = (String) claims.get("username");
		User user = userservice.findByUserId(encryptionservice.encrypt(username));
		if(user!=null && user.getRole().equals("customer")) {
			Favourite favourite = favouriteservice.findById(id);
			favouriteservice.delete(favourite);		
			return new Response(HttpStatus.OK,"Unfavourite!");
		}
		return new Response(HttpStatus.UNAUTHORIZED,"Unauthorized!");
	}
}
