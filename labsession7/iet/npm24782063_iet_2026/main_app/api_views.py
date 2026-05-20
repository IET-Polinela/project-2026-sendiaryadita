from django.db.models import Q
from rest_framework import permissions, viewsets

from .models import Report
from .permissions import IsOwnerAndDraftOrReadOnly
from .serializers import ReportSerializer


class ReportViewSet(viewsets.ModelViewSet):
    serializer_class = ReportSerializer

    def get_queryset(self):
        user = self.request.user

        if not user.is_authenticated:
            return Report.objects.none()

        return Report.objects.filter(
            Q(status='DRAFT', reporter=user) | ~Q(status='DRAFT')
        )

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return [
                permissions.IsAuthenticated(),
                IsOwnerAndDraftOrReadOnly(),
            ]

        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(reporter=self.request.user)
