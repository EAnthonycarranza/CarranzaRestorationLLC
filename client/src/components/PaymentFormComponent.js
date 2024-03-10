import React, { useState, useEffect } from 'react';

export default function PaymentFormComponent() {
    useEffect(() => {
        // Define the event listener function
        const handleButtonClick = (e) => {
            e.preventDefault();
            
            const url = e.target.getAttribute('data-url');
            const title = 'Square Payment Links';
            const topWindow = window.top ? window.top : window;
            const dualScreenLeft = topWindow.screenLeft !== undefined ? topWindow.screenLeft : window.screenX;
            const dualScreenTop = topWindow.screenTop !== undefined ? topWindow.screenTop : window.screenY;
            const width = topWindow.innerWidth ? topWindow.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : window.screen.width;
            const height = topWindow.innerHeight ? topWindow.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : window.screen.height;
            const systemZoom = width / window.screen.availWidth;
            const left = (width - 500) / 2 / systemZoom + dualScreenLeft;
            const top = (height - (height * 0.75)) / 2 / systemZoom + dualScreenTop;
            const newWindow = window.open(url, title, `scrollbars=yes, width=${500 / systemZoom}, height=${(height * 0.75) / systemZoom}, top=${top}, left=${left}`);
            
            if (window.focus) newWindow.focus();
        };
    
        // Add event listener for the "Pay now" button
        const checkoutButton = document.getElementById('embedded-checkout-modal-checkout-button');
        if (checkoutButton) {
            checkoutButton.addEventListener('click', handleButtonClick);
        }
    
        // Cleanup function to remove event listener
        return () => {
            if (checkoutButton) {
                checkoutButton.removeEventListener('click', handleButtonClick);
            }
        };
    }, []);    
    
    return (
        <div className="container-fluid bg-light py-6 px-5">
            <div className="text-center mx-auto mb-5" style={{ maxWidth: '600px' }}>
                <h1 className="display-5 text-uppercase mb-4">Enter your <span className="text-primary">Payment</span> information</h1>
            </div>
            <div className="row">
                <div className="col-md-6 offset-md-3">
                <p style={{  display: 'flex',
                            flexDirection: 'column',
                                justifyContent: 'flex-end',
                                alignItems: 'center', }}>Please tap the button to input the specific amount owed.</p>
                    <div className="bg-light p-4 rounded">

                        <form style={{  display: 'flex',
                            flexDirection: 'column',
                                justifyContent: 'flex-end',
                                alignItems: 'center', }}>
                            {/* Your existing form fields here */}
    
                            {/* Square Pay Now Button */}
                            <div style={{
                                overflow: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                width: '259px',
                                border: '1px solid rgba(0, 0, 0, 0.1)',
                                boxShadow: '-2px 10px 5px rgba(0, 0, 0, 0)',
                                borderRadius: '10px',
                                fontFamily: 'Libre Franklin, SQ Market, Helvetica, Arial, sans-serif',
                                margin: '20px 0' // Added margin for spacing
                            }}>
                                <div style={{ padding: '20px' }}>
                                    <a id="embedded-checkout-modal-checkout-button" target="_blank" data-url="https://square.link/u/kYOJlMjE?src=embd" href="https://square.link/u/kYOJlMjE?src=embed" style={{
                                        display: 'inline-block',
                                        fontSize: '18px',
                                        lineHeight: '48px',
                                        height: '48px',
                                        color: '#ffffff',
                                        minWidth: '212px',
                                        backgroundColor: '#FD5D14',
                                        textAlign: 'center',
                                        boxShadow: '0 0 0 1px rgba(0,0,0,.1) inset',
                                        borderRadius: '0px',
                                    }}>Pay now</a>
                                    <i className="fa-solid fa-credit-card" style={{ paddingRight: '5px' }}></i>
                                 <i className="fab fa-cc-apple-pay" style={{ paddingRight: '5px' }}></i><i class="fab fa-google-pay"></i>
                                </div>
                            </div>
                        </form>
                        <p id="contact-info" className="mb-4">Having issue with card payment? Contact us at: <a href="tel:210-267-1008">210-267-1008</a></p>
                    </div>
                </div>
            </div>
        </div>
    );    
}
