const RideCard = ({ ride }) => {
  return (
    <div className="p-4 border rounded shadow">
      <h3 className="text-xl font-bold">{ride.from} to {ride.to}</h3>
      <p>Departure: {new Date(ride.dateTime).toLocaleString()}</p>
      <p>Seats Available: {ride.seats}</p>
    </div>
  );
};

export default RideCard;
