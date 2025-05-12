const paypal = require("paypal-rest-sdk");

paypal.configure({
    mode: "sandbox",
    client_id: "ARAHsxfchT6oPadYVgNnlSEBsvkFFUrYyv0J06I77k_r0juZhiUlM70Fq9mHHQwJ0q9Vz2WLh11zsG7g",
    client_secret: "EFO-0RkDCaOIntVmT9-0CU_T6X46ZKQjWu0YS73wrQDvKQiRJolPlrrNeHTiTXOVGKC0NbAeyAeWSpEw",
});

module.exports = paypal;