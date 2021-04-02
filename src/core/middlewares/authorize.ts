import { Response, Request } from 'express';
import _ from 'lodash';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../errors/api_error';
import { Permission, Role } from '../../modules/auth/aggregates/roles/interfaces';
import { permissionScopes } from '../helpers/permissions';

export const authorize = (permission: string) => {
  return (req: Request, _res: Response, next: Function) => {
    if (!_.get(req, 'user._id')) {
      throw new ApiError('Not authorized', StatusCodes.FORBIDDEN);
    } else {
      let permissions: Permission[] = [];
      const userRoles = _.get(req, 'user.roles') || [];
      userRoles.forEach((role: Role) => {
        const rolePermissions = _.get(role, 'permissions') || [];
        permissions = permissions.concat(rolePermissions);
      });
      const userPermissions = _.mapKeys(permissions, 'permission');
      const userPermission = userPermissions[permission] as Permission;
      if (permission && !userPermission) {
        throw new ApiError('Not authorized', StatusCodes.UNAUTHORIZED);
      }

      if (userPermission.scope === permissionScopes.OWN) {
        // eslint-disable-next-line no-param-reassign
        req.query = {
          ...req.query,
          createdBy: _.get(req, 'user._id'),
        };
      }

      next();
    }
  };
};
