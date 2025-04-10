import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const RichTextEditor: React.FC = () => {
  const [editorData, setEditorData] = useState<string>('');

  const handleSave = () => {
    if (!editorData.trim()) {
      alert('Editor is empty. Please write something before saving.');
      return;
    }
  
    const title = prompt('Enter a title for your post:');
    if (!title) return;
  
    const existingPosts = JSON.parse(localStorage.getItem('posts') || '[]');
  
    const newPost = {
      id: Date.now(),
      title,
      content: editorData,
      createdAt: new Date().toISOString(),
    };
  
    existingPosts.push(newPost);
    localStorage.setItem('posts', JSON.stringify(existingPosts));
  
    alert('Post saved successfully!');
  };
  

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Write your content below:</h2>
      <CKEditor
        editor={ClassicEditor as any}
        data={editorData} // initial content
        onChange={(_, editor) => {
          const data = editor.getData();
          setEditorData(data);
          console.log('Editor Data:', data); // view in console
        }}
      />
      <button
        onClick={handleSave}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Save Content
      </button>
      <div className="mt-4">
        <h3 className="text-md font-semibold">Live Preview:</h3>
        <div
          className="border p-4 mt-2 bg-white"
          dangerouslySetInnerHTML={{ __html: editorData }}
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
