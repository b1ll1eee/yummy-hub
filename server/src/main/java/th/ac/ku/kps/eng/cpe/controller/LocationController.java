package th.ac.ku.kps.eng.cpe.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import th.ac.ku.kps.eng.cpe.model.Districts;
import th.ac.ku.kps.eng.cpe.model.Product;
import th.ac.ku.kps.eng.cpe.model.Provinces;
import th.ac.ku.kps.eng.cpe.model.Subdistricts;
import th.ac.ku.kps.eng.cpe.response.LocationResponse;
import th.ac.ku.kps.eng.cpe.service.DistrictsServices;
import th.ac.ku.kps.eng.cpe.service.ProvincesServices;
import th.ac.ku.kps.eng.cpe.service.SubdistrictsServices;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class LocationController {
	
	@Autowired
	private ProvincesServices provinceservice;
	
	@Autowired
	private DistrictsServices districtservice;
	
	@Autowired
	private SubdistrictsServices subdistrictservice;
	
	@GetMapping("/location")
	public LocationResponse all() {
		LocationResponse location = new LocationResponse();
		location.setProvinces(provinceservice.findAll());
		location.setDistricts(districtservice.findAll());
		location.setSubdistricts(subdistrictservice.findAll());
		
		return location;
	}
	
	@GetMapping("/provinces")
	public List<Provinces> getById() {
		return provinceservice.findAll();
	}
	
	@GetMapping("/districts/{id}")
	public List<Districts> getById(@PathVariable("id")int id) {
		return districtservice.findByProvinceId(id);
	}
	
	@GetMapping("/subdistricts/{districtid}/{provinceId}")
	public List<Subdistricts> getById(@PathVariable("districtId") int districtId,@PathVariable("provinceId")int provinceId) {
		return subdistrictservice.findByAndDistrictsId(districtId, provinceId);
	}
}
