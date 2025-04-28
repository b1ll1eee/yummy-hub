package th.ac.ku.kps.eng.cpe.response;

import java.util.List;

import th.ac.ku.kps.eng.cpe.model.Districts;
import th.ac.ku.kps.eng.cpe.model.Provinces;
import th.ac.ku.kps.eng.cpe.model.Subdistricts;

public class LocationResponse {

	private List<Provinces> provinces;
	private List<Districts> districts;
	private List<Subdistricts> subdistricts;
	public List<Districts> getDistricts() {
		return districts;
	}
	public void setDistricts(List<Districts> districts) {
		this.districts = districts;
	}
	public List<Subdistricts> getSubdistricts() {
		return subdistricts;
	}
	public void setSubdistricts(List<Subdistricts> subdistricts) {
		this.subdistricts = subdistricts;
	}
	public List<Provinces> getProvinces() {
		return provinces;
	}
	public void setProvinces(List<Provinces> provinces) {
		this.provinces = provinces;
	}
	
}
