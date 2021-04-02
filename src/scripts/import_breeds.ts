/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Excel from 'exceljs';
import fs from 'fs';
import { config } from '@app/config';
import slugify from 'slugify';
import _ from 'lodash';
import { logger, startDatabase } from '../core';
import { breedsRepository } from '../modules/pets/aggregates/breeds/breeds.repository';
import { PetSpecies } from '../modules/pets/aggregates/pets/interfaces';

const importBreeds = async (): Promise<void> => {
  const workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(`assets/breeds.xlsx`);
  const dogsSheet = workbook.getWorksheet(1);
  const catsSheet = workbook.getWorksheet(2);
  const dogImages = dogsSheet.getImages();
  const catImages = catsSheet.getImages();
  const escapeCharacterRegex = /[&/\\#,+()$~%.'":*?<>{}]/g;
  const createBreedPromises: any = [];

  for (const image of dogImages) {
    const row = dogsSheet.getRow(Number((image.range.tl as any).nativeRow) + 1);
    const nameCell = row.getCell('A').value;

    const newBreed: any = {
      species: PetSpecies.DOG,
      isActive: true,
      createdAt: new Date().getTime(),
    };
    if (nameCell && typeof nameCell === 'string') {
      if (nameCell && (nameCell as any).indexOf('/') > -1) {
        const names = (nameCell as any).split('/');
        newBreed.name = names[0].trim();
      } else {
        newBreed.name = (nameCell as any).trim();
      }
    }

    const imageInfo = workbook.getImage(Number(image.imageId));
    const filename = `${slugify(_.lowerCase(newBreed.name))}.${imageInfo.extension}`;
    const writeStream = fs.createWriteStream(`uploads/images/${filename}`);
    writeStream.write(imageInfo.buffer);
    writeStream.end();
    newBreed.imageUrl = filename;
    createBreedPromises.push(breedsRepository.create(newBreed));
  }

  for (const image of catImages) {
    const row = catsSheet.getRow(Number((image.range.tl as any).nativeRow) + 1);
    const nameCell = row.getCell('A').value;

    const newBreed: any = {
      species: PetSpecies.CAT,
      isActive: true,
      createdAt: new Date().getTime(),
    };

    if (nameCell && typeof nameCell === 'string') {
      const names = (nameCell as any).replace(escapeCharacterRegex, '').split('\n');
      newBreed.name = names[0].trim();
    }

    const imageInfo = workbook.getImage(Number(image.imageId));
    const filename = `${slugify(_.lowerCase(newBreed.name))}.${imageInfo.extension}`;
    const writeStream = fs.createWriteStream(`uploads/images/${filename}`);
    writeStream.write(imageInfo.buffer);
    writeStream.end();
    newBreed.imageUrl = filename;
    createBreedPromises.push(breedsRepository.create(newBreed));
  }

  await Promise.all(createBreedPromises);
};

(async () => {
  try {
    await startDatabase(config.database.connectionString);
    await importBreeds();
  } catch (error) {
    logger.error(error);
  }

  process.exit();
})();
