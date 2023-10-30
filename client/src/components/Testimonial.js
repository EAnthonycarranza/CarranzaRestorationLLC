import React, { useEffect } from 'react';

function Testimonial() {
useEffect(() => {
  const script = document.createElement('script');
  script.src = "https://static.elfsight.com/platform/platform.js";
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);

  return () => {
      document.body.removeChild(script);
  }
}, []);

return (
  <div className="elfsight-app-43145a1a-b618-44bc-bf99-ee3d0714b7b4" data-elfsight-app-lazy></div>
);
}



export default Testimonial;
