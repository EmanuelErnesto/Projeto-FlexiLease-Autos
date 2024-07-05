import { AccessoryDto } from '@modules/cars/domain/dtos/Accessory.dto';

export class AccessoryCarValidator {
  public static async validate(accessories: AccessoryDto[]): Promise<boolean> {
    const descriptions = new Set<string>();

    for (const accessory of accessories) {
      if (descriptions.has(accessory.description)) {
        return false;
      }
      descriptions.add(accessory.description);
    }

    return true;
  }
}
