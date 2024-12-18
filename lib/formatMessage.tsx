import React from 'react';

export function formatMessage(content: string) {
  // Split the content into paragraphs
  const paragraphs = content.split('\n\n');

  return paragraphs.map((paragraph, index) => {
    // Replace ** with <strong> tags
    paragraph = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Replace * with <em> tags
    paragraph = paragraph.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Create React elements for each paragraph
    return (
      <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} className="mb-4" />
    );
  });
}
