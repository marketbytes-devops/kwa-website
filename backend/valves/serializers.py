from rest_framework import serializers
from .models import Valve, ValveLog

class ValveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Valve
        fields = '__all__'

    def update(self, instance, validated_data):
        for field, new_value in validated_data.items():
            old_value = getattr(instance, field)
            if old_value != new_value:
                ValveLog.objects.create(
                    valve=instance,
                    user=self.context['request'].user,
                    changed_field=field,
                    old_value=str(old_value),
                    new_value=str(new_value)
                )
        return super().update(instance, validated_data)

class ValveLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ValveLog
        fields = '__all__'