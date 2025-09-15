package com.example.ZMEN.controller;


import com.example.ZMEN.dto.HinhAnhSanPhamDTO;
import com.example.ZMEN.service.HinhAnhSanPhamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/hinhanhsanpham")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class HinhAnhSanPhamController {

    @Autowired
    private HinhAnhSanPhamService service;

    @PostMapping
    public HinhAnhSanPhamDTO themHinhAnh(@RequestBody HinhAnhSanPhamDTO dto) {
        return service.addHinhAnh(dto);
    }

    @PutMapping("/{id}")
    public HinhAnhSanPhamDTO suaHinhAnh(@PathVariable Integer id, @RequestBody HinhAnhSanPhamDTO dto) {
        return service.updateHinhAnh(id, dto);
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File không được để trống");
            }

            // Validate file type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body("Chỉ chấp nhận file ảnh");
            }

            // Validate file size (max 5MB)
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest().body("File không được lớn hơn 5MB");
            }

            // Tạo thư mục uploads nếu chưa tồn tại
            String uploadDir = "uploads/";
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Tạo tên file unique
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || originalFilename.isEmpty()) {
                return ResponseEntity.badRequest().body("Tên file không hợp lệ");
            }

            String fileExtension = "";
            if (originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String filename = UUID.randomUUID().toString() + fileExtension;

            // Lưu file
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);

            // Trả về URL để frontend có thể truy cập
            String imageUrl = "http://localhost:8080/uploads/" + filename;
            System.out.println("Uploaded file: " + filename + " -> " + imageUrl);
            return ResponseEntity.ok(imageUrl);

        } catch (IOException e) {
            System.err.println("Upload error: " + e.getMessage());
            return ResponseEntity.badRequest().body("Lỗi upload file: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
            return ResponseEntity.badRequest().body("Lỗi không xác định: " + e.getMessage());
        }
    }

    @PostMapping("/upload-multiple")
    public ResponseEntity<List<String>> uploadMultipleImages(@RequestParam("files") MultipartFile[] files) {
        try {
            List<String> uploadedUrls = new ArrayList<>();

            for (MultipartFile file : files) {
                // Validate file
                if (file.isEmpty()) {
                    continue; // Skip empty files
                }

                // Validate file type
                String contentType = file.getContentType();
                if (contentType == null || !contentType.startsWith("image/")) {
                    continue; // Skip non-image files
                }

                // Validate file size (max 5MB)
                if (file.getSize() > 5 * 1024 * 1024) {
                    continue; // Skip oversized files
                }

                // Tạo thư mục uploads nếu chưa tồn tại
                String uploadDir = "uploads/";
                Path uploadPath = Paths.get(uploadDir);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                // Tạo tên file unique
                String originalFilename = file.getOriginalFilename();
                if (originalFilename == null || originalFilename.isEmpty()) {
                    continue; // Skip files with invalid names
                }

                String fileExtension = "";
                if (originalFilename.contains(".")) {
                    fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
                }
                String filename = UUID.randomUUID().toString() + fileExtension;

                // Lưu file
                Path filePath = uploadPath.resolve(filename);
                Files.copy(file.getInputStream(), filePath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);

                // Thêm URL vào danh sách
                String imageUrl = "http://localhost:8080/uploads/" + filename;
                uploadedUrls.add(imageUrl);
                System.out.println("Uploaded file: " + filename + " -> " + imageUrl);
            }

            return ResponseEntity.ok(uploadedUrls);

        } catch (IOException e) {
            System.err.println("Upload multiple error: " + e.getMessage());
            return ResponseEntity.badRequest().body(new ArrayList<>());
        } catch (Exception e) {
            System.err.println("Unexpected error in multiple upload: " + e.getMessage());
            return ResponseEntity.badRequest().body(new ArrayList<>());
        }
    }
}