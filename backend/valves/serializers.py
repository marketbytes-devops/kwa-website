from rest_framework import serializers
from .models import Valve, ValveLog

class ValveSerializer(serializers.ModelSerializer):
    def validate_full_open_condition(self, value):
        if not isinstance(value, (int, float)) or value is None:
            raise serializers.ValidationError("Full open condition must be a number.")
        return value

    def validate_current_condition(self, value):
        if not isinstance(value, (int, float)) or value is None:
            raise serializers.ValidationError("Current condition must be a number.")
        return value

    def validate_mid_point(self, value):
        if not isinstance(value, (int, float)) or value is None:
            raise serializers.ValidationError("Mid-point must be a number between 0 and 1.")
        return value

    def validate_steepness(self, value):
        if not isinstance(value, (int, float)) or value is None:
            raise serializers.ValidationError("Steepness must be a number between 0 and 100.")
        return value

    class Meta:
        model = Valve
        fields = [
            'id',
            'name',
            'size',
            'full_open_condition',
            'current_condition',
            'mid_point',
            'steepness',
            'remarks',
            'previous_position',
            'latitude',
            'longitude',
        ]
        read_only_fields = ['previous_position']

    def create(self, validated_data):
        # Set a default value for previous_position if not provided
        if 'previous_position' not in validated_data:
            validated_data['previous_position'] = ""
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Store the old current_condition before updating
        old_current_condition = instance.current_condition

        # Log changes for all fields
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

        # If current_condition is being updated, set previous_position to old current_condition
        if 'current_condition' in validated_data:
            instance.previous_position = str(old_current_condition)

        # Update the instance with validated data
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance

class ValveLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ValveLog
        fields = '__all__'