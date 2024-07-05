import { IAccessory } from '@modules/cars/domain/models/entities/IAccessory';
import { Car } from '@modules/cars/infra/typeorm/entities/Car';

export class AccessoryCarUpdateValidator {
  public static async validate(
    car: Car,
    updateAccessories: IAccessory[],
  ): Promise<void> {
    updateAccessories.forEach(updateAccessory => {
      const existingAccessoryIndex = car.accessories.findIndex(
        accessory =>
          accessory._id.toString() === updateAccessory._id.toString(),
      );

      if (existingAccessoryIndex !== -1) {
        const existingAccessory = car.accessories[existingAccessoryIndex];

        if (existingAccessory.description === updateAccessory.description) {
          car.accessories.splice(existingAccessoryIndex, 1);
        } else {
          existingAccessory.description = updateAccessory.description;
        }
      } else {
        car.accessories.push(updateAccessory);
      }
    });
  }
}
