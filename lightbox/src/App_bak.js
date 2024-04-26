import { useState } from 'react';
import axios from 'axios';

import './App.css';
import ResponseWindow from './responsewindow';

const MyComponent = () => {
    const [ssl_first_name, setFirstname] = useState('');
    const [ssl_last_name, setLastname] = useState('');
    const [ssl_avs_address, setAddress] = useState('');
    const [ssl_avs_zip, setZip] = useState('');
    const [ssl_invoice_number, setInvoice] = useState('');
    const [ssl_amount, setAmount] = useState('');
    const [responseType, setResponseType] = useState('');
    const [responseData, setResponseData] = useState('');
    const [successData, setSuccessData] = useState(null);

    const handleButtonClick = async () => {
        try {
            const requestBody = {
                ssl_first_name,
                ssl_last_name,
                ssl_avs_address,
                ssl_avs_zip,
                ssl_amount,
                ssl_invoice_number,
            };

            const response = await axios.post('http://localhost:3001/get-ssl-txn-auth-token', requestBody);
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
                    onError: (response) => {
                        console.log('onError, response: ', response)
                        setResponseType('error');
                        setResponseData('error');
                    },
                    onCancelled: (response) => {
                        console.log('onCancelled, response: ', response)
                        setResponseType('cancelled');
                        setResponseData('cancelled');
                    },
                    onDeclined: (response) => {
                        console.log('onDeclined, response: ', response)
                        setResponseType('declined');
                        setResponseData(JSON.stringify(response, null, '\t'));
                    },
                    onApproval: (response) => {
                        console.log('onApproval, response: ', response)
                        setResponseType('approval');
                        setResponseData(JSON.stringify(response, null, '\t'));
                        setSuccessData(response);
                    },
                }
            );
        } else {
            console.error('PayWithConverge is not available');
        }
    };

    return (
        <div className="container">
            <div className="input-container">
                <label className="label">First Name:</label>
                <input type="text" value={ssl_first_name} onChange={(e) => setFirstname(e.target.value)} />
            </div>
            <div className="input-container">
                <label className="label">Last Name:</label>
                <input type="text" value={ssl_last_name} onChange={(e) => setLastname(e.target.value)} />
            </div>
            <div className="input-container">
                <label className="label">Invoice Number:</label>
                <input type="text" value={ssl_invoice_number} onChange={(e) => setInvoice(e.target.value)} />
            </div>
            <div className="input-container">
                <label className="label">Address:</label>
                <input type="text" value={ssl_avs_address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div className="input-container">
                <label className="label">Zip Code:</label>
                <input type="text" value={ssl_avs_zip} onChange={(e) => setZip(e.target.value)} />
            </div>
            <div className="input-container">
                <label className="label">Amount:</label>
                <input type="text" value={ssl_amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <button className="blue-button" onClick={handleButtonClick}>Pay with Converge</button>

            {responseType && responseData && (
                <ResponseWindow
                    type={responseType}
                    data={responseData}
                    successData={successData}
                />
            )}
        </div>
    );
};

export default MyComponent;