const axios = require('axios');

const geocodeAddress = async (address) => {
    try {
        console.log(`Geocoding address: ${address}`);
        
        // Clean and improve the address
        const cleanAddress = address
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase();
        
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
                q: cleanAddress,
                format: 'json',
                limit: 5, // Get more results to find the best match
                countrycodes: 'in',
                'accept-language': 'en',
                addressdetails: 1 // Get detailed address components
            },
            headers: {
                'User-Agent': 'Wanderlust-App/1.0',
                'Referer': 'https://yourdomain.com'
            },
            timeout: 15000
        });

        if (response.data && response.data.length > 0) {
            // Find the best result (prioritize cities, towns, villages)
            const bestResult = findBestResult(response.data, cleanAddress);
            
            const geocodedData = {
                latitude: parseFloat(bestResult.lat),
                longitude: parseFloat(bestResult.lon),
                formattedAddress: bestResult.display_name,
                country: bestResult.address?.country || 'India',
                city: bestResult.address?.city || bestResult.address?.town || 
                      bestResult.address?.village || bestResult.address?.county || 'Unknown',
                importance: parseFloat(bestResult.importance)
            };
            
            console.log('✅ Geocoding successful:', {
                coordinates: `${geocodedData.latitude}, ${geocodedData.longitude}`,
                city: geocodedData.city,
                importance: geocodedData.importance
            });
            
            return geocodedData;
        }
        
        console.log('❌ No geocoding results found for:', address);
        return null;
        
    } catch (error) {
        console.error('Geocoding error:', error.message);
        return null;
    }
};

// Helper function to find the best geocoding result
function findBestResult(results, originalAddress) {
    // Sort by importance (higher is better)
    const sortedResults = results.sort((a, b) => parseFloat(b.importance) - parseFloat(a.importance));
    
    // Try to find exact city/town matches
    for (let result of sortedResults) {
        const address = result.address;
        const type = result.type;
        
        // Prioritize cities, towns, villages
        if (type === 'city' || type === 'town' || type === 'village') {
            console.log(`🏆 Found ${type}: ${result.display_name}`);
            return result;
        }
        
        // Check if address contains city/town that matches our query
        if (address?.city || address?.town || address?.village) {
            const cityName = (address.city || address.town || address.village).toLowerCase();
            if (originalAddress.includes(cityName)) {
                console.log(`📍 Exact city match: ${cityName}`);
                return result;
            }
        }
    }
    
    // Return the most important result if no exact match found
    console.log(`📌 Using most important result: ${sortedResults[0].display_name}`);
    return sortedResults[0];
}

module.exports = geocodeAddress;