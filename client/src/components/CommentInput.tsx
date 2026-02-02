import { useState } from "react";

interface Props {
  onSubmit: (content: string) => void;
}

const CommentInput = ({ onSubmit }: Props) => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit(text);
    setText("");
  };

  return (
    <div className="flex gap-2 mt-3">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        placeholder="Write a comment..."
        className="flex-1 px-3 py-2 border rounded-md text-sm bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 focus:outline-none"
      />
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
      >
        Post
      </button>
    </div>
  );
};

export default CommentInput;
