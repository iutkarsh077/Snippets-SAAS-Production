import { HoverEffect } from "@/components/card-hover-effect";

export function CardHoverEffectDemo() {
  return (
    <div className="max-w-6xl mx-auto px-8">
      <HoverEffect items={projects} />
    </div>
  );
}
export const projects = [
    {
      title: "JavaScript Snippet",
      description:
        "A collection of useful JavaScript code snippets that help with common tasks, such as array manipulation, DOM interaction, and async handling.",
      link: "https://yoursnippetsapp.com/javascript",
    },
    {
      title: "Python Snippet",
      description:
        "Explore Python code snippets covering a range of topics, including data structures, algorithms, and web scraping for your next project.",
      link: "https://yoursnippetsapp.com/python",
    },
    {
      title: "React Snippet",
      description:
        "Find reusable React components and hooks for common functionality, including form handling, routing, and API requests.",
      link: "https://yoursnippetsapp.com/react",
    },
    {
      title: "CSS Snippet",
      description:
        "A variety of CSS snippets for layouts, animations, and responsive design to enhance the visual appeal of your web projects.",
      link: "https://yoursnippetsapp.com/css",
    },
    {
      title: "Node.js Snippet",
      description:
        "Backend-focused Node.js snippets to handle everything from server setup to working with APIs, databases, and real-time applications.",
      link: "https://yoursnippetsapp.com/nodejs",
    },
    {
      title: "SQL Snippet",
      description:
        "Efficient SQL queries and database manipulation snippets that simplify tasks like data retrieval, filtering, and updates.",
      link: "https://yoursnippetsapp.com/sql",
    },
  ];
  