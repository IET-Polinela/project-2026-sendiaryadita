from django import forms
from .models import Report


class ReportForm(forms.ModelForm):
    class Meta:
        model = Report
        fields = ['title', 'category', 'description', 'location']
        labels = {
            'title': 'Judul',
            'category': 'Kategori',
            'description': 'Deskripsi',
            'location': 'Lokasi',
        }
