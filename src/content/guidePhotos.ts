import { asset } from '../lib/asset'

export interface GuidePhoto {
  src: string
  thumb: string
  credit?: { author: string; license: string; url: string }
}

const p = (key: string) => ({ src: asset(`assets/guide/${key}.webp`), thumb: asset(`assets/guide/${key}-thumb.webp`) })

/** Photos for the Medellín guide cards. Credits are required by the Creative Commons licences (Wikimedia Commons). */
export const guidePhotos: Record<string, GuidePhoto> = {
  comuna13: p('comuna13'),
  botero: p('botero-dome'), // user-supplied photo (Palacio de la Cultura dome at dusk)
  provenza: { ...p('provenza'), credit: { author: "José Luiz", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Carrera_35_-_Provenza_-_Medell%C3%ADn_-_Colombia_2024_(2).jpg" } },
  laureles: p('laureles-pond'), // user-supplied photo (pond in Laureles)
  arvi: p('arvi-pond'), // user-supplied photo (lake in Parque Arví)
  coffee: { ...p('coffee'), credit: { author: "TitiNicola", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Caf%C3%A9_Colombiano.jpg" } },
  food: { ...p('food'), credit: { author: "Edgar Zuniga Jr.", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Bandeja_Paisa_(Bogot%C3%A1).jpg" } },
  guatape: { ...p('guatape'), credit: { author: "Juan Gómez", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Piedra_y_Embalse_del_Pe%C3%B1ol_desde_dron_04.jpg" } },
  santafe: { ...p('santafe'), credit: { author: "Kamilokardona", license: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:Perspectiva_calle_1._Santa_Fe_de_Antioquia_(antioquia)._Colombia.JPG" } },
  coffeecountry: { ...p('coffeecountry'), credit: { author: "U.S. Fish and Wildlife Service", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Coffee_farm_in_Colombia.jpg" } },
  jardin: { ...p('jardin'), credit: { author: "Xemenendura", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Catedral_y_plaza.jpg" } },
}
