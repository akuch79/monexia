import API from './api';

// 📱 M-Pesa
export const mpesaPayment = async (phone, amount) => {
    return await API.post('/mpesa/stkpush', {
        phone,
        amount,
        description: 'Monexia Payment'
    });
};

// 💳 Flutterwave
export const flutterwavePayment = async (data) => {
    return await API.post('/flutterwave/initiate', data);
};