/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { config } from '../config';
import { getCurrentTimestampInMilliseconds, logger, startDatabase } from '../core';
import { branchesRepository } from '../modules/branches/aggregates/branches/branches.repository';

(async () => {
  logger.info(`[Server] Initialize mongo ...`);
  await startDatabase(config.database.connectionString);

  const branches = [
    {
      _id: '5c7447f2b4ec8a6f49608709',
      name: 'B&P Thảo Điền',
      location: '14A6 Thảo Điền, P.Thảo Điền, Quận 2, TP.Hồ Chí Minh, Việt Nam',
      avatarImageUrl: '262eeba0-c1f9-4d67-9d84-4b0d994c4aa5.png',
      locationImageUrl: 'e6c65268-da48-4dc1-91d2-59b00ef353fc.png',
      description: {
        en: `Located in a prime location of Thao Dien and Tran Nao, D2, Bed & Pet – The very first villa for pet which the total area up to 350m2 and another 50m2 spacious yard completely suitable for your pet. With more than 5 years of experience, Bed and Pet is proud to provide you the best quality of services. 

If you about to go for your business trip, or you work become busy and you don’t have time for him/her. Bed & Per is here to make sure every pet spending the quality time that they deserve.

Specially: Tran Nao branch offering a free transit for customers who would want to use the Hotel services in Thao Dien or vice versa`,
        vi: `Tọa lạc ngay tại vị trí đắc địa là Thảo Điền và Trần Não, Quận 2, căn biệt thự đầu tiên dành cho thú cưng có tổng diện tích lên đến 350m2 cùng với hơn 50m2 sân vườn rộng rãi. Với 5 năm kinh nghiệm, Bed and Pet tự hào cung cấp dịch vụ chăm sóc thú cưng tốt nhất. 

Nếu bạn chuẩn bị cho 1 chuyến công tác xa, hay muốn “cục cưng” của mình được chăm sóc, quan tâm, được giao lưu với các bé thú cưng khác, B&P sẽ là sự lựa chọn tốt nhất cho bạn và cho “cục cưng” của bạn.

Đặc biêt: B&P Trần Não ưu đãi miễn phí dịch vụ trung chuyển dành cho Quý khách muốn sử dụng dịch vụ khách sạn tại Thảo Điền hoặc ngược lại.`,
      },
      phoneNumber: '02837444178',
      availableServices: [
        '5c7447f2b4ec8a6f49608709',
        '5c7447f2b4ec8a6f49608708',
        '5c7447f2b4ec8a6f49608707',
        '5c7447f2b4ec8a6f49608706',
        '5c7447f2b4ec8a6f49608705',
      ],
      isActive: true,
      createdAt: getCurrentTimestampInMilliseconds(),
    },
    {
      _id: '5c7447f2b4ec8a6f49608708',
      name: 'B&P Trần Não',
      location: '13B Trần Não, P.Bình An, Quận 2, TP.Hồ Chí Minh, Việt Nam',
      avatarImageUrl: '9cb68bd8-c401-407c-aea6-3f021b7ff443.png',
      locationImageUrl: '046c600b-6c27-497f-9e29-4ec18c7bd190.png',
      description: {
        en: `Located in a prime location of Thao Dien and Tran Nao, D2, Bed & Pet – The very first villa for pet which the total area up to 350m2 and another 50m2 spacious yard completely suitable for your pet. With more than 5 years of experience, Bed and Pet is proud to provide you the best quality of services. 

If you about to go for your business trip, or you work become busy and you don’t have time for him/her. Bed & Per is here to make sure every pet spending the quality time that they deserve.

Specially: Tran Nao branch offering a free transit for customers who would want to use the Hotel services in Thao Dien or vice versa`,
        vi: `Tọa lạc ngay tại vị trí đắc địa là Thảo Điền và Trần Não, Quận 2, căn biệt thự đầu tiên dành cho thú cưng có tổng diện tích lên đến 350m2 cùng với hơn 50m2 sân vườn rộng rãi. Với 5 năm kinh nghiệm, Bed and Pet tự hào cung cấp dịch vụ chăm sóc thú cưng tốt nhất. 

Nếu bạn chuẩn bị cho 1 chuyến công tác xa, hay muốn “cục cưng” của mình được chăm sóc, quan tâm, được giao lưu với các bé thú cưng khác, B&P sẽ là sự lựa chọn tốt nhất cho bạn và cho “cục cưng” của bạn.

Đặc biêt: B&P Trần Não ưu đãi miễn phí dịch vụ trung chuyển dành cho Quý khách muốn sử dụng dịch vụ khách sạn tại Thảo Điền hoặc ngược lại.`,
      },
      phoneNumber: '0336490707',
      availableServices: ['5c7447f2b4ec8a6f49608708', '5c7447f2b4ec8a6f49608707', '5c7447f2b4ec8a6f49608705'],
      isActive: true,
      createdAt: getCurrentTimestampInMilliseconds(),
    },
  ];
  for (const branch of branches) {
    await branchesRepository.upsert(branch);
  }

  logger.info(`Create branches success`);
  process.exit();
})();
