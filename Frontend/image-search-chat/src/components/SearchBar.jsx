import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [dateTime, setDateTime] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({ from, to, dateTime });
  };

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <input
        type="text"
        placeholder="From"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        placeholder="To"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="datetime-local"
        value={dateTime}
        onChange={(e) => setDateTime(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        Search Rides
      </button>
    </form>
  );
};

export default SearchBar;
