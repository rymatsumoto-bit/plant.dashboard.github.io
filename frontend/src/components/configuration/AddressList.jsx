import AddressCard from './AddressCard';

export default function AddressList({ addresses, onAddressClick }) {
  if (!addresses || addresses.length === 0) {
    return (
      <div className="card">
        <div>
          <div className="text-center p-5 text-font-light text-sm">No addresses.</div>
        </div>
      </div>
    );
  }

  return (
    <div id="address-list-cards" className="card-address-container">
      {addresses.map((address) => (
        <AddressCard
          key={addresses.address_id}
          address={address}
          onClick={() => onAddressClick(address.address_id)}
        />
      ))}
    </div>
  );
}