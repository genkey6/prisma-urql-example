import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ANIMAL_REPOSITORY } from "src/constants";
import { AnimalRepository } from "src/domain/animal/animal.repository";
import { ClassisDto } from "../classis/classis.dto";
import { FamilyDto } from "../family/family.dto";
import { OrderDto } from "../order/order.dto";
import { AnimalDto } from "./animal.dto";

@Injectable()
export class AnimalService {
  constructor(
    @Inject(ANIMAL_REPOSITORY) private readonly repository: AnimalRepository,
  ) {}

  async getAll(): Promise<AnimalDto[]> {
    return this.repository.findMany();
  }

  async getById(id: string): Promise<AnimalDto> {
    const animal = await this.repository.findById(id);
    if (!animal) {
      throw new NotFoundException(`Animal [${id}] was not found.`);
    }

    return new AnimalDto({
      id: animal.id,
      name: animal.name,
      family: new FamilyDto({
        id: animal.family.id,
        name: animal.family.name,
        order: new OrderDto({
          id: animal.family.order.id,
          name: animal.family.order.name,
          classis: new ClassisDto({
            id: animal.family.order.classis.id,
            name: animal.family.order.classis.name,
          })
        })
      })
    });
  }
}
