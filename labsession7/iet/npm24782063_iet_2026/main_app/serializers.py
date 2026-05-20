from rest_framework import serializers

from .models import Report


class ReportSerializer(serializers.ModelSerializer):
    reporter = serializers.SerializerMethodField()

    class Meta:
        model = Report
        fields = [
            'id',
            'reporter',
            'title',
            'category',
            'description',
            'location',
            'status',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'reporter',
            'created_at',
            'updated_at',
        ]

    def get_reporter(self, obj):
        return 'Warga Anonim'

    def validate_status(self, value):
        request = self.context.get('request')

        if request and request.user.is_authenticated:
            is_admin = request.user.is_staff or getattr(request.user, 'is_admin', False)

            if not is_admin and value != 'DRAFT':
                raise serializers.ValidationError(
                    'Citizen tidak boleh mengubah status selain DRAFT.'
                )

        return value
