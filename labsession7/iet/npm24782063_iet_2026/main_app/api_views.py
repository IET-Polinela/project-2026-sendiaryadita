from django.db.models import Q
from rest_framework import permissions, viewsets
from rest_framework.pagination import PageNumberPagination

from .models import Report
from .permissions import (
    IsOwnerAndDraftOrAdminStatusOnly,
    is_admin_user,
)
from .serializers import ReportSerializer


class ReportPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 1000


class ReportViewSet(viewsets.ModelViewSet):
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerAndDraftOrAdminStatusOnly]
    pagination_class = ReportPagination

    def get_queryset(self):
        user = self.request.user

        if not user.is_authenticated:
            return Report.objects.none()

        tab = self.request.query_params.get('tab')
        reports = Report.objects.all().order_by('-updated_at')

        if tab == 'my_reports':
            return reports.filter(reporter=user)

        if tab == 'feed':
            return reports.exclude(status='DRAFT').exclude(reporter=user)

        if is_admin_user(user):
            return reports.exclude(status='DRAFT')

        return reports.filter(
            Q(status='DRAFT', reporter=user) | ~Q(status='DRAFT')
        )

    def perform_create(self, serializer):
        serializer.save(reporter=self.request.user)
