import React from 'react';

interface BrandCardProps {
  name: string;
  image: string;
  description: string;
  price: string;
}

const BrandCard: React.FC<BrandCardProps> = ({ name, image, description, price }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition-shadow">
    <img src={image} alt={name} className="h-16 mb-4 object-contain" />
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{name}</h3>
    <p className="text-gray-600 text-center mb-4">{description}</p>
    <span className="inline-block bg-green-100 text-green-800 font-bold rounded-full px-4 py-1 mb-4">{price}</span>
    <button 
      className="mt-auto text-white font-semibold px-6 py-2 rounded-lg transition-colors"
      style={{
        background: 'linear-gradient(120deg, #0a8a52, #1257c4)',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.1)')}
      onMouseLeave={(e) => (e.currentTarget.style.filter = 'brightness(1)')}
    >
      Subscribe
    </button>
  </div>
);

export default BrandCard; 