package th.ac.ku.kps.eng.cpe.auth;

import java.time.LocalTime;
import java.time.ZoneId;
import java.util.Date;

public class test {

	public static void main(String[] args) {

		LocalTime currentTime = LocalTime.now();
		
		Date storeCloseDate = new Date(2023,9,16,15,24,0);
        LocalTime storeCloseTime = storeCloseDate.toInstant().atZone(ZoneId.systemDefault()).toLocalTime();
        LocalTime oneHourBeforeClose = storeCloseTime.minusHours(1);

    	System.out.print(currentTime.isBefore(storeCloseTime) && currentTime.isAfter(oneHourBeforeClose));
	}

}
