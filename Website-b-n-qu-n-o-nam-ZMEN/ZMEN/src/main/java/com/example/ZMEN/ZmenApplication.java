package com.example.ZMEN;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling

public class ZmenApplication {

    public static void main(String[] args) {
        SpringApplication.run(ZmenApplication.class, args);
    }

}
