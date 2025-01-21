import React from "react";

// Props Type for PostCard
interface PostCardProps {
  title: string;
  description: string;
}

// PostCard Component
const PostCard: React.FC<PostCardProps> = ({ title, description }) => {
  return (
    <div className="p-4 border rounded-lg shadow hover:shadow-lg transition-shadow">
      <h2 className="text-lg font-bold mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
      <button className="mt-4 text-blue-500 hover:underline">Read More</button>
    </div>
  );
};

export default PostCard;
