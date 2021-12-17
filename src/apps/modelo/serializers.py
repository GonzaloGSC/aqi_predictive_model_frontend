from rest_framework import serializers
from .models import modeloRespuesta


class realizarPrediccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = modeloRespuesta
        fields = (
            'fecha',
            'p1',
            'p2',
            'p3',
            'p4',
            'p5',
            'p6',
            'p7',
            'p8',
            'p9',
            'p10',
            'p11',
            'p12',
            'p13',
            'p14',
            'p15',
            'p16',
            'p17',
            'p18',
            'p19',
            'p20',
            'p21',
            'p22',
            'p23',
            'p24',
            'p25',
            'p26',
            'p27',
            'p28',
            'p29',
            'p30',

            'i_d',
            'i_m',
            'i_y',
            'i_aqi_max',
            'i_aqi_mean',
            'i_pm25',
            'i_pm10',
            'i_o3',
            'i_no2',
            'i_co',
            'i_codigo_comuna',
        )
