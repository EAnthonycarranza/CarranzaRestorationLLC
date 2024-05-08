import React from 'react';
import { FaEnvelope, FaCommentAlt } from 'react-icons/fa';
import { ShareSocial } from 'react-share-social';

const BrowserComponent = () => {
  const onSocialButtonClicked = (socialType) => {
    console.log(`Share button clicked: ${socialType}`);
    // You can add custom logic here if needed
  };

  return (
    <div className="container">
      <div className="content">
        <h1 className="display-5 text-uppercase mb-4" style={{ textAlign: 'center' }}>Digital Business Card</h1>
        <div style={{ backgroundColor: '#F4F6F8', padding: '10px' }}>
          <ShareSocial url="https://renderrush.digital.vistaprint.io/s/TGHEirEaLX3SgUJfu9NlS" socialTypes={['facebook', 'twitter', 'linkedin', 'whatsapp']} onSocialButtonClicked={onSocialButtonClicked} />
          {/* Text message share button */}
          <div>
          <a href={`sms:&body=${encodeURIComponent('Check out this link: https://renderrush.digital.vistaprint.io/s/TGHEirEaLX3SgUJfu9NlS')}`} target="_blank" rel="noopener noreferrer"><FaCommentAlt size={32} style={{ marginLeft: '5px', cursor: 'pointer' }} /></a>
          {/* Email share button */}
          <a href={`mailto:?body=${encodeURIComponent('Check out this link: https://renderrush.digital.vistaprint.io/s/TGHEirEaLX3SgUJfu9NlS')}`} target="_blank" rel="noopener noreferrer"><FaEnvelope size={32} style={{ marginLeft: '5px', cursor: 'pointer' }} /></a>
          </div>
        </div>
        <iframe
          title="Embedded Browser"
          src="https://renderrush.digital.vistaprint.io/s/TGHEirEaLX3SgUJfu9NlS" // Load your desired URL here
          style={{ width: '100%', height: '500px', border: 'none' }}
        ></iframe>
      </div>
    </div>
  );
};

export default BrowserComponent;
