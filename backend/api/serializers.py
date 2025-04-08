from rest_framework import serializers
from .models import Ticket, Airline
from datetime import datetime
from django.utils import formats
import locale

# Устанавливаем русскую локаль для корректного отображения месяцев
locale.setlocale(locale.LC_TIME, 'ru_RU.UTF-8')

# Словарь для русских названий месяцев
MONTHS_RU = {
    1: 'января',
    2: 'февраля',
    3: 'марта',
    4: 'апреля',
    5: 'мая',
    6: 'июня',
    7: 'июля',
    8: 'августа',
    9: 'сентября',
    10: 'октября',
    11: 'ноября',
    12: 'декабря'
}

# Словарь для русских сокращений дней недели
WEEKDAYS_RU = {
    0: 'пн',
    1: 'вт',
    2: 'ср',
    3: 'чт',
    4: 'пт',
    5: 'сб',
    6: 'вс'
}

class AirlineSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()

    class Meta:
        model = Airline
        fields = ['id', 'name', 'code', 'logo_url']

    def get_logo_url(self, obj):
        if obj.logo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.logo.url)
            return obj.logo.url
        return None

class TicketSerializer(serializers.ModelSerializer):
    airlines = AirlineSerializer(many=True, read_only=True)
    
    class Meta:
        model = Ticket
        fields = [
            'id', 'from_city', 'to_city', 'departure_time', 'arrival_time',
            'current_price', 'old_price', 'date', 'duration', 'transfers',
            'airlines'
        ]
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Конвертируем время в строковый формат
        representation['departure_time'] = instance.departure_time.strftime('%H:%M')
        representation['arrival_time'] = instance.arrival_time.strftime('%H:%M')
        
        # Форматируем дату с русским названием месяца и днем недели
        date = instance.date
        try:
            # Получаем название месяца из словаря
            month = MONTHS_RU[date.month]
            # Получаем сокращенное название дня недели
            weekday = WEEKDAYS_RU[date.weekday()]
            # Форматируем полную дату
            representation['date'] = f"{date.day} {month}, {weekday}"
        except Exception as e:
            # В случае ошибки используем числовой формат
            representation['date'] = date.strftime('%d.%m.%Y')
        
        # Конвертируем decimal поля в float для JSON сериализации
        representation['current_price'] = float(instance.current_price)
        representation['old_price'] = float(instance.old_price)
        return representation 