package th.ac.ku.kps.eng.cpe.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import th.ac.ku.kps.eng.cpe.model.Type;
import th.ac.ku.kps.eng.cpe.service.TypeServices;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class TypeController {

	@Autowired
	private TypeServices typeservice;
	
	@GetMapping("/type")
	public List<Type> getAll() {
		return typeservice.findAll();
	}
}
