import { useState } from 'react';
import { searchGlobalApi } from '../api/landingApi';

const MOCK_RESULTS = {
  'llm': [
    { id: 'nature-machine-intelligence', name: 'Nature Machine Intelligence', type: 'JOURNAL' },
    { id: 'llm-1', name: 'Attention Is All You Need (Transformer Pioneer)', type: 'ARTICLE' },
    { id: 'llm-2', name: 'Llama 3: Open Foundation and Fine-Tuned Chat Models', type: 'ARTICLE' },
    { id: 'llm-3', name: 'IEEE Transactions on Neural Networks and Learning Systems', type: 'JOURNAL' },
    { id: 'llm-4', name: 'Hugo Touvron (LLaMA Lead Author)', type: 'AUTHOR' }
  ],
  'rag': [
    { id: 'rag-1', name: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks', type: 'ARTICLE' },
    { id: 'rag-2', name: 'A Survey on Retrieval-Augmented Text Generation', type: 'ARTICLE' },
    { id: 'rag-3', name: 'Patrick Lewis (RAG Pioneer Author)', type: 'AUTHOR' }
  ],
  'transformer': [
    { id: 'tf-1', name: 'Attention Is All You Need', type: 'ARTICLE' },
    { id: 'tf-2', name: 'ViT: An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale', type: 'ARTICLE' },
    { id: 'tf-3', name: 'Ashish Vaswani (Transformer Author)', type: 'AUTHOR' }
  ],
  'computer vision': [
    { id: 'cv-1', name: 'ResNet: Deep Residual Learning for Image Recognition', type: 'ARTICLE' },
    { id: 'cv-2', name: 'YOLOv8: Real-Time Object Detection and Instance Segmentation', type: 'ARTICLE' },
    { id: 'cv-3', name: 'International Journal of Computer Vision (IJCV)', type: 'JOURNAL' },
    { id: 'cv-4', name: 'Kaiming He (ResNet Author)', type: 'AUTHOR' }
  ],
  'reinforcement learning': [
    { id: 'rl-1', name: 'Playing Atari with Deep Reinforcement Learning (DQN)', type: 'ARTICLE' },
    { id: 'rl-2', name: 'Continuous Control with Deep Reinforcement Learning (DDPG)', type: 'ARTICLE' },
    { id: 'rl-3', name: 'Richard S. Sutton (Reinforcement Learning Book Author)', type: 'AUTHOR' }
  ]
};

const ALL_MOCK_ITEMS = [
  ...MOCK_RESULTS['llm'],
  ...MOCK_RESULTS['rag'],
  ...MOCK_RESULTS['transformer'],
  ...MOCK_RESULTS['computer vision'],
  ...MOCK_RESULTS['reinforcement learning']
];

/**
 * Custom hook to coordinate states and logic for the Sandbox search.
 * It manages search inputs, loading states, and handles fallback simulation
 * when the backend API request fails.
 */
export default function useSandboxSearch() {
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState(null);

  const handleTagClick = (tag) => {
    setSearchValue(tag);
    setSearchResult(null);
    setError(null);
  };

  const handleSearchSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const query = searchValue.trim();
    if (!query) return;

    setIsLoading(true);
    setSearchResult(null);
    setError(null);

    try {
      // Execute the API request through the decoupled API wrapper
      const response = await searchGlobalApi(query);

      if (response.data && response.data.success !== false) {
        const items = response.data.data || [];
        setSearchResult({
          keyword: query,
          items: items,
          isRealData: true,
        });
      } else {
        throw new Error(response.data?.message || 'Invalid backend format');
      }
    } catch (err) {
      console.warn('Backend API search failed, falling back to mock simulation:', err);
      
      // Artificial network latency
      await new Promise(resolve => setTimeout(resolve, 800));

      const normalizedQuery = query.toLowerCase();
      
      // Match direct keyword or partial match in items
      let matchedItems = MOCK_RESULTS[normalizedQuery] || [];
      
      if (matchedItems.length === 0) {
        matchedItems = ALL_MOCK_ITEMS.filter(item => 
          item.name.toLowerCase().includes(normalizedQuery) ||
          item.type.toLowerCase().includes(normalizedQuery)
        );
      }

      setSearchResult({
        keyword: query,
        items: matchedItems,
        isRealData: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    searchValue,
    setSearchValue,
    isLoading,
    searchResult,
    setSearchResult,
    error,
    setError,
    handleTagClick,
    handleSearchSubmit,
  };
}
