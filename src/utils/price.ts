// Single source for the discount maths. Display and cart must agree: they were
// computed separately before, so the card showed the discounted price while the
// cart received the original.
export const getDiscountedPrice = (
  price: number,
  discountPercentage: number,
) => Math.round(price * (1 - discountPercentage / 100));

export const FREE_DELIVERY_ABOVE = 99;
export const DELIVERY_CHARGE = 40;

// Cart and checkout must quote the same figure, so neither adds up the order
// itself — they both call getOrderTotal.
export const getDeliveryCharge = (subtotal: number) =>
  subtotal > FREE_DELIVERY_ABOVE ? 0 : DELIVERY_CHARGE;

export const getOrderTotal = (subtotal: number) =>
  subtotal + getDeliveryCharge(subtotal);
