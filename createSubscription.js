const instance = new Razorpay({
    key_id: 'YOUR_KEY_ID',
    key_secret: 'YOUR_SECRET'
})

instance.subscriptions.create({
    plan_id: "plan_7wAosPWtrkhqZw",
    customer_notify: 1,
    quantity: 5,
    total_count: 6,
    start_at: 1495995837,
    addons: [
        {
            item: {
                name: "Delivery charges",
                amount: 30000,
                currency: "INR"
            }
        }
    ],
    notes: {
        key1: "value3",
        key2: "value2"
    }
})
