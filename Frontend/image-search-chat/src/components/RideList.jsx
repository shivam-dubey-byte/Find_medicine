import { useEffect, useState } from 'react';
import { db } from '../firebase/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import RideCard from './RideCard';

const RideList = ({ searchParams }) => {
  const [rides, setRides] = useState([]);

  useEffect(() => {
    const fetchRides = async () => {
      const { from, to, dateTime } = searchParams;
      const q = query(
        collection(db, 'rides'),
        where('from', '==', from),
        where('to', '==', to),
        where('dateTime', '>=', new Date(dateTime).setHours(-2)),
        where('dateTime', '<=', new Date(dateTime).setHours(2))
      );
      const querySnapshot = await getDocs(q);
      setRides(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    if (searchParams.from && searchParams.to && searchParams.dateTime) {
      fetchRides();
    }
  }, [searchParams]);

  return (
    <div className="space-y-4">
      {rides.map((ride) => (
        <RideCard key={ride.id} ride={ride} />
      ))}
    </div>
  );
};

export default RideList;
