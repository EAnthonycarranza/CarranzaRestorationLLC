import React from 'react';
// Removed unused imports Topbar and Navbar
import PageHeader from './PageHeader';
import BlogCreator from './BlogCreator';

function BlogCreatorPage() {
  return (
    <div>
      <PageHeader title="Blog Creator" header="BlogCreator"/>
      <BlogCreator />
    </div>
  );
}

export default BlogCreatorPage;
