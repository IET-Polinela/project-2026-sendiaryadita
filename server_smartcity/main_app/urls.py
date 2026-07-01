from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('add/', views.ReportCreateView.as_view(), name='add_report'),
    path('reports/', views.ReportListView.as_view(), name='report_list'),
    path('reports/search/', views.ReportSearchView.as_view(), name='report_search'),
    path('reports/<int:pk>/json/', views.ReportDetailJsonView.as_view(), name='report_detail_json'),
    path('reports/<int:pk>/', views.ReportDetailView.as_view(), name='report_detail'),
    path('reports/edit/<int:pk>/', views.ReportUpdateView.as_view(), name='edit_report'),
    path('reports/update/<int:pk>/', views.ReportUpdateView.as_view(), name='update_report'),
    path('reports/delete/<int:pk>/', views.ReportDeleteView.as_view(), name='delete_report'),
    path('reports/<int:pk>/update-status/', views.ReportUpdateStatusView.as_view(), name='update_report_status'),
    path('reports/<int:pk>/status/', views.ReportUpdateStatusView.as_view(), name='update_status'),
]
