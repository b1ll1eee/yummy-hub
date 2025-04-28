package th.ac.ku.kps.eng.cpe.util;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;

public class FileUploadUtil {
	
	public static String saveFile(String fileName, String type, MultipartFile multipartFile)
            throws IOException {
        Path uploadPath = Paths.get("C:\\image\\Files-Upload\\"+type);
          
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
//		File folder = new File(externalPath + File.separator + type + File.separator);
//		if (!folder.exists()) {
//			folder.mkdirs();
//		}
 
        String randomID = UUID.randomUUID().toString();
        String file=randomID.concat(fileName.substring(fileName.lastIndexOf(".")));
        try (InputStream inputStream = multipartFile.getInputStream()) {
            Path filePath = uploadPath.resolve(file);
            Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ioe) {       
            throw new IOException("Could not save file: " + fileName, ioe);
        }
      
        return file;
    }
}
