from django.contrib import messages
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse_lazy
from django.views import View
from django.views.generic import CreateView, DeleteView, DetailView, ListView, UpdateView

from .models import Report, STATUS_CHOICES
from .forms import ReportForm


def home(request):
    return render(request, 'main_app/home.html')


class ReportListView(ListView):
    model = Report
    template_name = 'main_app/report_list.html'
    context_object_name = 'reports'
    ordering = ['-created_at']


class ReportDetailView(DetailView):
    model = Report
    template_name = 'main_app/report_detail.html'
    context_object_name = 'report'


class ReportCreateView(CreateView):
    model = Report
    form_class = ReportForm
    template_name = 'main_app/add_report.html'
    success_url = reverse_lazy('home')

    def form_valid(self, form):
        response = super().form_valid(form)
        messages.success(self.request, 'Laporan baru berhasil ditambahkan.')
        return response


class ReportUpdateView(UpdateView):
    model = Report
    form_class = ReportForm
    template_name = 'main_app/edit_report.html'
    context_object_name = 'report'
    success_url = reverse_lazy('report_list')

    def form_valid(self, form):
        response = super().form_valid(form)
        messages.success(self.request, 'Laporan berhasil diperbarui.')
        return response


class ReportDeleteView(DeleteView):
    model = Report
    template_name = 'main_app/delete_report.html'
    context_object_name = 'report'
    success_url = reverse_lazy('report_list')

    def form_valid(self, form):
        messages.success(self.request, 'Laporan berhasil dihapus.')
        return super().form_valid(form)


class ReportUpdateStatusView(View):
    status_flow = {
        'REPORTED': 'VERIFIED',
        'VERIFIED': 'IN_PROGRESS',
        'IN_PROGRESS': 'RESOLVED',
    }

    def post(self, request, pk):
        report = get_object_or_404(Report, pk=pk)
        new_status = request.POST.get('status')

        if self.status_flow.get(report.status) == new_status:
            report.status = new_status
            report.save()
            messages.success(request, f'Status laporan berhasil diubah menjadi {report.get_status_display()}.')

        return redirect('report_list')
