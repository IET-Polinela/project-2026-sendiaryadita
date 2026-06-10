from rest_framework import permissions


def is_admin_user(user):
    return bool(
        user
        and user.is_authenticated
        and (
            user.is_superuser
            or user.is_staff
            or getattr(user, 'is_admin', False)
        )
    )


def is_citizen_user(user):
    return bool(
        user
        and user.is_authenticated
        and getattr(user, 'is_member', False)
        and not is_admin_user(user)
    )


class IsOwnerAndDraftOrAdminStatusOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        if view.action == 'create':
            return is_citizen_user(request.user)

        return True

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        if is_admin_user(request.user):
            if view.action in ['update', 'partial_update']:
                allowed_fields = {'status'}
                return set(request.data.keys()).issubset(allowed_fields)

            return False

        return obj.reporter == request.user and obj.status == 'DRAFT'
