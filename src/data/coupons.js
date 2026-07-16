// Available coupons for the demo
export const AVAILABLE_COUPONS = [
  {
    code: "WELCOME20",
    discount: 20,
    type: "percentage",
    minAmount: 0,
    description: "20% off on your first purchase",
    maxUses: null
  },
  {
    code: "SUMMER15",
    discount: 15,
    type: "percentage",
    minAmount: 2000,
    description: "15% off on orders above ₹2000",
    maxUses: null
  },
  {
    code: "SAVE500",
    discount: 500,
    type: "fixed",
    minAmount: 3000,
    description: "Flat ₹500 off on orders above ₹3000",
    maxUses: null
  },
  {
    code: "SPECIAL50",
    discount: 50,
    type: "percentage",
    minAmount: 5000,
    description: "50% off on orders above ₹5000",
    maxUses: 10
  },
  {
    code: "FASHION30",
    discount: 30,
    type: "percentage",
    minAmount: 1500,
    description: "30% off on fashion items above ₹1500",
    maxUses: null
  },
  {
    code: "FLAT300",
    discount: 300,
    type: "fixed",
    minAmount: 0,
    description: "Flat ₹300 off on any order",
    maxUses: null
  }
];

export function validateCoupon(code, cartTotal) {
  const coupon = AVAILABLE_COUPONS.find(c => c.code === code.toUpperCase());
  
  if (!coupon) {
    return { valid: false, message: "Invalid coupon code" };
  }

  if (cartTotal < coupon.minAmount) {
    return {
      valid: false,
      message: `Minimum order amount ₹${coupon.minAmount} required for this coupon`
    };
  }

  return { valid: true, coupon };
}

export function calculateDiscount(coupon, amount) {
  if (!coupon) return 0;
  
  if (coupon.type === "percentage") {
    return Math.floor(amount * coupon.discount / 100);
  }
  
  if (coupon.type === "fixed") {
    return Math.min(coupon.discount, amount); // Don't discount more than order total
  }
  
  return 0;
}
