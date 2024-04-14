import React from 'react';
import PageHeader from './PageHeader.js'; // Adjust the path as necessary
import Blog from './Blog';     // Adjust the path as necessary

function BlogPage() {
  return (
    <div>
      {/* PageHeader component with a title */}
      <PageHeader title="Blog" header="Blog"/>

      {/* Testimonial component */}
      <Blog />
    </div>
  );
}

export default BlogPage;
