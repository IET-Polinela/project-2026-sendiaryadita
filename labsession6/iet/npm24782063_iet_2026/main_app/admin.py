from django.contrib import admin

from .models import Report


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'location', 'status', 'created_at')
    search_fields = ('title', 'category', 'location', 'description')
    list_filter = ('category', 'status', 'created_at')
