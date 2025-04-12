from rest_framework import serializers
from .models import Ticket, Airline, RailwayCompany, TrainTicket, PopularTour
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
            'food_included', 'pets_allowed', 'price'
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