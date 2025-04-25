from rest_framework import serializers
from .models import (
    Ticket, Airline, RailwayCompany, TrainTicket, PopularTour, TravelIdea,
    Country, City, Airport, RailwayStation, SearchAirTicket, SearchTrainTicket, SearchTour
)
from datetime import datetime
from django.utils import formats
import locale
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

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

class RailwayCompanySerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()

    class Meta:
        model = RailwayCompany
        fields = ['id', 'name', 'code', 'logo_url']

    def get_logo_url(self, obj):
        if obj.logo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.logo.url)
            return obj.logo.url
        return None

class TrainTicketSerializer(serializers.ModelSerializer):
    companies = RailwayCompanySerializer(many=True, read_only=True)
    
    class Meta:
        model = TrainTicket
        fields = [
            'id', 'from_city', 'to_city', 'departure_time', 'arrival_time',
            'current_price', 'old_price', 'date', 'duration', 'ticket_type',
            'companies'
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

class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    phone = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ('id', 'email', 'name', 'phone')
        read_only_fields = ('id',)
    
    def get_name(self, obj):
        return obj.first_name or obj.username
    
    def get_phone(self, obj):
        # Phone not available in standard User model
        return None

class RegisterSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'name', 'password')
        extra_kwargs = {'password': {'write_only': True}}
    
    def create(self, validated_data):
        name = validated_data.pop('name', '')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=name
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, data):
        try:
            user = User.objects.get(email=data['email'])
            if user and user.check_password(data['password']):
                return user
        except User.DoesNotExist:
            pass
        
        raise serializers.ValidationError("Incorrect Credentials")

class PopularTourSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = PopularTour
        fields = [
            'id', 'image_url', 'rating', 'country', 'city', 'hotel_name',
            'food_included', 'pets_allowed', 'near_sea', 'price'
        ]
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Конвертируем decimal поля в float для JSON сериализации
        representation['rating'] = float(instance.rating)
        representation['price'] = float(instance.price)
        return representation

class TravelIdeaSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = TravelIdea
        fields = [
            'id', 'name', 'price_per_day', 'image_url'
        ]
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Конвертируем decimal поля в float для JSON сериализации
        representation['price_per_day'] = float(instance.price_per_day)
        return representation

# Сериализаторы для новых моделей

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['id', 'name', 'code']

class CitySerializer(serializers.ModelSerializer):
    country = CountrySerializer(read_only=True)
    
    class Meta:
        model = City
        fields = ['id', 'name', 'country']

class AirportSerializer(serializers.ModelSerializer):
    city = CitySerializer(read_only=True)
    
    class Meta:
        model = Airport
        fields = ['id', 'name', 'code', 'city']

class RailwayStationSerializer(serializers.ModelSerializer):
    city = CitySerializer(read_only=True)
    
    class Meta:
        model = RailwayStation
        fields = ['id', 'name', 'city']

class SearchAirTicketSerializer(serializers.ModelSerializer):
    from_airport = AirportSerializer(read_only=True)
    to_airport = AirportSerializer(read_only=True)
    transfer_city = CitySerializer(read_only=True)
    airlines = AirlineSerializer(many=True, read_only=True)
    
    class Meta:
        model = SearchAirTicket
        fields = [
            'id', 'from_airport', 'to_airport', 'departure_date', 'departure_time', 
            'arrival_time', 'duration', 'has_transfer', 'transfer_city', 
            'transfer_duration', 'airlines', 'economy_available', 'economy_price',
            'business_available', 'business_price'
        ]
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Конвертируем время в строковый формат
        representation['departure_time'] = instance.departure_time.strftime('%H:%M')
        representation['arrival_time'] = instance.arrival_time.strftime('%H:%M')
        
        # Форматируем дату с русским названием месяца и днем недели
        date = instance.departure_date
        try:
            # Получаем название месяца из словаря
            month = MONTHS_RU[date.month]
            # Получаем сокращенное название дня недели
            weekday = WEEKDAYS_RU[date.weekday()]
            # Форматируем полную дату
            representation['departure_date_formatted'] = f"{date.day} {month}, {weekday}"
        except Exception as e:
            # В случае ошибки используем числовой формат
            representation['departure_date_formatted'] = date.strftime('%d.%m.%Y')
        
        # Конвертируем decimal поля в float для JSON сериализации
        representation['economy_price'] = float(instance.economy_price)
        if instance.business_price:
            representation['business_price'] = float(instance.business_price)
        
        # Добавляем название пересадки
        if instance.has_transfer and instance.transfer_city:
            transfer_info = f"1 пересадка в {instance.transfer_city.name}"
            if instance.transfer_duration:
                transfer_info += f", {instance.transfer_duration} ч"
            representation['transfer_info'] = transfer_info
        else:
            representation['transfer_info'] = "Прямой"
        
        return representation

