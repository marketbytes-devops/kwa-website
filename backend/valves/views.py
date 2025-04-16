from rest_framework import viewsets
from .models import Valve, ValveLog
from .serializers import ValveSerializer, ValveLogSerializer

class ValveViewSet(viewsets.ModelViewSet):
    queryset = Valve.objects.all()
    serializer_class = ValveSerializer

class ValveLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ValveLog.objects.all()
    serializer_class = ValveLogSerializer

    def get_queryset(self):
        valve_id = self.request.query_params.get('valve_id')
        return ValveLog.objects.filter(valve_id=valve_id)