import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useState, useEffect } from 'react';

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 6,
    slidesToSlide: 6 // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2 // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1 // optional, default to 1.
  }
};

function PodcastCarousel() {
  const [content, setContent] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://podcast-api.netlify.app/shows");
        if (!response.ok) {
          throw new Error("Network error");
        }
        const data = await response.json();
        setContent(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching podcast data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Carousel
      swipeable={true}
      draggable={false}
      showDots={true}
      responsive={responsive}

      infinite={true}

     customTransition="all .5"

      containerClass="carousel-container"
      removeArrowOnDeviceType={["tablet", "mobile"]}
      deviceType="desktop" // Assuming default to desktop if not specified
      dotListClass="custom-dot-list-style"
      itemClass="carousel-item-padding-40-px"
    >
      {content.map((podcast, index) => (
        <div key={index}>
          <img src={podcast.image} alt={podcast.title} style={{ borderRadius: "10px" , width: "150px" , height: "150px" }} />
          <p>{podcast.title}</p>
        </div>
      ))}
    </Carousel>
  );
}

export default PodcastCarousel;
