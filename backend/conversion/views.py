from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend, FilterSet, DateFilter, CharFilter
from rest_framework.filters import OrderingFilter
from .models import Conversion
from .serializers import ConversionSerializer

class ConversionFilter(FilterSet):
    date_gte = DateFilter(field_name='created_at', lookup_expr='gte')
    date_lte = DateFilter(field_name='created_at', lookup_expr='lte')
    name = CharFilter(field_name='name', lookup_expr='icontains')

    class Meta:
        model = Conversion
        fields = ['from_connection_type', 'to_connection_type', 'area', 'date_gte', 'date_lte', 'name']

class ConversionViewSet(viewsets.ModelViewSet):
    queryset = Conversion.objects.all()
    serializer_class = ConversionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = ConversionFilter
    ordering_fields = ['created_at']
    ordering = ['created_at']