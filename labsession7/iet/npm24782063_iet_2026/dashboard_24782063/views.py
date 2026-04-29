from django.db.models import Count
from django.http import JsonResponse
from django.views import View
from django.views.generic import TemplateView

from main_app.models import Report, STATUS_CHOICES


class DashboardView(TemplateView):
    template_name = 'dashboard_24782063/dashboard.html'


class DashboardDataView(View):
    def get(self, request, *args, **kwargs):
        total_reports = Report.objects.count()

        data = {
            'total_reports': total_reports,
            'status_distribution': self.get_status_distribution(total_reports),
            'category_distribution': self.get_category_distribution(),
            'latest_reported': self.get_latest_reports('REPORTED'),
            'latest_resolved': self.get_latest_reports('RESOLVED'),
        }

        return JsonResponse(data)

    @staticmethod
    def get_status_distribution(total_reports):
        status_totals = {
            item['status']: item['total']
            for item in Report.objects.values('status').annotate(total=Count('id'))
        }

        labels = []
        counts = []
        percentages = []

        for status_value, status_label in STATUS_CHOICES:
            count = status_totals.get(status_value, 0)
            percentage = round((count / total_reports) * 100, 2) if total_reports else 0

            labels.append(status_label)
            counts.append(count)
            percentages.append(percentage)

        return {
            'labels': labels,
            'counts': counts,
            'percentages': percentages,
        }

    @staticmethod
    def get_category_distribution():
        categories = Report.objects.values('category').annotate(
            total=Count('id')
        ).order_by('-total', 'category')

        return {
            'labels': [item['category'] for item in categories],
            'counts': [item['total'] for item in categories],
        }

    @staticmethod
    def get_latest_reports(status):
        reports = Report.objects.filter(status=status).order_by('-created_at')[:5]

        return [
            {
                'id': report.id,
                'title': report.title,
                'category': report.category,
                'location': report.location,
                'status': report.status,
                'status_label': report.get_status_display(),
                'created_at': report.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            }
            for report in reports
        ]
