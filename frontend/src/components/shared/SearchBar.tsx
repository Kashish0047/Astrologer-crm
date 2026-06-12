import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  debounceMs?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  onSearch,
  debounceMs = 300,
}) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, onSearch, debounceMs]);

  return (
    <div className="relative w-full max-w-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-slate-500" />
      </div>
      <input
        type="text"
        className="input-field pl-9"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
