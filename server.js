const express = require('express')
const axios = require('axios')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
const PORT = 3001

app.use(cors())
app.use(bodyParser.json())

app.post('/get-ssl-txn-auth-token', async (req, res) => {
    try {
        const {
            ssl_first_name,
            ssl_last_name,
            ssl_amount,
            ssl_avs_address,
            ssl_avs_zip,
            ssl_invoice_number
        } = req.body

        // Replace these placeholders with your actual Converge credentials and API URL
        const ssl_merchant_id = '0021926'
        const ssl_user_id = 'apiuser320273'
        const ssl_pin = '8Q5T5Y0HS1JI4VZOTZKYW8ZPNPW152YZR2801PRIBFSL8Z3AGK3QYDBWG1UB0ZGJ'
        const ssl_vendor_id = 'sc777014'

        // const ssl_transaction_type = 'ccsale'
        const ssl_transaction_type = 'ccaddrecurring'

        const ssl_billing_cycle = 'MONTHLY'
        const ssl_next_payment_date = '05/05/2024'
        const ssl_end_of_month = 'Y'

        // const ssl_card_number = '6210946888090005'
        // const ssl_exp_date = '1224'

        const apiUrl = 'https://api.demo.convergepay.com/hosted-payments/transaction_token'
        const setHeader = 'Content-Type=json'
        const requestBody = {
            ssl_merchant_id,
            ssl_user_id,
            ssl_pin,
            ssl_vendor_id,
            ssl_transaction_type,
            ssl_amount,
            ssl_avs_address,
            ssl_avs_zip,
            ssl_first_name,
            ssl_last_name,
            ssl_invoice_number,
            ssl_billing_cycle,
            ssl_next_payment_date,
            ssl_end_of_month,
            // ssl_card_number,
            // ssl_exp_date,
        }

        // Send a POST request to Converge to obtain the ssl_txn_auth_token
        const response = await axios.post(apiUrl, requestBody, setHeader)

        // Extract the ssl_txn_auth_token from the response
        const ssl_txn_auth_token = response.data

        console.log('ssl_txn_auth_token: ', ssl_txn_auth_token)

        // Send the ssl_txn_auth_token back to the client
        res.status(200).send(ssl_txn_auth_token)
    } catch (error) {
        console.error('server :: catch :: error:: Error obtaining ssl_txn_auth_token: ', error.message)
        res.status(500).json({ error: 'Internal server error' })
    }
})

app.post('/razorpay', async (req, _) => console.log('razorpay: ', req.body))

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
