package th.ac.ku.kps.eng.cpe.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

import io.jsonwebtoken.Claims;
import th.ac.ku.kps.eng.cpe.auth.JwtUtil;
import th.ac.ku.kps.eng.cpe.model.Product;
import th.ac.ku.kps.eng.cpe.model.Store;
import th.ac.ku.kps.eng.cpe.model.User;
import th.ac.ku.kps.eng.cpe.service.EncryptionServices;
import th.ac.ku.kps.eng.cpe.service.ProductServices;
import th.ac.ku.kps.eng.cpe.service.StoreServices;
import th.ac.ku.kps.eng.cpe.service.UserServices;
import th.ac.ku.kps.eng.cpe.util.FileUploadUtil;
import th.ac.ku.kps.eng.cpe.response.Response;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class ProductController {
	@Autowired
	private ProductServices productservice;
	
	@Autowired
    private JwtUtil jwtUtil;
	
	@Autowired
	private UserServices userservice;
	
	@Autowired
	private StoreServices storeservice;
	
	@Autowired
	private EncryptionServices encryptionservice;
	
	@GetMapping("/product")
	public List<Product> getAll(){
		return productservice.findAll();
	}
	
	@GetMapping("/product/type/{id}")
	public List<Product> getByTypeId(@PathVariable("id")int id){
		return productservice.findByTypeId(id);
	}
	
	@GetMapping("/product/{id}")
	public Product getById(@PathVariable("id")String id) {
		return productservice.findById(id);
	}
	
	@GetMapping("/product/store/{id}")
	public List<Product> getByOrder(@PathVariable("id")String id){
		return productservice.findByStoreId(id);
	}
	
	@GetMapping("/product/type/{id}/{district}/{subdistrict}/{province}")
	public List<Product> getByLocationAndType(@PathVariable("id")int id,@PathVariable("district")String districtId,@PathVariable("subdistrict")String subdistrictId,@PathVariable("province")String provinceId){
		List<Store> stores = storeservice.findByLocation(districtId, subdistrictId, provinceId);
		List<Product> products = new ArrayList<>();
		for (Store store : stores) {
			products.addAll(productservice.findByStoreAndType(store, id));
		}
		return products;
	}
	
	@GetMapping("/auth/product")
	public List<Product> getByUser(@RequestHeader("Authorization") String token) throws Exception{
		String jwtToken = token.replace("Bearer ", "");
		Claims claims = jwtUtil.parseJwtClaims(jwtToken);
		String username = (String) claims.get("username");
		User user = userservice.findByUserId(encryptionservice.encrypt(username));
		if(user != null && user.getRole().equals("store owner")) {
			return productservice.findByUser(user);
		} else {
			return null;
		}
	}
	
	@PostMapping("/auth/product")
	public Response create(@RequestHeader("Authorization") String token,@RequestPart("product") String productJson,@RequestPart("file") MultipartFile file) throws Exception {
		String jwtToken = token.replace("Bearer ", "");
		Claims claims = jwtUtil.parseJwtClaims(jwtToken);
		String username = (String) claims.get("username");
		User user = userservice.findByUserId(encryptionservice.encrypt(username));
		if(user != null && user.getRole().equals("store owner")) {
			ObjectMapper objectMapper = new ObjectMapper();
			Product product = objectMapper.readValue(productJson, Product.class);
			String fileName = StringUtils.cleanPath(file.getOriginalFilename());
			if (fileName != null && fileName.matches(".*\\.(jpg|jpeg|png|gif|bmp|svg)$")) {
				String img = FileUploadUtil.saveFile(fileName,"products", file);
				product.setImgProduct(img);
				product.setCreatedate(new Date());
				product.setIsactive(true);
				product.setProductId(UUID.randomUUID().toString());
				productservice.save(product);
				return new Response(HttpStatus.CREATED,"created");				
			}
	        return new Response(HttpStatus.INTERNAL_SERVER_ERROR,"Error File Type!");
		}
		return new Response(HttpStatus.UNAUTHORIZED,"Unauthorized!");
	}
	
	@PutMapping("/auth/product/{id}")
	public Response update(@RequestHeader("Authorization") String token,@PathVariable("id")String id,@RequestPart("product") String productJson,@RequestPart("file") MultipartFile file) throws Exception {
		String jwtToken = token.replace("Bearer ", "");
		Claims claims = jwtUtil.parseJwtClaims(jwtToken);
		String username = (String) claims.get("username");
		User user = userservice.findByUserId(encryptionservice.encrypt(username));
		if(user != null && user.getRole().equals("store owner")) {
			Product product = productservice.findById(id);
			ObjectMapper objectMapper = new ObjectMapper();
			Product productObj = objectMapper.readValue(productJson, Product.class);
			
			product.setName(productObj.getName());
			product.setDescription(productObj.getDescription());
			product.setExpiryDate(productObj.getExpiryDate());
			product.setType(productObj.getType());
			product.setPrice(productObj.getPrice());
			product.setDiscountPrice(productObj.getDiscountPrice());
			product.setQuantityAvailable(productObj.getQuantityAvailable());
			product.setUpdatedate(new Date());
			
			String fileName = StringUtils.cleanPath(file.getOriginalFilename());
			if ((fileName != null) && (fileName.matches(".*\\.(jpg|jpeg|png|gif|bmp|svg)$"))) {
				if(!fileName.equals(product.getImgProduct())) {
					System.out.println(fileName);
					System.out.println(product.getImgProduct());
					String img = FileUploadUtil.saveFile(fileName,"products", file);	
					product.setImgProduct(img);					
				}
				productservice.save(product);
				return new Response(HttpStatus.OK,"Updated");
			}
			return new Response(HttpStatus.INTERNAL_SERVER_ERROR,"Error File Type!");
		}
		return new Response(HttpStatus.UNAUTHORIZED,"Unauthorized!");
	}
	
	@DeleteMapping("/auth/product/{id}")
	public Response delete(@RequestHeader("Authorization") String token,@PathVariable("id") String id) throws Exception {
		String jwtToken = token.replace("Bearer ", "");
		Claims claims = jwtUtil.parseJwtClaims(jwtToken);
		String username = (String) claims.get("username");
		User user = userservice.findByUserId(encryptionservice.encrypt(username));
		if(user!=null && user.getRole().equals("store owner")) {
			Product product = productservice.findById(id);
			productservice.delete(product);	
			return new Response(HttpStatus.OK,"Deleted");
		}
		return new Response(HttpStatus.UNAUTHORIZED,"Unauthorized!");
	}
}
