from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ValveViewSet, ValveLogViewSet  # Import ValveLogViewSet

router = DefaultRouter()
router.register(r'valves', ValveViewSet)
router.register(r'logs', ValveLogViewSet)  # Add this line for logs

urlpatterns = [
    path('', include(router.urls)),
]