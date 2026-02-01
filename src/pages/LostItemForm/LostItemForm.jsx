import { useState } from 'react';
import styles from './LostItemForm.module.css';
import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';
import apiService from '../../Services/ApiServices';

const LostItemForm = () => {
  const [formData, setFormData] = useState({
    item_type: 'lost',
    item_name: '',
    description: '',
    contact_info: '',
    item_image: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); 
  const [token, setToken] = useState(''); 

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const dataToSubmit = new FormData();
    dataToSubmit.append('item_type', formData.item_type);
    dataToSubmit.append('item_name', formData.item_name);
    dataToSubmit.append('description', formData.description);
    dataToSubmit.append('contact_info', formData.contact_info);
    if (formData.item_image) {
      dataToSubmit.append('image', formData.item_image);
    }

    try {
      const result = await apiService.submitLostItem(dataToSubmit);
      
      
      if (result.tracking_token) {
        setToken(result.tracking_token);
        setShowModal(true); 
      }

      // ফর্ম রিসেট
      setFormData({
        item_type: 'lost',
        item_name: '',
        description: '',
        contact_info: '',
        item_image: null,
      });
    } catch (err) {
      setError(err.message || 'Error submitting the form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Lost Item Listing</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <InputField label="Item Name" name="item_name" value={formData.item_name} onChange={handleChange} placeholder="ID card/Wallet/Bag" required />
        <InputField label="Contact Number" name="contact_info" value={formData.contact_info} onChange={handleChange} placeholder="Enter your Phnone Number" required />
        <InputField label="Description" name="description" type="textarea" value={formData.description} onChange={handleChange} placeholder="Where did you lost it?" required />
        <InputField label="Upload Image" name="item_image" type="file" onChange={handleChange} />
        
        <Button type="submit" variant="lost-submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Lost Item'}
        </Button>

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>

      {/* --- Modal Section --- */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Success!</h3>
            <p>Your item has been listed.</p>
            <div className={styles.tokenBox}>
              <strong>Your Search Token:</strong>
              <span className={styles.tokenText}>{token}</span>
            </div>
            <button 
              className={styles.closeBtn} 
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LostItemForm;