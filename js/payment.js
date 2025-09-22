document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const amount = urlParams.get('amount');

    const amountElement = document.getElementById('paymentAmount');
    const qrCodeImg = document.getElementById('qrCodeImg');

    if (amount && amountElement) {
        const numericAmount = parseFloat(amount);
        amountElement.textContent = `₹${numericAmount.toLocaleString('en-IN')}`;
        
        if (qrCodeImg) {
            const upiId = 'uttkarsh053@upi';
            const merchantName = 'Tribal Trails Marketplace';
            const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${numericAmount.toFixed(2)}&cu=INR`;
            
            // Switched back to qrserver.com
            qrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiString)}`;
        }
    }
});
