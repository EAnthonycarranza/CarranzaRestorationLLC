import React, { useEffect } from 'react';

function Testimonial() {
    function loadRevueWidget() {
        const script = document.createElement("script");
        script.type = "module";
        script.src = "https://widgets.revue.us/2.0/rw-widget-grid.js";
        document.head.appendChild(script);
    }

    useEffect(() => {
        const elfScript = document.createElement('script');
        elfScript.src = "https://static.elfsight.com/platform/platform.js";
        elfScript.async = true;
        elfScript.defer = true;
        document.body.appendChild(elfScript);

        loadRevueWidget();  // Call the function to load the Revue widget

        return () => {
            document.body.removeChild(elfScript);
        }
    }, []);

    return (
        <div>
            <div className="elfsight-app-43145a1a-b618-44bc-bf99-ee3d0714b7b4" data-elfsight-app-lazy></div>
            <div data-rw-grid="38205"></div>  {/* Revue widget div */}
        </div>
    );
}

export default Testimonial;
