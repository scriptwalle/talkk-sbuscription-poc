import { useEffect, useState } from "react"

import logo from '../assets/logo.jpg'

const App = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contact: '',
    })

    useEffect(() => {
        const loadRazorpayScript = () => {
            const script = document.createElement('script')
            script.src = 'https://checkout.razorpay.com/v1/checkout.js'
            script.async = true
            document.body.appendChild(script)

            return () => {
                document.body.removeChild(script)
            }
        }

        loadRazorpayScript()
    }, [])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    const handlePayment = async () => {
        const { name, email, contact } = formData

        const options = {
            key: 'rzp_test_K6bAA8NZt1in72',
            subscription_id: 'sub_NzdESqCWFiiT2g',
            name: 'Graymatrix',
            description: 'Monthly Plan',
            image: logo,
            callback_url: 'http://localhost:3001/razorpay',
            prefill: {
                name,
                email,
                contact: `+91${contact}`
            },
            notes: {
                note_key_1: 'Chat Bot',
                note_key_2: 'another chat bot'
            },
            theme: {
                color: '#FFDEOO'
            }
        }

        const razorpay = new window.Razorpay(options)

        razorpay.on('payment.failed', (response) => {
            console.log('Error code: ', response.error.code)
            console.log('Error descriptin: ',response.error.description)
            console.log('Error source: ',response.error.source)
            console.log('Error step: ',response.error.step)
            console.log('Error reason: ',response.error.reason)
            console.log('Error metadata.order_id: ',response.error.metadata.order_id)
            console.log('Error metadata.payment_id: ',response.error.metadata.payment_id)
        })

        razorpay.open()
    }

    return (
        <div className='container'>
            {Object.entries(formData).map(([key, value]) => (
                <div className="input-container" key={key}>
                    <label className="label">
                        {key.replace('ssl_', '').replace(/_/g, ' ').toUpperCase()}:
                    </label>
                    <input
                        type="text"
                        name={key}
                        value={value}
                        onChange={handleInputChange}
                    />
                </div>
            ))}

            <button
                className="razor-btn"
                id="rzp-button"
                onClick={handlePayment}
            >
                Pay
            </button>
        </div>

    )
}

export default App