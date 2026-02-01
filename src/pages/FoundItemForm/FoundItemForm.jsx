import { useState } from 'react';
import styles from './FoundItemForm.module.css';
import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';
import apiService from "../../Services/ApiServices";

const FoundItemForm = () => {
    const [formData, setFormData] = useState({
        item_type: 'found', // Backend requirements
        item_name: '',
        description: '',
        contact_info: '', // New field
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
            dataToSubmit.append('image', formData.item_image); // Backend expectation: 'image'
        }

        try {
            const result = await apiService.submitFoundItem(dataToSubmit);
            
            if (result.tracking_token) {
                setToken(result.tracking_token);
                setShowModal(true);
            }

            // Form Reset
            setFormData({
                item_type: 'found',
                item_name: '',
                description: '',
                contact_info: '',
                item_image: null,
            });

        } catch (err) {
            console.error('Error while submitting the form', err);
            setError(err.message || 'Error submitting the form');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>Found Item Listing</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <InputField
                    label="Item Name"
                    id="item_name"
                    name="item_name" 
                    value={formData.item_name}
                    onChange={handleChange}
                    placeholder="ID card/Wallet/Bag"
                    required
                />
                
                <InputField
                    label="Contact Number"
                    id="contact_info"
                    name="contact_info"
                    type="text"
                    value={formData.contact_info}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    required
                />

                <InputField
                    label="Description"
                    id="description"
                    name="description"
                    type="textarea"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Where did you find it?"
                    rows="5"
                    required
                />

                <InputField
                    label="Upload Item Image"
                    id="item_image"  
                    name="item_image" 
                    type="file"
                    onChange={handleChange}
                    accept="image/*"
                />

                <Button type="submit" variant="found-submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Found Item'}
                </Button>

                {error && <p style={{ color: 'red', marginTop: '10px' }}>Error: {error}</p>}
            </form>

            {/* Modal for Token Display */}
            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.successIcon}>✔</div>
                        <h3>Success!</h3>
                        <p>Found item recorded successfully.</p>
                        <div className={styles.tokenBox}>
                            <small>Your Search Token:</small>
                            <p className={styles.tokenText}>{token}</p>
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

export default FoundItemForm;