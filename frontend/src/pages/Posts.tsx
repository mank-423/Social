import PostCard from "../components/PostCard/PostCard";


// Type for a single post
interface Post {
  id: number;
  title: string;
  description: string;
}

// Posts Component
const Posts: React.FC = () => {
  // Static data for posts
  const posts: Post[] = [
    {
      id: 1,
      title: "Post 1",
      description: "This is the description for Post 1.",
    },
    {
      id: 2,
      title: "Post 2",
      description: "This is the description for Post 2.",
    },
    {
      id: 3,
      title: "Post 3",
      description: "This is the description for Post 3.",
    },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar */}
      <div className="w-1/4 p-4 bg-gray-100 border-r">
        <h2 className="text-lg font-bold mb-4">Sidebar</h2>
        <ul>
          <li className="mb-2 cursor-pointer hover:underline">Category 1</li>
          <li className="mb-2 cursor-pointer hover:underline">Category 2</li>
          <li className="mb-2 cursor-pointer hover:underline">Category 3</li>
        </ul>
      </div>

      {/* Posts Section */}
      <div className="w-3/4 p-4">
        <h1 className="text-2xl font-bold mb-6">Posts</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} title={post.title} description={post.description} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Posts;
