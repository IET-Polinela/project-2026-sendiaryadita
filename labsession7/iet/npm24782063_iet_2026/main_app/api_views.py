from django.db.models import Q
from rest_framework import permissions, viewsets

from .models import Report
from .permissions import (
    IsOwnerAndDraftOrAdminStatusOnly,
    is_admin_user,
)
from .serializers import ReportSerializer


class ReportViewSet(viewsets.ModelViewSet):
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerAndDraftOrAdminStatusOnly]

    def get_queryset(self):
        user = self.request.user

        if not user.is_authenticated:
            return Report.objects.none()

        if is_admin_user(user):
            return Report.objects.exclude(status='DRAFT')

        return Report.objects.filter(
            Q(status='DRAFT', reporter=user) | ~Q(status='DRAFT')
        )

    def perform_create(self, serializer):
        serializer.save(reporter=self.request.user)
