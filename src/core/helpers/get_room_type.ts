import { Pet } from '../../modules/pets/aggregates/pets/interfaces';
import { RoomOption, RoomType } from '../../modules/services/aggregates/services/interfaces';

export const getRoomType = (
  selectedPet: Pet,
  selectedRoomOption: RoomOption | undefined,
  selectedRoomType: RoomType | undefined,
): RoomType | undefined => {
  if (!selectedRoomOption) {
    return undefined;
  }

  if (selectedRoomOption.name.includes('VIP')) {
    return selectedRoomType || undefined;
  }

  const standardRoomOption = selectedRoomOption.roomTypes.find((roomType) => {
    return (
      roomType.minWeight <= selectedPet.weight &&
      (!roomType.maxWeight || (roomType.maxWeight && selectedPet.weight < roomType.maxWeight))
    );
  });
  return standardRoomOption || undefined;
};
