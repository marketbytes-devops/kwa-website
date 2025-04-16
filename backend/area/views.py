from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Area
from .serializers import AreaSerializer

class AreaViewSet(viewsets.ModelViewSet):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer
    permission_classes = [AllowAny]