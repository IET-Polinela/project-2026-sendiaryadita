from rest_framework import permissions


class IsOwnerAndDraftOrReadOnly(permissions.BasePermission):
    """
    Permission khusus untuk Report:
    - GET, HEAD, OPTIONS boleh untuk user login.
    - PUT, PATCH, DELETE hanya boleh jika user adalah pemilik report
      dan status report masih DRAFT.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.reporter == request.user and obj.status == 'DRAFT'
