from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = (
        "username",
        "email",
        "is_staff",
        "is_superuser",
        "is_admin",
        "is_member",
    )
    list_filter = ("is_staff", "is_superuser", "is_admin", "is_member")

    fieldsets = UserAdmin.fieldsets + (
        ("Role Settings", {"fields": ("is_admin", "is_member")}),
    )
