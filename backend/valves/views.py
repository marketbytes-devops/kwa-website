from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend, FilterSet, CharFilter
from .models import Valve, ValveLog
from .serializers import ValveSerializer, ValveLogSerializer
from .permissions import HasDeletePermission

class ValveFilter(FilterSet):
    name = CharFilter(field_name='name', lookup_expr='icontains')

    class Meta:
        model = Valve
        fields = ['name']

class ValveViewSet(viewsets.ModelViewSet):
    queryset = Valve.objects.all()
    serializer_class = ValveSerializer
    permission_classes = [IsAuthenticated, HasDeletePermission]
    filter_backends = [DjangoFilterBackend]
    filterset_class = ValveFilter
    page_name = 'valves'

class ValveLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ValveLog.objects.all()
    serializer_class = ValveLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        valve_id = self.request.query_params.get('valve_id')
        return ValveLog.objects.filter(valve_id=valve_id)
