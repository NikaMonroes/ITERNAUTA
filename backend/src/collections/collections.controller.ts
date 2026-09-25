import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Delete,
  Body,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'

import type { Request } from 'express'

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { CollectionsService } from './collections.service.js'
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard.js'

import { AddCollectionItemDto } from './dto/add-collection-item.dto.js'

@ApiTags('Collections')
@ApiBearerAuth('access-token')
@Controller('collections')
export class CollectionsController {
  constructor(
    private readonly collectionsService: CollectionsService,
  ) {}

  @Get()
  @UseGuards(SupabaseAuthGuard)
  @ApiOperation({
    summary: 'Obtener mis colecciones',
    description:
      'Obtiene las colecciones pertenecientes al usuario autenticado.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Colecciones del usuario obtenidas correctamente.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Token de autenticación requerido o inválido.',
  })
  @ApiResponse({
    status: 404,
    description:
      'El usuario no está registrado en ITERNAUTA.',
  })
  async findMyCollections(
    @Req() request: Request,
  ) {
    const user = request.user

    if (!user) {
      throw new UnauthorizedException(
        'Usuario autenticado no encontrado',
      )
    }

    return this.collectionsService.findMyCollections(
      user.id,
    )
  }
  
  @Get(':collectionId/items')
  @UseGuards(SupabaseAuthGuard)
  @ApiOperation({
    summary: 'Obtener publicaciones de una colección',
    description:
      'Obtiene las publicaciones pertenecientes a una colección del usuario autenticado.',
  })
  @ApiParam({
    name: 'collectionId',
    type: Number,
    description:
      'Identificador de la colección.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Publicaciones de la colección obtenidas correctamente.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Token de autenticación requerido o inválido.',
  })
  @ApiResponse({
    status: 404,
    description:
      'La colección no existe o no pertenece al usuario.',
  })
  async findCollectionItems(
    @Param(
      'collectionId',
      ParseIntPipe,
    )
    collectionId: number,

    @Req()
    request: Request,
  ) {
    const user = request.user

    if (!user) {
      throw new UnauthorizedException(
        'Usuario autenticado no encontrado',
      )
    }

    return this.collectionsService.findCollectionItems(
      user.id,
      collectionId,
    )
  }




  @Post(':collectionId/items')
  @UseGuards(SupabaseAuthGuard)
  @ApiOperation({
    summary: 'Agregar publicación a una colección',
    description:
      'Agrega una publicación a una colección perteneciente al usuario autenticado.',
  })
  @ApiParam({
    name: 'collectionId',
    type: Number,
    description:
      'Identificador de la colección.',
  })
  @ApiBody({
    type: AddCollectionItemDto,
  })
  @ApiResponse({
    status: 201,
    description:
      'Publicación agregada correctamente a la colección.',
  })
  @ApiResponse({
    status: 400,
    description:
      'El publicationId no es válido.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Token de autenticación requerido o inválido.',
  })
  @ApiResponse({
    status: 404,
    description:
      'La colección o publicación no existe.',
  })
  @ApiResponse({
    status: 409,
    description:
      'La publicación ya pertenece a la colección.',
  })
  async addPublication(
    @Param(
      'collectionId',
      ParseIntPipe,
    )
    collectionId: number,

    @Body()
    body: AddCollectionItemDto,

    @Req()
    request: Request,
  ) {
    const user = request.user

    if (!user) {
      throw new UnauthorizedException(
        'Usuario autenticado no encontrado',
      )
    }

    return this.collectionsService.addPublication(
      user.id,
      collectionId,
      body.publicationId,
    )
  }
  @Delete(':collectionId/items/:publicationId')
  @UseGuards(SupabaseAuthGuard)
  @ApiOperation({
    summary: 'Eliminar publicación de una colección',
    description:
      'Elimina una publicación de una colección perteneciente al usuario autenticado.',
  })
  @ApiParam({
    name: 'collectionId',
    type: Number,
    description:
      'Identificador de la colección.',
  })
  @ApiParam({
    name: 'publicationId',
    type: Number,
    description:
      'Identificador de la publicación.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Publicación eliminada correctamente de la colección.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Token de autenticación requerido o inválido.',
  })
  @ApiResponse({
    status: 404,
    description:
      'La colección o publicación no existe en la colección.',
  })
  async removePublication(
    @Param(
      'collectionId',
      ParseIntPipe,
    )
    collectionId: number,

    @Param(
      'publicationId',
      ParseIntPipe,
    )
    publicationId: number,

    @Req()
    request: Request,
  ) {
    const user = request.user

    if (!user) {
      throw new UnauthorizedException(
        'Usuario autenticado no encontrado',
      )
    }

    return this.collectionsService.removePublication(
      user.id,
      collectionId,
      publicationId,
    )
  }



}