import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        message: "Too many login attempts."
    }
});

export const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: {
        message: "Too many registrations."
    }
});

export const generalLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100
});

export const categoryLimiter = rateLimit({ 
    windowMs: 15 * 60 * 1000, 
    max: 30
});

export const addProductLimiter = rateLimit({ 
    windowMs: 1 * 60 * 1000, 
    max: 120 
});

export const getProductsLimiter = rateLimit({ 
    windowMs: 1 * 60 * 1000,
    max: 300
}); 

export const getCategoriesLimiter = rateLimit({ 
    windowMs: 15 * 60 * 1000,
    max: 50
}); 

export const newCustomerLimiter = rateLimit({ 
    windowMs: 15 * 60 * 1000, 
    max: 100
}); 

export const CustomerDetailsLimiter = rateLimit({ 
    windowMs: 15 * 60 * 1000, 
    max: 60
}); 

export const CustomerRiskLimiter = rateLimit({ 
    windowMs: 15 * 60 * 1000, 
    max: 60
}); 

export const GetAllCustomerLimiter = rateLimit({ 
    windowMs: 15 * 60 * 1000, 
    max: 500
}); 

export const newOrderLimiter = rateLimit({ 
    windowMs: 15 * 60 * 1000, 
    max: 300
}); 

export const getAllOrdersLimiter = rateLimit({ 
    windowMs: 15 * 60 * 1000, 
    max: 500
}); 

export const OrderDetailsLimiter = rateLimit({ 
    windowMs: 15 * 60 * 1000, 
    max: 100
}); 

export const OrderUpdateLimiter = rateLimit({ 
    windowMs: 15 * 60 * 1000, 
    max: 100
});

export const getSettingsLimiter = rateLimit({ 
    windowMs: 15 * 60 * 1000, 
    max: 100 
}); 

export const updateSettingsLimiter = rateLimit({ 
    windowMs: 15 * 60 * 1000, 
    max: 150, 
    message: { success: false, message: "Too many settings updates. Please wait a moment." }
});

export const ReportsLimiter = rateLimit({ 
    windowMs: 15 * 60 * 1000, 
    max: 50,
    message: { success: false, message: "Too many report requests. Please wait a moment." }
});
