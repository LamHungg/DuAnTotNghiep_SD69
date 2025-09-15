package com.example.ZMEN.repository;

import com.example.ZMEN.entity.ChatLieu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatLieuRepository extends JpaRepository<ChatLieu, Integer> {

    @Query("SELECT c FROM ChatLieu c " +
            "WHERE (:ten IS NULL OR c.tenChatLieu LIKE %:ten%) " +
            "AND (:trangThai IS NULL OR c.trangThai = :trangThai)")
    List<ChatLieu> searchByTenAndTrangThai(@Param("ten") String ten, @Param("trangThai") Byte trangThai);
}

