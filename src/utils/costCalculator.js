
export const calculateTripCost = (distance, duration, pricePerKm, pricePerMin, additionalFees = 0) => {

    const costByDistance = distance * pricePerKm;
    const costByDuration = duration * pricePerMin;
    const totalCost = costByDistance + costByDuration + additionalFees;
    return totalCost;
};


export const getTripCostBreakdown = (distance, duration, pricePerKm, pricePerMin, additionalFees = 0) => {
    const costByDistance = distance * pricePerKm;
    const costByDuration = duration * pricePerMin;

    const totalCost = costByDistance + costByDuration + additionalFees;

    return {
        distanceCost: costByDistance,
        durationCost: costByDuration,
        additionalFees,
        totalCost,
    };
};
