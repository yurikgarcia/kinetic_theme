import { useState, useEffect } from 'react';

function useWindowSize(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      const isMobileSize = window.matchMedia("(max-width: 768px)").matches;
      setIsMobile(isMobileSize);
    };

    // Initial check on mount
    handleResize();

    // Listen to window resize events
    window.addEventListener("resize", handleResize);

    // Clean up listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}

export default useWindowSize;
