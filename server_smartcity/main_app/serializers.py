from rest_framework import serializers

from .models import Report


class ReportSerializer(serializers.ModelSerializer):
    reporter = serializers.SerializerMethodField()
    is_owner = serializers.SerializerMethodField()

    class Meta:
        model = Report
        fields = [
            'id',
            'title',
            'category',
            'description',
            'location',
            'status',
            'reporter',
            'is_owner',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'reporter',
            'is_owner',
            'created_at',
            'updated_at',
        ]

    def get_reporter(self, obj) -> str:
        request = self.context.get('request')

        if request and request.user.is_authenticated and obj.reporter == request.user:
            return obj.reporter.username

        return 'Warga Anonim'

    def get_is_owner(self, obj) -> bool:
        request = self.context.get('request')

        if not request or not request.user.is_authenticated:
            return False

        return obj.reporter == request.user

    def validate_status(self, value):
        request = self.context.get('request')
        user = request.user if request else None

        is_admin = bool(
            user
            and user.is_authenticated
            and (
                user.is_superuser
                or user.is_staff
                or getattr(user, 'is_admin', False)
            )
        )

        if user and user.is_authenticated and not is_admin and value not in ['DRAFT', 'REPORTED']:
            raise serializers.ValidationError(
                'Citizen hanya boleh membuat atau mengubah report dengan status DRAFT atau REPORTED.'
            )

        return value

    def validate(self, attrs):
        request = self.context.get('request')
        user = request.user if request else None

        is_admin = bool(
            user
            and user.is_authenticated
            and (
                user.is_superuser
                or user.is_staff
                or getattr(user, 'is_admin', False)
            )
        )

        if request and is_admin and request.method in ['PUT', 'PATCH']:
            allowed_fields = {'status'}
            if not set(attrs.keys()).issubset(allowed_fields):
                raise serializers.ValidationError(
                    'Admin hanya boleh mengubah status report.'
                )

        return attrs
