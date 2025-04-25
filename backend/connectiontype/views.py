from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend, FilterSet, DateFilter, CharFilter
from rest_framework.filters import OrderingFilter
from .models import ConnectionType, Connection
from .serializers import ConnectionTypeSerializer, ConnectionSerializer

class ConnectionTypeViewSet(viewsets.ModelViewSet):
    queryset = ConnectionType.objects.all()
    serializer_class = ConnectionTypeSerializer
    permission_classes = [IsAuthenticated]

class ConnectionFilter(FilterSet):
    date_gte = DateFilter(field_name='created_at', lookup_expr='gte')
    date_lte = DateFilter(field_name='created_at', lookup_expr='lte')
    name = CharFilter(field_name='name', lookup_expr='icontains')

    class Meta:
        model = Connection
        fields = ['connection_type', 'area', 'status', 'date_gte', 'date_lte', 'name']

class ConnectionViewSet(viewsets.ModelViewSet):
    queryset = Connection.objects.all()
    serializer_class = ConnectionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = ConnectionFilter
    ordering_fields = ['created_at']
    ordering = ['created_at']