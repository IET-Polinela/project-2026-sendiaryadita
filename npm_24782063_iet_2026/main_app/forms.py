from django import forms
from .models import Report


class ReportForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        placeholders = {
            'title': 'Masukkan judul laporan',
            'category': 'Masukkan kategori laporan',
            'description': 'Jelaskan masalah yang terjadi',
            'location': 'Masukkan lokasi kejadian',
        }

        for field_name, field in self.fields.items():
            css_class = 'form-control'
            if isinstance(field.widget, forms.Textarea):
                field.widget.attrs['rows'] = 5

            field.widget.attrs.update({
                'class': css_class,
                'placeholder': placeholders.get(field_name, ''),
            })

    class Meta:
        model = Report
        fields = ['title', 'category', 'description', 'location']
        labels = {
            'title': 'Judul',
            'category': 'Kategori',
            'description': 'Deskripsi',
            'location': 'Lokasi',
        }
