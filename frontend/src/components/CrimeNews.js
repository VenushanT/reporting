import React, { useEffect, useState } from 'react';

// You can replace this with a real API call
const mockNews = [
  {
    title: 'Major Theft Reported in Downtown Area',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    url: '#',
    description: 'Authorities are investigating a major theft that occurred in the downtown shopping district late last night.'
  },
  {
    title: 'Police Crack Down on Vandalism',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
    url: '#',
    description: 'A new initiative aims to reduce vandalism in public parks and spaces across the city.'
  },
  {
    title: 'Community Rallies Against Rising Crime',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    url: '#',
    description: 'Local residents are coming together to address the recent increase in crime rates.'
  },
];

function CrimeNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setNews(mockNews);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-primary-400 mb-4">Current Crime Trend News</h2>
      {loading ? (
        <div className="text-gray-400">Loading news...</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {news.map((item, idx) => (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              key={idx}
              className="block bg-gray-800 rounded-xl shadow-lg border border-gray-700 hover:shadow-2xl transition-shadow overflow-hidden"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-40 object-cover object-center"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-primary-300 mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-gray-300 text-sm line-clamp-3">{item.description}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default CrimeNews; 