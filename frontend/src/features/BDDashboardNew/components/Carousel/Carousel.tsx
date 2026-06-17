import React from 'react';
import { CCarousel, CCarouselItem, CImage } from '@coreui/react';
import img from '../../../images/Calendar.png';
import backgroundimg from '../../../images/backgroundimg.png';
import desktopimg from '../../../images/Desktop - 3.png';

export const CarouselCrossfadeExample = () => {
  return (
    <CCarousel controls transition="crossfade">
      {/* <CCarouselItem>
        <CImage
          className="d-block w-100"
          src={img}
          alt="slide 1"
          style={{ maxHeight: '200px', objectFit: 'contain' }}
        />
      </CCarouselItem> */}
      <CCarouselItem>
        <CImage
          className="d-block w-100"
          src={backgroundimg}
          alt="slide 2"
          style={{ maxHeight: '200px', objectFit: 'contain' }}
        />
      </CCarouselItem>
      <CCarouselItem>
        <CImage
          className="d-block w-100"
          src={desktopimg}
          alt="slide 3"
          style={{ maxHeight: '200px', objectFit: 'contain' }}
        />
      </CCarouselItem>
    </CCarousel>
  );
};
