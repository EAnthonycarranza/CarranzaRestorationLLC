import React, { useEffect } from 'react';

function Review() {
    useEffect(() => {
        // Create a script element for Trust.Reviews widget
        const scriptId = 'trust-reviews-widget-script';
        let script = document.getElementById(scriptId);
        if (!script) {
            script = document.createElement('script');
            script.id = scriptId;
            script.src = "https://cdn.trust.reviews/widget/embed.min.js";
            script.defer = true;
            document.body.appendChild(script);
        }

        // Clean up the script when the component unmounts
        return () => {
            // Remove the script only if it exists
            script = document.getElementById(scriptId);
            if (script) {
                document.body.removeChild(script);
            }
        };
    }, []);

    return (
        <div className="tr-widget" data-id="5310" data-view="flash" data-lang="">
            <a href="https://trust.reviews/" className="trcr" target="_blank">
                Powered by <span>Trust.Reviews</span>
            </a>
        </div>
    );
}

export default Review;
