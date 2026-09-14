import { PosyanduItem } from '../types';

export const KEPANJEN_VILLAGES = [
  'Kelurahan Kepanjen',
  'Kelurahan Ardirejo',
  'Kelurahan Cepokomulyo',
  'Kelurahan Penarukan',
  'Desa Jatirejoyoso',
  'Desa Curungrejo',
  'Desa Mangunrejo',
  'Desa Talangagung',
  'Desa Panggungrejo',
  'Desa Sengguruh',
  'Desa Kemiri',
  'Desa Dilem',
  'Desa Sukorame',
  'Desa Mojosari',
  'Desa Jenggolo',
  'Desa Ngadilangkung',
  'Desa Tegalsari',
  'Desa Ngebruk'
];

const FLOWER_NAMES: Record<string, string> = {
  'Kelurahan Kepanjen': 'Mawar',
  'Kelurahan Ardirejo': 'Melati',
  'Kelurahan Cepokomulyo': 'Dahlia',
  'Kelurahan Penarukan': 'Anggrek',
  'Desa Jatirejoyoso': 'Kamboja',
  'Desa Curungrejo': 'Flamboyan',
  'Desa Mangunrejo': 'Cempaka',
  'Desa Talangagung': 'Teratai',
  'Desa Panggungrejo': 'Bougainville',
  'Desa Sengguruh': 'Kenanga',
  'Desa Kemiri': 'Tulip',
  'Desa Dilem': 'Lily',
  'Desa Sukorame': 'Mawar Merah',
  'Desa Mojosari': 'Nusa Indah',
  'Desa Jenggolo': 'Jasmine',
  'Desa Ngadilangkung': 'Sakura',
  'Desa Tegalsari': 'Lavender',
  'Desa Ngebruk': 'Asoka'
};

const KADER_NAMES = [
  'Ibu Sri Wahyuni', 'Ibu Endang Rahayu', 'Ibu Nurul Aini', 'Ibu Titik Handayani',
  'Ibu Ratna Juwita', 'Ibu Budiarti', 'Ibu Maryati', 'Ibu Kusmiati',
  'Ibu Ani Suryani', 'Ibu Rahmawati', 'Ibu Sulastri', 'Ibu Kartini',
  'Ibu Wiwik Setyowati', 'Ibu Tri Hastuti', 'Ibu Retno Palupi', 'Ibu Yuliani'
];

export const POSYANDU_108_LIST: PosyanduItem[] = (() => {
  const list: PosyanduItem[] = [];
  let index = 1;

  KEPANJEN_VILLAGES.forEach((village) => {
    const flower = FLOWER_NAMES[village] || 'Posyandu';
    for (let i = 1; i <= 6; i++) {
      const id = `posyandu-${index}`;
      const name = `Posyandu ${flower} 0${i}`;
      const kader = KADER_NAMES[(index - 1) % KADER_NAMES.length];
      const statuses: PosyanduItem['activeStatus'][] = ['Aktif Mandiri', 'Aktif Purnama', 'Aktif Madya', 'Aktif Mandiri'];
      
      list.push({
        id,
        name,
        village,
        rw: `RW 0${i}`,
        kaderPic: kader,
        cadreCount: 5 + (index % 3),
        activeStatus: statuses[(index - 1) % statuses.length],
        phone: `0812345678${(10 + index).toString().padStart(2, '0')}`
      });
      index++;
    }
  });

  return list;
})();
