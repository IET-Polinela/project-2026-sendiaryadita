from django.contrib import messages
from django.db.models import Q
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse
from django.urls import reverse_lazy
from django.views import View
from django.views.generic import CreateView, DeleteView, DetailView, ListView, UpdateView

from .models import Report, STATUS_CHOICES
from .forms import ReportForm


def home(request):
    return render(request, 'main_app/home.html')


STATUS_FLOW = {
    'REPORTED': 'VERIFIED',
    'VERIFIED': 'IN_PROGRESS',
    'IN_PROGRESS': 'RESOLVED',
}


def serialize_report(report):
    next_status = STATUS_FLOW.get(report.status)
    next_status_label = dict(STATUS_CHOICES).get(next_status) if next_status else ''

    return {
        'id': report.id,
        'title': report.title,
        'category': report.category,
        'description': report.description,
        'location': report.location,
        'status': report.status,
        'status_label': report.get_status_display(),
        'created_at': report.created_at.strftime('%Y-%m-%d %H:%M:%S'),
        'detail_url': reverse('report_detail', args=[report.id]),
        'detail_json_url': reverse('report_detail_json', args=[report.id]),
        'edit_url': reverse('edit_report', args=[report.id]),
        'delete_url': reverse('delete_report', args=[report.id]),
        'update_status_url': reverse('update_report_status', args=[report.id]),
        'next_status': next_status or '',
        'next_status_label': next_status_label,
    }


class AdminRequiredMixin:
    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated or not request.user.is_admin:
            messages.error(request, 'Akses ditolak. Fitur ini hanya untuk admin.')
            return redirect('report_list')

        return super().dispatch(request, *args, **kwargs)


class ReportListView(ListView):
    model = Report
    template_name = 'main_app/report_list.html'
    context_object_name = 'reports'
    ordering = ['-created_at']


class ReportDetailView(DetailView):
    model = Report
    template_name = 'main_app/report_detail.html'
    context_object_name = 'report'


class ReportSearchView(View):
    def get(self, request, *args, **kwargs):
        query = request.GET.get('q', '').strip()
        reports = Report.objects.all().order_by('-created_at')

        if query:
            reports = reports.filter(
                Q(title__icontains=query)
                | Q(category__icontains=query)
                | Q(description__icontains=query)
                | Q(location__icontains=query)
                | Q(status__icontains=query)
            )

        return JsonResponse({
            'query': query,
            'count': reports.count(),
            'reports': [serialize_report(report) for report in reports],
        })


class ReportDetailJsonView(View):
    def get(self, request, pk, *args, **kwargs):
        report = get_object_or_404(Report, pk=pk)

        return JsonResponse({
            'report': serialize_report(report),
        })


class ReportCreateView(AdminRequiredMixin, CreateView):
    model = Report
    form_class = ReportForm
    template_name = 'main_app/add_report.html'
    success_url = reverse_lazy('home')

    def form_valid(self, form):
        response = super().form_valid(form)
        messages.success(self.request, 'Laporan baru berhasil ditambahkan.')
        return response


class ReportUpdateView(AdminRequiredMixin, UpdateView):
    model = Report
    form_class = ReportForm
    template_name = 'main_app/edit_report.html'
    context_object_name = 'report'
    success_url = reverse_lazy('report_list')

    def form_valid(self, form):
        response = super().form_valid(form)
        messages.success(self.request, 'Laporan berhasil diperbarui.')
        return response


class ReportDeleteView(AdminRequiredMixin, DeleteView):
    model = Report
    template_name = 'main_app/delete_report.html'
    context_object_name = 'report'
    success_url = reverse_lazy('report_list')

    def form_valid(self, form):
        messages.success(self.request, 'Laporan berhasil dihapus.')
        return super().form_valid(form)


class ReportUpdateStatusView(AdminRequiredMixin, View):
    status_flow = STATUS_FLOW

    def post(self, request, pk):
        report = get_object_or_404(Report, pk=pk)
        new_status = request.POST.get('status')

        if self.status_flow.get(report.status) == new_status:
            report.status = new_status
            report.save()
            messages.success(request, f'Status laporan berhasil diubah menjadi {report.get_status_display()}.')

        return redirect('report_list')
