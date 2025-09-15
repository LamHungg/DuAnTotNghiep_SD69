package com.example.ZMEN.repository;


import com.example.ZMEN.entity.KichCo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KichCoRepository extends JpaRepository<KichCo, Integer> {

    @Query("SELECT k FROM KichCo k " +
            "WHERE (:tenKichCo IS NULL OR k.tenKichCo LIKE %:tenKichCo%) " +
            "AND (:trangThai IS NULL OR k.trangThai = :trangThai)")
    List<KichCo> searchByTenAndTrangThai(@Param("tenKichCo") String tenKichCo,
                                         @Param("trangThai") Byte trangThai);
}
