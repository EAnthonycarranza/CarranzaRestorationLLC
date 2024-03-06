import React, { useEffect } from 'react';

function Testimonial() {
    function loadRevueWidget() {
        const script = document.createElement("script");
        script.type = "module";
        script.src = "https://widgets.revue.us/2.0/rw-widget-grid.js";
        document.head.appendChild(script);
    }

    useEffect(() => {
        // Load the Revue widget
        loadRevueWidget();

        // Create a script element for Trust.Reviews widget
        const trustScript = document.createElement('script');
        trustScript.src = "https://cdn.trust.reviews/widget/embed.min.js";
        trustScript.defer = true;

        // Append the Trust.Reviews script to the body
        document.body.appendChild(trustScript);

        // Clean up the Trust.Reviews script when the component unmounts
        return () => {
            document.body.removeChild(trustScript);
        };
    }, []);

    return (
<div className="text-center" style={{ paddingTop: "90px" }}> {/* Wrapper div with text-centering class */}
            {/* Header for the testimonials section with specific class and margin */}
            <h1 className="display-5 text-uppercase mb-4">see our <span className="text-primary">amazing</span> testimonies</h1>

            <div>
                {/* Revue widget div */}
                <div data-rw-grid="38205"></div>

                {/* Trust.Reviews widget div */}
                <div className="tr-widget" data-id="5309" data-view="flash" data-lang="">
                    <a href="https://trust.reviews/" className="trcr" target="_blank">
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Testimonial;

