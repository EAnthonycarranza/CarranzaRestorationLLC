import React, { useState, useEffect } from 'react';

const TypingEffect = ({
    text = `✓ High-Quality Workmanship and Professionalism: Customers consistently praise the quality of the work completed by Carranza Restoration LLC, mentioning meticulous attention to detail, superior craftsmanship, and a professional demeanor throughout projects. Their services, including roof repair, water damage restoration, and general renovation, are executed with high standards, leading to outstanding final results.\n\n✓ Excellent Customer Service and Communication: Reviews highlight the company's exceptional customer service, emphasizing prompt, clear communication, and responsiveness. The team at Carranza Restoration LLC is noted for being attentive, accommodating, and ensuring clients are informed throughout the process, from initial assessment to project completion.\n\n✓ Reliability and Timeliness: Clients appreciate the company's punctuality and efficiency, with projects completed within agreed timelines. The team is described as hardworking and respectful of clients' properties, ensuring minimal disruption and swift completion of work.\n\n✓ Trustworthiness and Satisfaction Guarantee: The overwhelming satisfaction expressed by customers underscores a trust in Carranza Restoration LLC to handle projects with utmost care and professionalism. The positive experiences, from handling emergency repairs to undertaking extensive renovations, reflect a commitment to ensuring client satisfaction and peace of mind.\n\nCarranza Restoration LLC stands out for its dedication to quality, reliability, and customer-centric approach, making it a highly recommended choice for restoration and renovation projects.`,
    speed = 10
  }) => {
    const [visibleText, setVisibleText] = useState('');
    const [index, setIndex] = useState(0);

 // Adjusted style for the card
 const cardStyle = {
    display: 'flex',
    flexDirection: 'column', // Stack children vertically
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    padding: '20px',
    borderRadius: '5px',
    border: '1px solid #ededed',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: 'auto',
    maxHeight: 'auto', // Limit the height to ensure it fits in the viewport
    overflowY: 'auto', // Enable vertical scrolling if the content exceeds the max height
    margin: '20px auto',
    textAlign: 'left', // Align text to the left for better readability
    lineHeight: '1.5', // Improve line spacing for readability
    whiteSpace: 'pre-wrap' // Ensure that line breaks and spaces are respected
  };

  // Function to parse and style specific parts of the text
  const parseText = (text) => {
    const regex = /(High-Quality Workmanship and Professionalism:|Excellent Customer Service and Communication:|Reliability and Timeliness:|Trustworthiness and Satisfaction Guarantee:)/g;
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (<span key={i} className="highlight">{part}</span>) : part
    );
  };

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setVisibleText(parseText(text.substring(0, index + 1)));
        setIndex((index) => index + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [index, text, speed]);

  return (
    <div style={cardStyle}>
      <div className="typing-effect-container">
        {visibleText}
        <div className="cursor" />
      </div>
    </div>
  );
};

export default TypingEffect;
