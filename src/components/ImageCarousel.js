import React, { useEffect, useRef } from "react";

const ImageCarousel = ({ images, carouselId }) => {
  const carouselRef = useRef(null);

  useEffect(() => {
    // Wait for Bootstrap to be available
    const initCarousel = () => {
      if (
        window.bootstrap &&
        window.bootstrap.Carousel &&
        carouselRef.current
      ) {
        try {
          const carouselInstance = new window.bootstrap.Carousel(
            carouselRef.current,
            {
              interval: 2000,
              ride: true,
              wrap: true,
              touch: false,
            }
          );

          // Start the carousel immediately
          carouselInstance.cycle();

          // Cleanup function to dispose of the carousel instance when the component unmounts
          return () => {
            if (carouselInstance) {
              carouselInstance.pause();
              carouselInstance.dispose();
            }
          };
        } catch (error) {
          console.warn("Failed to initialize Bootstrap Carousel:", error);
        }
      }
    };

    // Try to initialize immediately
    let cleanup = initCarousel();

    // If Bootstrap is not ready, wait a bit and try again
    if (!window.bootstrap) {
      const timer = setTimeout(() => {
        cleanup = initCarousel();
      }, 100);

      return () => {
        clearTimeout(timer);
        if (cleanup) cleanup();
      };
    }

    return cleanup;
  }, [images]); // Re-initialize if images change

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div
      ref={carouselRef}
      id={carouselId}
      className="carousel slide"
      data-bs-ride="carousel"
      data-bs-interval="2000"
      style={{ maxWidth: "120px", margin: "auto" }}
    >
      <div className="carousel-inner">
        {images.map((img, index) => (
          <div
            key={index}
            className={`carousel-item ${index === 0 ? "active" : ""}`}
          >
            <img
              src={img}
              className="d-block w-100"
              alt={`slide ${index + 1}`}
              style={{
                height: "120px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target={`#${carouselId}`}
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target={`#${carouselId}`}
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;