class SearchTrainTicketSerializer(serializers.ModelSerializer):
    from_station = RailwayStationSerializer(read_only=True)
    to_station = RailwayStationSerializer(read_only=True)
    companies = RailwayCompanySerializer(many=True, read_only=True)
    
    class Meta:
        model = SearchTrainTicket
        fields = [
            'id', 'from_station', 'to_station', 'departure_date', 'departure_time', 
            'arrival_time', 'duration', 'companies', 'train_type',
            'sitting_available', 'sitting_price', 'platzkart_available', 
            'platzkart_price', 'coupe_available', 'coupe_price',
            'sv_available', 'sv_price'
        ]
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Конвертируем время в строковый формат
        representation['departure_time'] = instance.departure_time.strftime('%H:%M')
        representation['arrival_time'] = instance.arrival_time.strftime('%H:%M')
        
        # Форматируем дату с русским названием месяца и днем недели
        date = instance.departure_date
        try:
            # Получаем название месяца из словаря
            month = MONTHS_RU[date.month]
            # Получаем сокращенное название дня недели
            weekday = WEEKDAYS_RU[date.weekday()]
            # Форматируем полную дату
            representation['departure_date_formatted'] = f"{date.day} {month}, {weekday}"
        except Exception as e:
            # В случае ошибки используем числовой формат
            representation['departure_date_formatted'] = date.strftime('%d.%m.%Y')
        
        # Конвертируем decimal поля в float для JSON сериализации
        prices = {}
        if instance.sitting_available and instance.sitting_price:
            prices['sitting'] = float(instance.sitting_price)
        if instance.platzkart_available and instance.platzkart_price:
            prices['platzkart'] = float(instance.platzkart_price)
        if instance.coupe_available and instance.coupe_price:
            prices['coupe'] = float(instance.coupe_price)
        if instance.sv_available and instance.sv_price:
            prices['sv'] = float(instance.sv_price)
        
        representation['prices'] = prices
        
        # Добавляем текущий минимальный класс
        min_price = float('inf')
        current_class = None
        
        if instance.sitting_available and instance.sitting_price and float(instance.sitting_price) < min_price:
            min_price = float(instance.sitting_price)
            current_class = "сидячий"
        if instance.platzkart_available and instance.platzkart_price and float(instance.platzkart_price) < min_price:
            min_price = float(instance.platzkart_price)
            current_class = "плацкарт"
        if instance.coupe_available and instance.coupe_price and float(instance.coupe_price) < min_price:
            min_price = float(instance.coupe_price)
            current_class = "купе"
        if instance.sv_available and instance.sv_price and float(instance.sv_price) < min_price:
            min_price = float(instance.sv_price)
            current_class = "СВ"
        
        representation['current_class'] = current_class
        representation['current_price'] = min_price if min_price != float('inf') else None
        
        return representation

class SearchTourSerializer(serializers.ModelSerializer):
    city = CitySerializer(read_only=True)
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = SearchTour
        fields = [
            'id', 'city', 'hotel_name', 'hotel_stars', 'rating', 
            'food_included', 'pets_allowed', 'near_sea', 'image_url', 'price_per_night'
        ]
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Конвертируем decimal поля в float для JSON сериализации
        representation['rating'] = float(instance.rating)
        representation['price_per_night'] = float(instance.price_per_night)
        
        # Получаем количество ночей из параметров запроса
        request = self.context.get('request')
        nights = 7  # По умолчанию 7 ночей
        
        if request and request.query_params.get('nights'):
            try:
                nights = int(request.query_params.get('nights'))
            except (ValueError, TypeError):
                pass
        
        # Рассчитываем полную стоимость
        representation['total_nights'] = nights
        representation['total_price'] = float(instance.price_per_night) * nights
        
        return representation 