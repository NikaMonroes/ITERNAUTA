import { ApiProperty } from '@nestjs/swagger'

export class AddCollectionItemDto {
  @ApiProperty({
    example: 15,
    description:
      'Identificador de la publicación que se desea agregar.',
  })
  publicationId: number
}