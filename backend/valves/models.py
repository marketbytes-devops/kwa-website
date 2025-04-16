from django.conf import settings
from django.db import models

class Valve(models.Model):
    name = models.CharField(max_length=100)
    size = models.CharField(max_length=50)
    full_open_condition = models.CharField(max_length=100)
    current_condition = models.CharField(max_length=100)
    remarks = models.TextField()
    previous_position = models.CharField(max_length=100, null=True, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    location_type = models.CharField(
        max_length=20,
        choices=[('current', 'Current Location'), ('coordinates', 'Coordinates')],
        default='coordinates'
    )
    location_link = models.CharField(max_length=500, null=True, blank=True)

    def __str__(self):
        return self.name

class ValveLog(models.Model):
    valve = models.ForeignKey(Valve, related_name='logs', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    changed_field = models.CharField(max_length=100)
    old_value = models.TextField()
    new_value = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.valve.name} - {self.changed_field} changed on {self.timestamp}"