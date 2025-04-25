from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend, FilterSet, CharFilter
from .models import Complaint
from .serializers import ComplaintSerializer

class ComplaintFilter(FilterSet):
    name = CharFilter(field_name='name', lookup_expr='icontains')
    department = CharFilter(field_name='department', lookup_expr='exact')
    status = CharFilter(field_name='status', lookup_expr='exact')
    date__gte = CharFilter(field_name='date', lookup_expr='gte')
    date__lte = CharFilter(field_name='date', lookup_expr='lte')

    class Meta:
        model = Complaint
        fields = ['name', 'department', 'status', 'date__gte', 'date__lte']

class ComplaintViewSet(viewsets.ModelViewSet):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = ComplaintFilter
    ordering_fields = ['date', 'serial_no', 'ticket_number']
    ordering = ['-date']
