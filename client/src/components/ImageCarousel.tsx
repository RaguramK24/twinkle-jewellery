import React, { useState } from 'react';
import { getImageUrl } from '../utils/formatters';

interface ImageCarouselProps {
  images: string[];
  alt: string;
  className?: string;
  showControls?: boolean;
  showDots?: boolean;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  alt,
  className = '',
  showControls = true,
  showDots = true
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // If no images, show placeholder
  if (!images || images.length === 0) {
    return (
      <div className={`image-carousel-placeholder ${className}`}>
        No Image Available
      </div>
    );
  }

  // If only one image, show it without controls
  if (images.length === 1) {
    return (
      <div className={`image-carousel single-image ${className}`}>
        <img
          src={getImageUrl(images[0])}
          alt={alt}
          className="carousel-image"
        />
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className={`image-carousel ${className}`}>
      <div className="carousel-container">
        <img
          src={getImageUrl(images[currentIndex])}
          alt={`${alt} ${currentIndex + 1}`}
          className="carousel-image"
        />
        
        {showControls && images.length > 1 && (
          <>
            <button
              className="carousel-control carousel-control-prev"
              onClick={goToPrevious}
              aria-label="Previous image"
              type="button"
            >
              <span className="carousel-arrow">❮</span>
            </button>
            <button
              className="carousel-control carousel-control-next"
              onClick={goToNext}
              aria-label="Next image"
              type="button"
            >
              <span className="carousel-arrow">❯</span>
            </button>
          </>
        )}
      </div>
      
      {showDots && images.length > 1 && (
        <div className="carousel-dots">
          {images.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to image ${index + 1}`}
              type="button"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;