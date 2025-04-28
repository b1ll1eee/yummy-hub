package th.ac.ku.kps.eng.cpe.controller;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.github.pheerathach.ThaiQRPromptPay;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

import io.jsonwebtoken.Claims;
import th.ac.ku.kps.eng.cpe.auth.JwtUtil;
import th.ac.ku.kps.eng.cpe.model.Orders;
import th.ac.ku.kps.eng.cpe.model.User;
import th.ac.ku.kps.eng.cpe.response.QRCodeResponse;
import th.ac.ku.kps.eng.cpe.service.EncryptionServices;
import th.ac.ku.kps.eng.cpe.service.OrdersServices;
import th.ac.ku.kps.eng.cpe.service.UserServices;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class PaymentController {
	
	@Autowired
    private JwtUtil jwtUtil;
	
	@Autowired
	private OrdersServices orderservice;
	
	@Autowired
	private EncryptionServices encryptionservice;
	
	@Autowired
	private UserServices userservice;
	
	@PostMapping("auth/generatepromptpayqrcode")
	public QRCodeResponse generatePromptpayQRCode(@RequestHeader("Authorization") String token,@RequestBody Orders[] ordersRequest) throws Exception {
		String jwtToken = token.replace("Bearer ", "");
		Claims claims = jwtUtil.parseJwtClaims(jwtToken);
		String username = (String) claims.get("username");
		User user = userservice.findByUserId(encryptionservice.encrypt(username));
		QRCodeResponse reps = new QRCodeResponse();
		if (user != null && user.getRole().equals("customer")) {
			List<Orders> orders = new ArrayList<Orders>();
			for (Orders order : ordersRequest) {
				orders.add(orderservice.findById(order.getOrderId()));
			}
			BigDecimal total = new BigDecimal(0);
			for (Orders order : orders) {
				total = total.add(order.getTotalAmount());
			}
			ThaiQRPromptPay qrcode = new ThaiQRPromptPay.Builder().dynamicQR().creditTransfer().mobileNumber("0955523541").amount(total).build();
			reps.setResults("data:image/png;base64,"+qrcode.drawToBase64(300, 300));
			reps.setMsg("create");
			reps.setStatus(HttpStatus.CREATED);
		}
		else {
			reps.setMsg("Unauthorized");
			reps.setStatus(HttpStatus.UNAUTHORIZED);
		}
		return reps;
	}
	
	@PostMapping("auth/generatepickupqrcode")
	public QRCodeResponse generatePickupQRCode(@RequestHeader("Authorization") String token,@RequestBody Orders orderRequest) throws Exception {
		String jwtToken = token.replace("Bearer ", "");
		Claims claims = jwtUtil.parseJwtClaims(jwtToken);
		String username = (String) claims.get("username");
		User user = userservice.findByUserId(encryptionservice.encrypt(username));
		QRCodeResponse reps = new QRCodeResponse();
		if (user != null && user.getRole().equals("customer")) {
			Orders order = orderservice.findById(orderRequest.getOrderId());
			if(order.getPickupCode()==null) {
				reps.setResults(null);
			}
			else {
				QRCodeWriter qrCodeWriter = new QRCodeWriter();
				BitMatrix bitMatrix = qrCodeWriter.encode(order.getPickupCode(), BarcodeFormat.QR_CODE, 300, 300);
				ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
				MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
				byte[] imageBytes = outputStream.toByteArray();
				String base64Image = Base64.getEncoder().encodeToString(imageBytes);
				
				reps.setResults("data:image/png;base64,"+base64Image);				
			}
			reps.setMsg("create");
			reps.setStatus(HttpStatus.CREATED);
		}
		else {
			reps.setMsg("Unauthorized");
			reps.setStatus(HttpStatus.UNAUTHORIZED);
		}
		return reps;
	}
}
