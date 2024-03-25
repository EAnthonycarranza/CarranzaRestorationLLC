import React, { useEffect } from 'react';
// Import the TypingEffect component
import TypingEffect from './TypingEffect'; // Adjust the path as necessary

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

            {/* Place the TypingEffect component here */}
            <i className="fa-solid fa-robot" style={{ color: "#FD5D14", fontSize: "32px" }}></i>

            <p style={{ 
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                backgroundImage: "linear-gradient(90deg, rgb(141, 56, 255), rgb(25, 123, 255))",
                color: "transparent",
                fontWeight: "bold",
                fontSize: "34px" // Adjust the font size as needed
            }}>AI-generated summary</p>
<p>
    Based on 
    <span style={{ color: "#FD5D14" }}> 26 Google Reviews </span> 
    and 
    <span style={{ color: "#FD5D14" }}> 51 Angi Reviews</span>
</p>
            <TypingEffect />

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
