export function assertCanReserve(capacity, reservedCount, quantity) {
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
        throw new Error("invalid_quantity");
    }
    const available = capacity - reservedCount;
    if (quantity > available) {
        throw new Error("not_enough_tickets");
    }
}
