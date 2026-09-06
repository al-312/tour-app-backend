export interface RoomAllocationResult {
  numberOfRooms: number;
  numberOfExtraBeds: number;
  roomPrice: number;
  extraBedPrice: number;
  nights: number;
  perNightTotal: number;
  calculatedTotal: number;
}

export function calculateRoomAllocation(
  adults: number,
  roomType: {
    roomPrice: number;
    maxAdults: number;
    extraBedAvailable?: boolean;
    extraBedPrice?: number;
    maxExtraBeds?: number;
  },
  nights = 1,
): RoomAllocationResult {
  const maxAdults = Math.max(1, roomType.maxAdults || 2);
  const roomPrice = roomType.roomPrice;
  const extraBedPrice = roomType.extraBedPrice ?? 0;
  const extraAvailable = Boolean(roomType.extraBedAvailable);
  const maxExtra = extraAvailable ? Math.max(0, roomType.maxExtraBeds ?? 1) : 0;

  const validGuestCount = Math.max(1, adults);
  let bestConfig: {
    rooms: number;
    extraBeds: number;
    costPerNight: number;
  } | null = null;

  const maxRoomsToTry = Math.max(1, Math.ceil(validGuestCount / 1));
  for (let r = 1; r <= maxRoomsToTry; r++) {
    const maxExtraForR = r * maxExtra;
    for (let e = 0; e <= maxExtraForR; e++) {
      const capacity = r * maxAdults + e;
      if (capacity >= validGuestCount) {
        const cost = r * roomPrice + e * extraBedPrice;
        if (
          !bestConfig ||
          cost < bestConfig.costPerNight ||
          (cost === bestConfig.costPerNight && r < bestConfig.rooms)
        ) {
          bestConfig = { rooms: r, extraBeds: e, costPerNight: cost };
        }
      }
    }
  }

  if (!bestConfig) {
    const r = Math.ceil(validGuestCount / maxAdults);
    bestConfig = { rooms: r, extraBeds: 0, costPerNight: r * roomPrice };
  }

  const validNights = Math.max(1, nights);
  const perNightTotal = bestConfig.costPerNight;
  const calculatedTotal = perNightTotal * validNights;

  return {
    numberOfRooms: bestConfig.rooms,
    numberOfExtraBeds: bestConfig.extraBeds,
    roomPrice,
    extraBedPrice,
    nights: validNights,
    perNightTotal,
    calculatedTotal,
  };
}
