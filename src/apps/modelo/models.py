from django.db import models

class modeloRespuesta(models.Model):
    fecha = models.DateField(null=False, blank=False)
    p1 = models.FloatField(null=False, blank=False)
    p2 = models.FloatField(null=False, blank=False)
    p3 = models.FloatField(null=False, blank=False)
    p4 = models.FloatField(null=False, blank=False)
    p5 = models.FloatField(null=False, blank=False)
    p6 = models.FloatField(null=False, blank=False)
    p7 = models.FloatField(null=False, blank=False)
    p8 = models.FloatField(null=False, blank=False)
    p9 = models.FloatField(null=False, blank=False)
    p10 = models.FloatField(null=False, blank=False)
    p11 = models.FloatField(null=False, blank=False)
    p12 = models.FloatField(null=False, blank=False)
    p13 = models.FloatField(null=False, blank=False)
    p14 = models.FloatField(null=False, blank=False)
    p15 = models.FloatField(null=False, blank=False)
    p16 = models.FloatField(null=False, blank=False)
    p17 = models.FloatField(null=False, blank=False)
    p18 = models.FloatField(null=False, blank=False)
    p19 = models.FloatField(null=False, blank=False)
    p20 = models.FloatField(null=False, blank=False)
    p21 = models.FloatField(null=False, blank=False)
    p22 = models.FloatField(null=False, blank=False)
    p23 = models.FloatField(null=False, blank=False)
    p24 = models.FloatField(null=False, blank=False)
    p25 = models.FloatField(null=False, blank=False)
    p26 = models.FloatField(null=False, blank=False)
    p27 = models.FloatField(null=False, blank=False)
    p28 = models.FloatField(null=False, blank=False)
    p29 = models.FloatField(null=False, blank=False)
    p30 = models.FloatField(null=False, blank=False)

    i_d = models.FloatField(null=False, blank=False)
    i_m = models.FloatField(null=False, blank=False)
    i_y = models.FloatField(null=False, blank=False)
    i_aqi_max = models.FloatField(null=False, blank=False)
    i_aqi_mean = models.FloatField(null=False, blank=False)
    i_pm25 = models.FloatField(null=False, blank=False)
    i_pm10 = models.FloatField(null=False, blank=False)
    i_o3 = models.FloatField(null=False, blank=False)
    i_no2 = models.FloatField(null=False, blank=False)
    i_co = models.FloatField(null=False, blank=False)
    i_codigo_comuna = models.FloatField(null=False, blank=False)
    def __str__(self):
        return self.fecha