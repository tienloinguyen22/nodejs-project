/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { logger, startDatabase, permissions, permissionScopes, roleIds } from '@app/core';
import { config } from '@app/config';
import moment from 'moment';
import { rolesRepository } from '../modules/auth/aggregates/roles/roles.repository';

(async () => {
  logger.info(`[Server] Initialize mongo ...`);
  await startDatabase(config.database.connectionString);

  const roles = [
    {
      _id: roleIds.ADMIN,
      name: 'Administrator',
      permissions: [
        {
          permission: permissions.USERS.CREATE,
          scope: '',
        },
        {
          permission: permissions.USERS.VIEW,
          scope: permissionScopes.ANY,
        },
        {
          permission: permissions.USERS.UPDATE,
          scope: permissionScopes.ANY,
        },
        {
          permission: permissions.USERS.DELETE,
          scope: permissionScopes.ANY,
        },
        {
          permission: permissions.ROLES.CREATE,
          scope: '',
        },
        {
          permission: permissions.ROLES.VIEW,
          scope: permissionScopes.ANY,
        },
        {
          permission: permissions.ROLES.VIEW,
          scope: permissionScopes.ANY,
        },
        {
          permission: permissions.ROLES.VIEW,
          scope: permissionScopes.ANY,
        },
        {
          permission: permissions.BREEDS.CREATE,
          scope: '',
        },
        {
          permission: permissions.BREEDS.VIEW,
          scope: permissionScopes.ANY,
        },
        {
          permission: permissions.BREEDS.VIEW,
          scope: permissionScopes.ANY,
        },
        {
          permission: permissions.BREEDS.VIEW,
          scope: permissionScopes.ANY,
        },
        {
          permission: permissions.PETS.CREATE,
          scope: '',
        },
        {
          permission: permissions.PETS.VIEW,
          scope: permissionScopes.ANY,
        },
        {
          permission: permissions.PETS.UPDATE,
          scope: permissionScopes.ANY,
        },
        {
          permission: permissions.PETS.DELETE,
          scope: permissionScopes.ANY,
        },
        {
          permission: permissions.BRANCHES.CREATE,
          scope: '',
        },
        {
          permission: permissions.BRANCHES.VIEW,
          scope: permissionScopes.ANY,
        },
        {
          permission: permissions.BRANCHES.UPDATE,
          scope: permissionScopes.ANY,
        },
        {
          permission: permissions.BRANCHES.DELETE,
          scope: permissionScopes.ANY,
        },
        {
          permission: permissions.SERVICES.CREATE,
          scope: '',
        },
        {
          permission: permissions.SERVICES.VIEW,
          scope: permissionScopes.ANY,
        },
        {
          permission: permissions.SERVICES.UPDATE,
          scope: permissionScopes.ANY,
        },
        {
          permission: permissions.SERVICES.DELETE,
          scope: permissionScopes.ANY,
        },
        {
          permission: permissions.BOOKINGS.CREATE,
          scope: '',
        },
        {
          permission: permissions.BOOKINGS.VIEW,
          scope: permissionScopes.ANY,
        },
        {
          permission: permissions.BOOKINGS.UPDATE,
          scope: permissionScopes.ANY,
        },
        {
          permission: permissions.BOOKINGS.DELETE,
          scope: permissionScopes.ANY,
        },
        {
          permission: permissions.NOTIFICATIONS.CREATE,
          scope: '',
        },
        {
          permission: permissions.NOTIFICATIONS.VIEW,
          scope: permissionScopes.ANY,
        },
        {
          permission: permissions.NOTIFICATIONS.UPDATE,
          scope: permissionScopes.ANY,
        },
        {
          permission: permissions.NOTIFICATIONS.DELETE,
          scope: permissionScopes.ANY,
        },
      ],
      isActive: true,
      createdAt: moment().valueOf(),
    },
    {
      _id: roleIds.USER,
      name: 'User',
      permissions: [
        {
          permission: permissions.BREEDS.VIEW,
          scope: permissionScopes.ANY,
        },
        {
          permission: permissions.PETS.CREATE,
          scope: '',
        },
        {
          permission: permissions.PETS.VIEW,
          scope: permissionScopes.OWN,
        },
        {
          permission: permissions.PETS.UPDATE,
          scope: permissionScopes.OWN,
        },
        {
          permission: permissions.PETS.DELETE,
          scope: permissionScopes.OWN,
        },
        {
          permission: permissions.BRANCHES.VIEW,
          scope: permissionScopes.ANY,
        },
        {
          permission: permissions.SERVICES.VIEW,
          scope: permissionScopes.ANY,
        },
        {
          permission: permissions.BOOKINGS.CREATE,
          scope: '',
        },
        {
          permission: permissions.BOOKINGS.UPDATE,
          scope: permissionScopes.OWN,
        },
        {
          permission: permissions.BOOKINGS.VIEW,
          scope: permissionScopes.OWN,
        },
        {
          permission: permissions.NOTIFICATIONS.VIEW,
          scope: permissionScopes.OWN,
        },
        {
          permission: permissions.NOTIFICATIONS.UPDATE,
          scope: permissionScopes.OWN,
        },
      ],
      isActive: true,
      createdAt: moment().valueOf(),
    },
  ];
  for (const role of roles) {
    await rolesRepository.upsert(role);
  }

  logger.info(`Create roles success`);
  process.exit();
})();
