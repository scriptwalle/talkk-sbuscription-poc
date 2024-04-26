import React, { useState } from 'react';
import axios from 'axios';

import './App.css'
import ResponseWindow from './responsewindow';

const MyComponent = () => {
    const [formData, setFormData] = useState({
        ssl_first_name: '',
        ssl_last_name: '',
        ssl_avs_address: '',
        ssl_avs_zip: '',
        ssl_invoice_number: '',
        ssl_amount: '',
    });
    const [response, setResponse] = useState({
        type: '',
        data: '',
        successData: null
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleButtonClick = async () => {
        try {
            const response = await axios.post('http://localhost:3001/get-ssl-txn-auth-token', formData);
            const sessionToken = response.data;
            openLightbox(sessionToken);
        } catch (error) {
            console.error('Error fetching auth token:', error);
        }
    };

    const openLightbox = (sessionToken) => {
        if (window.PayWithConverge && sessionToken) {
            window.PayWithConverge.open(
                { ssl_txn_auth_token: sessionToken },
                {
                    onError: handleResponse('error', 'error'),
                    onCancelled: handleResponse('cancelled', 'cancelled'),
                    onDeclined: handleResponse('declined', response => JSON.stringify(response, null, '\t')),
                    onApproval: handleResponse('approval', response => {
                        setResponse({
                            type: 'approval',
                            data: JSON.stringify(response, null, '\t'),
                            successData: response
                        });
                    }),
                }
            );
        } else {
            console.error('PayWithConverge is not available');
        }
    };

    const handleResponse = (type, dataCallback) => (response) => {
        console.log(`on${type.charAt(0).toUpperCase() + type.slice(1)}, response: `, response);
        if (typeof dataCallback === 'function') {
            setResponse({ type, data: dataCallback(response), successData: type === 'approval' ? response : null });
        } else {
            setResponse({ type, data: '', successData: null });
        }
    };
    

    return (
        <div className="container">
            {Object.entries(formData).map(([key, value]) => (
                <div className="input-container" key={key}>
                    <label className="label">{key.replace('ssl_', '').replace(/_/g, ' ').toUpperCase()}:</label>
                    <input
                        type="text"
                        name={key}
                        value={value}
                        onChange={handleInputChange}
                    />
                </div>
            ))}
            <button className="blue-button" onClick={handleButtonClick}>Pay with Converge</button>

            {response.type && response.data && (
                <ResponseWindow
                    type={response.type}
                    data={response.data}
                    successData={response.successData}
                />
            )}
        </div>
    );
};

export default MyComponent;
