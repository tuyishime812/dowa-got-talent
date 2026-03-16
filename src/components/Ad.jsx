import { useEffect, useRef } from 'react';
import './Ad.css';

const Ad = ({ 
  slot, 
  format = 'auto', 
  fullWidthResponsive = true,
  className = '' 
}) => {
  const adRef = useRef(null);
  const isAdLoaded = useRef(false);

  useEffect(() => {
    // Only push ad once
    if (isAdLoaded.current) return;
    
    try {
      // Push ad to AdSense queue
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      isAdLoaded.current = true;
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  if (!slot) {
    return (
      <div className={`ad-placeholder ${className}`}>
        <span>Ad Slot Required</span>
      </div>
    );
  }

  return (
    <div className={`ad-container ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-7927035849256499"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={fullWidthResponsive}
      />
    </div>
  );
};

export default Ad;
