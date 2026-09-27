import { Injectable } from '@nestjs/common'

@Injectable()
export class AboutService {
  getAbout() {
    return {
      name: 'ITERNAUTA',

      slogan:
        'Explora historias. Encuentra tu mundo.',

      description:
        'La biblioteca virtual que te lleva de viaje entre historias.',

      about:
        'ITERNAUTA es una biblioteca virtual especializada en manga y cómic. Permite explorar publicaciones, descubrir nuevas historias, consultar información sobre cada título y conocer dónde conseguirlos.',

      categories: [
        {
          name: 'Manga',
          icon: '📖',
          description:
            'Explora publicaciones de manga y descubre nuevas historias.',
        },
        {
          name: 'Cómic',
          icon: '💥',
          description:
            'Explora publicaciones de cómic y encuentra nuevas historias.',
        },
      ],

      howItWorks: [
        'Explora',
        'Descubre',
        'Guarda',
        'Encuentra dónde conseguirlo',
      ],

      partner: {
        name: 'Spooky House',
        description:
          'ITERNAUTA nace con el apoyo de Spooky House, su partner socio inicial.',
        website: 'https://spookyhouse.com.co',
      },

      footer: {
        name: 'ITERNAUTA',
        slogan:
          'Explora historias. Encuentra tu mundo.',
      },
    }
  }
}