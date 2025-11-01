// utils/geocoder.js
const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'openstreetmap',
  // You can also use other free providers:
  // provider: 'locationiq', // Need free API key
  // provider: 'mapquest',   // Need free API key
  // provider: 'here',       // Need free API key
};

const geocoder = NodeGeocoder(options);

const geocodeAddress = async (address) => {
  try {
    console.log(`Geocoding address: ${address}`);
    
    const res = await geocoder.geocode(address);
    
    if (res && res[0]) {
      const result = {
        latitude: res[0].latitude,
        longitude: res[0].longitude,
        formattedAddress: res[0].formattedAddress,
        country: res[0].country,
        city: res[0].city
      };
      
      console.log(`Geocoding successful:`, result);
      return result;
    } else {
      console.log('No results found for address:', address);
      return null;
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

module.exports = geocodeAddress;