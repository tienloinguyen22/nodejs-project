/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { config } from '../config';
import { getCurrentTimestampInMilliseconds, logger, startDatabase } from '../core';
import { PriceTypes } from '../modules/services/aggregates/services/interfaces';
import { servicesRepository } from '../modules/services/aggregates/services/services.repository';

(async () => {
  logger.info(`[Server] Initialize mongo ...`);
  await startDatabase(config.database.connectionString);

  const services = [
    {
      _id: '5c7447f2b4ec8a6f49608709',
      name: 'Pet Hotel',
      shortDescription: {
        en: 'Provide absolute care to your pets ',
        vi: 'Chăm sóc toàn diện cho thú cưng',
      },
      description: {
        en: `We provide absolute care to your pets during their stays with us. Each pet receives a personalized care treatment as your request. Our mission is to become your baby's second home!

Our working hour is: 8am - 6pm 
Check-in time: 12:00
Check-out time: 12:00
(Please read carefully our check-in & check-out policy)

What includes in the our price:
- Feeding twice per day
-	Play times: 02 times per day for the total of 6 hours per day
-	Dog walking will be depend on the weather of that day
-	Play time will be categorized by size, gender, level of energy, etc…
- We will update you by pictures or video clips once per day because we know how much you are missing your pets!`,
        vi: `Chúng tôi cung cấp dịch vụ chăm sóc hoàn toàn cho thú cưng của bạn trong thời gian lưu trú với chúng tôi. Mỗi thú cưng nhận được chế độ chăm sóc riêng biệt và chi tiết theo yêu cầu của bạn. Nhiệm vụ của chúng tôi là tạo một môi trường chăm sóc như ở nhà cho tất cả các bé. 

Thời gian hoạt động của chúng tôi: 8am - 6pm 
Thời gian check-in: 12:00
Thời gian check-out: 12:00
(Vui lòng đọc kĩ qui định về thời gian check-in và check-out của chúng tôi)

Những gì bao gồm trong giá của chúng tôi:
- Cho ăn hai lần mỗi ngày
- Thời gian chơi: 02 lần mỗi ngày với tổng số 6 giờ mỗi ngày
- Chó đi dạo sẽ phụ thuộc vào thời tiết của ngày hôm đó
- Thời gian chơi sẽ được phân loại theo kích cỡ, giới tính, tính cách, ...
- Cập nhật video và hình ảnh 01 lần mỗi ngày hoặc khi bạn yêu cầu
`,
      },
      roomOptions: [
        {
          _id: '5e32ea69056fcb45389aa2fe',
          name: 'Standard Room',
          shortDescription: {
            en: 'Provide absolute care to your pets ',
            vi: 'Chăm sóc toàn diện cho thú cưng',
          },
          description: {
            en: `
              - Feeding twice per day
              - Play times: 02 times per day for the total 6hrs/day
              - Dog walking (depended on weather)
              - Play time will be categorized by size, gender, level of energy...
            `,
            vi: `
              - 2 bữa ăn mỗi ngày
              - Giờ chơi: 02 lần mỗi ngày với tổng thời gian 6h/ngày
              - Đi dạo (Tùy thuộc tình hình thời tiết)
              - Thời gian vui chơi sẽ phụ thuộc cân nặng, giới tính, độ tuổi...
            `,
          },
          roomTypes: [
            {
              _id: '5e33ff4283d2794f31f5f5c9',
              name: '1 - 5kg',
              price: 155000,
              minWeight: 0,
              maxWeight: 5,
            },
            {
              _id: '5e355f1783d2794f31f5f5d6',
              name: '5 - 8kg',
              price: 205000,
              minWeight: 5,
              maxWeight: 8,
            },
            {
              _id: '5e355f1783d2794f31f5f5d7',
              name: '8 - 15kg',
              price: 275000,
              minWeight: 8,
              maxWeight: 15,
            },
            {
              _id: '5e355f1783d2794f31f5f5d8',
              name: '15 - 22kg',
              price: 395000,
              minWeight: 15,
              maxWeight: 22,
            },
            {
              _id: '5e355f1783d2794f31f5f5d9',
              name: '22 - 30kg',
              price: 505000,
              minWeight: 22,
              maxWeight: 30,
            },
            {
              _id: '5e3562df83d2794f31f5f5da',
              name: 'Over 30kg',
              price: 595000,
              minWeight: 30,
            },
          ],
          extraCares: [
            {
              _id: '5e33ff4283d2794f31f5f5c9',
              name: 'Special cooking',
              priceType: PriceTypes.FIXED,
              price: 15000,
              quantityPerDay: 2,
              unit: 'meal',
            },
            {
              _id: '5e33ff4283d2794f31f5f5c7',
              name: 'Extra walking',
              priceType: PriceTypes.FIXED,
              price: 95000,
              quantityPerDay: 1,
              unit: '30mins',
            },
          ],
        },
        {
          _id: '5e32ea69056fcb45389aa2ff',
          name: 'VIP Room',
          shortDescription: {
            en: 'Provide absolute care to your pets ',
            vi: 'Chăm sóc toàn diện cho thú cưng',
          },
          description: {
            en: `
              - Feeding twice per day
              - Play times: 02 times per day for the total 6hrs/day
              - Dog walking (depended on weather)
              - Play time will be categorized by size, gender, level of energy...
            `,
            vi: `
              - 2 bữa ăn mỗi ngày
              - Giờ chơi: 02 lần mỗi ngày với tổng thời gian 6h/ngày
              - Đi dạo (Tùy thuộc tình hình thời tiết)
              - Thời gian vui chơi sẽ phụ thuộc cân nặng, giới tính, độ tuổi...
            `,
          },
          imageUrls: [
            '308f2240-0115-40d2-be0c-1b9e5dff51a1.jpg',
            'b6f8b3fa-8f91-4736-ab9c-ca910c174ea2.jpg',
            '432f102c-7bd7-4b9b-bc7d-a22cd5cfa190.jpg',
            'ac488664-1c69-4826-910c-ffe4b0fa2133.jpg',
          ],
          roomTypes: [
            {
              _id: '5e33ff4283d2794f31f5f5c9',
              name: 'VIP Superior',
              price: 455000,
              maxWeight: 14,
            },
            {
              _id: '5e355f1783d2794f31f5f5d6',
              name: 'VIP Deluxe',
              price: 565000,
              maxWeight: 18,
            },
            {
              _id: '5e355f1783d2794f31f5f5d7',
              name: 'VIP Studio',
              price: 565000,
              maxWeight: 25,
            },
            {
              _id: '5e355f1783d2794f31f5f5d8',
              name: 'VIP Royal',
              price: 595000,
              maxWeight: 22,
            },
            {
              _id: '5e355f1783d2794f31f5f5d9',
              name: 'VIP Suite',
              price: 665000,
              maxWeight: 30,
            },
            {
              _id: '5e3562df83d2794f31f5f5da',
              name: 'VIP Super Suite',
              price: 715000,
            },
          ],
          extraCares: [
            {
              _id: '5e33ff4283d2794f31f5f5c9',
              name: 'Special cooking',
              priceType: PriceTypes.FIXED,
              price: 15000,
              quantityPerDay: 2,
              unit: 'meal',
            },
            {
              _id: '5e33ff4283d2794f31f5f5c8',
              name: 'Camera',
              priceType: PriceTypes.FIXED,
              price: 95000,
              quantityPerDay: 1,
              unit: 'day',
            },
            {
              _id: '5e33ff4283d2794f31f5f5c7',
              name: 'Extra walking',
              priceType: PriceTypes.FIXED,
              price: 95000,
              quantityPerDay: 1,
              unit: '30mins',
            },
          ],
        },
      ],
      isActive: true,
      createdAt: getCurrentTimestampInMilliseconds(),
    },
    {
      _id: '5c7447f2b4ec8a6f49608708',
      name: 'Day Care',
      shortDescription: {
        en: 'Get socialize with buddies and stay active',
        vi: 'Giao lưu với bạn bè và giải tỏa căng thẳng',
      },
      description: {
        en: `Your loving pet get to socialize with their buddies, stay active and realease their stress from being at home alone while you are busy at work.

Daycare hour is: 8am - 6pm (Please read carefully our late check-out/check-in policy)

What includes in the our price:
-	Feeding one meal per day
-	Cage-free during their stay 
-	Play time will be categorized by size, gender, level of energy, etc`,
        vi: `Thú cưng yêu thương của bạn có thể giao lưu với bạn bè của bé, duy trì vận động để giải tỏa căng thẳng cho các bé từ việc ở nhà một mình trong khi bạn bận rộn trong đi làm.

Thời gian hoạt động: 8am - 6pm (Vui lòng đọc kĩ qui định về thời gian check-in/check-out của chúng tôi)
        
Những gì bao gồm trong giá của chúng tôi:
- Cho ăn một bữa mỗi ngày
- Được cho chơi (không nhốt trong phòng) trong suốt thời gian lưu trú (ngoại trừ giờ nghỉ trưa và những trường hợp đặc biệt)
- Thời gian chơi sẽ được phân loại theo kích cỡ, giới tính, tính cách, vv`,
      },
      priceType: PriceTypes.BASE_ON_WEIGHT,
      priceConfigs: [
        {
          _id: '5e33ff4283d2794f31f5f5c9',
          price: 105000,
          minWeight: 0,
          maxWeight: 5,
        },
        {
          _id: '5e355f1783d2794f31f5f5d6',
          price: 125000,
          minWeight: 5,
          maxWeight: 8,
        },
        {
          _id: '5e355f1783d2794f31f5f5d7',
          price: 135000,
          minWeight: 8,
          maxWeight: 15,
        },
        {
          _id: '5e355f1783d2794f31f5f5d8',
          price: 195000,
          minWeight: 15,
          maxWeight: 22,
        },
        {
          _id: '5e355f1783d2794f31f5f5d9',
          price: 245000,
          minWeight: 22,
          maxWeight: 30,
        },
        {
          _id: '5e3562df83d2794f31f5f5da',
          price: 295000,
          minWeight: 30,
        },
      ],
      extraCares: [],
      isActive: true,
      createdAt: getCurrentTimestampInMilliseconds(),
    },
    {
      _id: '5c7447f2b4ec8a6f49608707',
      name: 'Grooming',
      shortDescription: {
        en: 'Make your pet be pretty and all cleaned-up',
        vi: 'Làm thú cưng của bạn xinh đẹp và sạch sẽ',
      },
      description: {
        en: `We are all here to make your pet be pretty and all cleaned-up!
    
Our working hour: 8am - 6pm (Making reservation 12 - 24h in advance is highly recommended)

What includes in our price:
- Bath, blow-dry, triming/haircut, nail cutting, ears cleaning`,
        vi: `Tất cả chúng tôi ở đây để làm cho thú cưng của bạn trở nên xinh đẹp và sạch sẽ!

Thời gian hoạt động: 8am - 6pm (Chúng tôi khuyến khích đặt chỗ trước từ 12 - 24h)

Những gì bao gồm trong giá của chúng tôi:
- Tắm, sấy khô, cắt/tỉa lông, cắt móng tay, vệ sinh tai`,
      },
      priceType: PriceTypes.BASE_ON_WEIGHT,
      priceConfigs: [
        {
          _id: '5e33ff4283d2794f31f5f5c9',
          price: 445000,
          minWeight: 0,
          maxWeight: 2,
        },
        {
          _id: '5e355f1783d2794f31f5f5d6',
          price: 495000,
          minWeight: 2,
          maxWeight: 5,
        },
        {
          _id: '5e355f1783d2794f31f5f5d7',
          price: 545000,
          minWeight: 5,
          maxWeight: 8,
        },
        {
          _id: '5e355f1783d2794f31f5f5d8',
          price: 595000,
          minWeight: 8,
          maxWeight: 15,
        },
        {
          _id: '5e355f1783d2794f31f5f5d9',
          price: 695000,
          minWeight: 15,
          maxWeight: 22,
        },
        {
          _id: '5e3562df83d2794f31f5f5da',
          price: 795000,
          minWeight: 22,
          maxWeight: 30,
        },
        {
          _id: '5e3562df83d2794f31f5f5db',
          price: 895000,
          minWeight: 30,
        },
      ],
      extraCares: [],
      isActive: true,
      createdAt: getCurrentTimestampInMilliseconds(),
    },
    {
      _id: '5c7447f2b4ec8a6f49608706',
      name: 'Self Bathing',
      shortDescription: {
        en: 'A perfect environment for you bath your pets',
        vi: 'Nơi hoàn hảo để tự tay tắm cho thú cưng của bạn',
      },
      description: {
        en: `Afraid do not have enough space, equipment, and tired of clean up the mess after each use at home while bathing your loving baby? We have a perfect environment for you bath your pets. 

Self Bathing hour is: 8am - 6pm

What includes in our price:
- 01 portion of shampoo
- 01 towel
- Usage of the bathing room within 1 hour`,
        vi: `Bạn lo sợ không có đủ không gian, thiết bị và mệt mỏi với việc dọn dẹp mớ hỗn độn sau mỗi lần sử dụng ở nhà trong khi tắm cho  bé yêu của bạn? Chúng tôi có một môi trường hoàn hảo cho bạn tắm vật nuôi của bạn.

Thời gian hoạt động: 8am - 6pm

Những gì bao gồm trong giá của chúng tôi:
- 01 phần dầu gội
- 01 khăn
- Sử dụng phòng tắm trong vòng 1 giờ`,
      },
      priceType: PriceTypes.FIXED,
      price: 99000,
      extraCares: [],
      isActive: true,
      createdAt: getCurrentTimestampInMilliseconds(),
    },
    {
      _id: '5c7447f2b4ec8a6f49608705',
      name: 'B&P Bathing',
      shortDescription: {
        en: 'Nothing is better than a fresh clean bath ',
        vi: 'Không có gì tốt hơn khi bé của bạn được thơm tho sạch sẽ',
      },
      description: {
        en: `Nothing is better than a fresh clean bath and come back all happy!

Our working hour: 8am - 6pm      

What includes in our price:
- Bath and blow-dry`,
        vi: `Không có gì tốt hơn khi bé của bạn được thơm tho sạch sẽ để bạn thỏa sức ôm ấp! 

Thời gian hoạt động: 8am - 6pm      

Những gì bao gồm trong giá của chúng tôi:
- Tắm và sấy khô`,
      },
      priceType: PriceTypes.BASE_ON_WEIGHT,
      priceConfigs: [
        {
          _id: '5e33ff4283d2794f31f5f5c9',
          price: 249000,
          minWeight: 0,
          maxWeight: 2,
        },
        {
          _id: '5e355f1783d2794f31f5f5d6',
          price: 269000,
          minWeight: 2,
          maxWeight: 5,
        },
        {
          _id: '5e355f1783d2794f31f5f5d7',
          price: 309000,
          minWeight: 5,
          maxWeight: 8,
        },
        {
          _id: '5e355f1783d2794f31f5f5d8',
          price: 349000,
          minWeight: 8,
          maxWeight: 15,
        },
        {
          _id: '5e355f1783d2794f31f5f5d9',
          price: 399000,
          minWeight: 15,
          maxWeight: 22,
        },
        {
          _id: '5e3562df83d2794f31f5f5da',
          price: 459000,
          minWeight: 22,
          maxWeight: 30,
        },
        {
          _id: '5e3562df83d2794f31f5f5db',
          price: 549000,
          minWeight: 30,
        },
      ],
      extraCares: [],
      isActive: true,
      createdAt: getCurrentTimestampInMilliseconds(),
    },
  ];
  for (const service of services) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await servicesRepository.upsert(service as any);
  }

  logger.info(`Create services success`);
  process.exit();
})();
