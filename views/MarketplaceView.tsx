
import React, { useState } from 'react';
import { MOCK_PRODUCTS, SKILLS } from '../constants';
import { Product } from '../types';

const MarketplaceView: React.FC = () => {
    const [selectedSkillId, setSelectedSkillId] = useState<number | null>(null);

    const filteredProducts = selectedSkillId
        ? MOCK_PRODUCTS.filter(p => p.skillId === selectedSkillId)
        : MOCK_PRODUCTS;
        
    return (
        <div>
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Marketplace</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">Tools and courses to accelerate your learning journey.</p>
            </div>

            <div className="mb-8">
                <div className="flex flex-wrap justify-center gap-2">
                    <button
                        onClick={() => setSelectedSkillId(null)}
                        className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${!selectedSkillId ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    >
                        All
                    </button>
                    {SKILLS.map(skill => (
                        <button
                            key={skill.id}
                            onClick={() => setSelectedSkillId(skill.id)}
                            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${selectedSkillId === skill.id ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                            {skill.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {filteredProducts.map(product => (
                    <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col group">
                        <div className="relative overflow-hidden">
                            <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-110" />
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex-grow">{product.name}</h3>
                            <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">{product.price}</p>
                            <a 
                                href={product.amazonUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="w-full text-center bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors"
                            >
                                View on Amazon
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MarketplaceView;
