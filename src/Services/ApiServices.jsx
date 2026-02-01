const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

const apiService = {
  
  submitFoundItem: async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/upload/found/`, {
        method: 'POST',
        
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Found item upload failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error (Found Item):', error);
      throw error;
    }
  },









  
  submitLostItem: async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/upload/lost/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error uploading lost item');
      }

      return await response.json();
    } catch (error) {
      console.error('API submitLostItem error:', error);
      throw error;
    }
  },



  searchByToken: async (token, count = 5) => {
  try {
    
    const response = await fetch(`${API_BASE_URL}/search/${token}?top_k=${count}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Search failed');
    }

    return await response.json(); 
  } catch (error) {
    console.error('API Error (SearchByToken):', error);
    throw error;
  }
}
  //add more services like submitFoundItem
  
};
export default apiService;
