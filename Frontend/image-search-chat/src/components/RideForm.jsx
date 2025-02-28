import { useState } from 'react';
import { db } from '../firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const RideForm = () => {
  const { currentUser } = useAuth();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [seats, setSeats] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return alert('Please login to add a ride');

    await addDoc(collection(db, 'rides'), {
      from,
      to,
      dateTime: new Date(dateTime),
      seats,
      userId: currentUser.uid,
    });
    alert('Ride added successfully!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      <input
        type="number"
        placeholder="Seats"
        value={seats}
        onChange={(e) => setSeats(e.target.value)}
        className="w-full p-2 border rounded"
        min="1"
        required
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        Add Ride
      </button>
    </form>
  );
};

export default RideForm;
