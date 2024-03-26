import React, { useEffect } from 'react';
// Import the TypingEffect component
import TypingEffect from './TypingEffect'; // Adjust the path as necessary
import AiSvg from '../img/Ai.svg';

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
        <div className="text-center" style={{ paddingTop: "90px" }}>
            <h1 className="display-5 text-uppercase mb-4">
                see our <span className="text-primary">amazing</span> testimonies
            </h1>
    
            {/* Flex container for SVG and paragraph */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Your SVG Image */}
            <img src={AiSvg} alt="AI" className="ai-svg-image" />
    
                {/* Your paragraph */}
                <p style={{ 
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    backgroundImage: 'linear-gradient(90deg, rgb(141, 56, 255), rgb(25, 123, 255))',
                    color: 'transparent',
                    fontWeight: 'bold',
                    fontSize: '34px',
                    margin: 0 // Adjust the font size as needed and remove margin if you want them closer
                }}>
                    AI-generated summary
                </p>
            </div>
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
