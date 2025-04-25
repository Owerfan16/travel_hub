from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Airline, Ticket, RailwayCompany, TrainTicket, PopularTour, TravelIdea,
    Country, City, Airport, RailwayStation, SearchAirTicket, SearchTrainTicket, SearchTour
)

class CustomModelAdmin(admin.ModelAdmin):
    """Базовый класс для настройки админ-панели моделей"""
    save_on_top = True
    list_per_page = 20

@admin.register(Airline)
class AirlineAdmin(CustomModelAdmin):
    list_display = ('name', 'code', 'logo_preview')
    list_display_links = ('name', 'code')
    search_fields = ('name', 'code')
    readonly_fields = ('logo_preview',)
    
    def logo_preview(self, obj):
        if obj.logo:
            return format_html('<img src="{}" width="50" height="50" />', obj.logo.url)
        return 'Нет логотипа'
    
    logo_preview.short_description = 'Превью логотипа'

@admin.register(Ticket)
class TicketAdmin(CustomModelAdmin):
    list_display = ('from_city', 'to_city', 'date', 'departure_time', 'arrival_time', 'duration', 'current_price', 'old_price', 'transfers')
    list_display_links = ('from_city', 'to_city')
    list_filter = ('date', 'airlines', 'from_city', 'to_city')
    list_editable = ('current_price', 'old_price')
    search_fields = ('from_city', 'to_city', 'airlines__name')
    filter_horizontal = ('airlines',)
    date_hierarchy = 'date'
    fieldsets = (
        ('Маршрут', {
            'fields': ('from_city', 'to_city', 'date', 'departure_time', 'arrival_time', 'duration', 'transfers')
        }),
        ('Цены', {
            'fields': ('current_price', 'old_price')
        }),
        ('Авиакомпании', {
            'fields': ('airlines',)
        }),
    )

@admin.register(RailwayCompany)
class RailwayCompanyAdmin(CustomModelAdmin):
    list_display = ('name', 'code', 'logo_preview')
    list_display_links = ('name', 'code')
    search_fields = ('name', 'code')
    readonly_fields = ('logo_preview',)
    
    def logo_preview(self, obj):
        if obj.logo:
            return format_html('<img src="{}" width="50" height="50" />', obj.logo.url)
        return 'Нет логотипа'
    
    logo_preview.short_description = 'Превью логотипа'

@admin.register(TrainTicket)
class TrainTicketAdmin(CustomModelAdmin):
    list_display = ('from_city', 'to_city', 'date', 'departure_time', 'arrival_time', 'duration', 'current_price', 'old_price', 'ticket_type')
    list_display_links = ('from_city', 'to_city')
    list_filter = ('date', 'companies', 'from_city', 'to_city', 'ticket_type')
    list_editable = ('current_price', 'old_price', 'ticket_type')
    search_fields = ('from_city', 'to_city', 'companies__name')
    filter_horizontal = ('companies',)
    date_hierarchy = 'date'
    fieldsets = (
        ('Маршрут', {
            'fields': ('from_city', 'to_city', 'date', 'departure_time', 'arrival_time', 'duration')
        }),
        ('Информация о билете', {
            'fields': ('ticket_type', 'current_price', 'old_price')
        }),
        ('Ж/Д компании', {
            'fields': ('companies',)
        }),
    )

@admin.register(PopularTour)
class PopularTourAdmin(CustomModelAdmin):
    list_display = ('hotel_name', 'country', 'city', 'rating', 'price', 'food_included', 'pets_allowed', 'near_sea', 'image_preview')
    list_display_links = ('hotel_name', 'country', 'city')
    list_filter = ('country', 'city', 'food_included', 'pets_allowed', 'near_sea')
    list_editable = ('rating', 'price', 'food_included', 'pets_allowed', 'near_sea')
    search_fields = ('country', 'city', 'hotel_name')
    readonly_fields = ('image_preview',)
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="100" height="70" style="object-fit: cover;" />', obj.image.url)
        return 'Нет изображения'
    
    image_preview.short_description = 'Превью фото'
    
    fieldsets = (
        ('Локация', {
            'fields': ('country', 'city', 'hotel_name')
        }),
        ('Детали тура', {
            'fields': ('price', 'rating')
        }),
        ('Дополнительные опции', {
            'fields': ('food_included', 'pets_allowed', 'near_sea')
        }),
        ('Изображение', {
            'fields': ('image', 'image_preview')
        }),
    )

@admin.register(TravelIdea)
class TravelIdeaAdmin(CustomModelAdmin):
    list_display = ('name', 'price_per_day', 'image_preview', 'created_at')
    list_display_links = ('name',)
    list_filter = ('created_at',)
    list_editable = ('price_per_day',)
    search_fields = ('name',)
    readonly_fields = ('image_preview', 'created_at')
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="100" height="70" style="object-fit: cover;" />', obj.image.url)
        return 'Нет изображения'
    
    image_preview.short_description = 'Превью фото'
    
    fieldsets = (
        ('Информация о локации', {
            'fields': ('name', 'price_per_day')
        }),
        ('Изображение', {
            'fields': ('image', 'image_preview'),
            'description': 'Поддерживаются форматы: JPG, PNG, AVIF. Рекомендуемый размер: 316x316 пикселей'
        }),
        ('Системная информация', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )

# Админки для новых моделей

class CityInline(admin.TabularInline):
    model = City
    extra = 1

@admin.register(Country)
class CountryAdmin(CustomModelAdmin):
    list_display = ('name', 'code', 'cities_count')
    list_display_links = ('name',)
    search_fields = ('name', 'code')
    inlines = [CityInline]
    
    def cities_count(self, obj):
        return obj.cities.count()
    
    cities_count.short_description = 'Количество городов'

class AirportInline(admin.TabularInline):
    model = Airport
    extra = 1

class RailwayStationInline(admin.TabularInline):
    model = RailwayStation
    extra = 1

@admin.register(City)
class CityAdmin(CustomModelAdmin):
    list_display = ('name', 'country', 'airports_count', 'railway_count')
    list_display_links = ('name',)
    list_filter = ('country',)
    search_fields = ('name', 'country__name')
    inlines = [AirportInline, RailwayStationInline]
    
    def airports_count(self, obj):
        return obj.airports.count()
    
    def railway_count(self, obj):
        return obj.railway_stations.count()
    
    airports_count.short_description = 'Аэропорты'
    railway_count.short_description = 'Ж/Д вокзалы'

@admin.register(Airport)
class AirportAdmin(CustomModelAdmin):
    list_display = ('name', 'code', 'city', 'country')
    list_display_links = ('name',)
    list_filter = ('city__country',)
    search_fields = ('name', 'code', 'city__name')
    
    def country(self, obj):
        return obj.city.country
    
    country.short_description = 'Страна'

@admin.register(RailwayStation)
class RailwayStationAdmin(CustomModelAdmin):
    list_display = ('name', 'city', 'country')
    list_display_links = ('name',)
    list_filter = ('city__country',)
    search_fields = ('name', 'city__name')
    
    def country(self, obj):
        return obj.city.country
    
    country.short_description = 'Страна'

@admin.register(SearchAirTicket)
class SearchAirTicketAdmin(CustomModelAdmin):
    list_display = ('from_city', 'to_city', 'departure_date', 'departure_time', 'arrival_time', 
                   'has_transfer', 'transfer_count', 'economy_price', 'recommendation_score', 'refundable')
    list_display_links = ('from_city', 'to_city')
    list_filter = ('departure_date', 'from_airport__city', 'to_airport__city', 'has_transfer', 'transfer_count',
                  'economy_available', 'business_available', 'requires_reregistration', 'night_transfer', 'refundable')
    list_editable = ('recommendation_score', 'refundable')
    search_fields = ('from_airport__city__name', 'to_airport__city__name', 'from_airport__name', 'to_airport__name')
    filter_horizontal = ('airlines',)
    date_hierarchy = 'departure_date'
    
    def from_city(self, obj):
        return f"{obj.from_airport.city.name} ({obj.from_airport.code})"
    
    def to_city(self, obj):
        return f"{obj.to_airport.city.name} ({obj.to_airport.code})"
    
    from_city.short_description = 'Откуда'
    to_city.short_description = 'Куда'
    
    fieldsets = (
        ('Маршрут', {
            'fields': ('from_airport', 'to_airport', 'departure_date', 'departure_time', 'arrival_time', 'duration')
        }),
        ('Пересадки', {
            'fields': ('has_transfer', 'transfer_count', 'transfer_city', 'transfer_duration', 
                       'requires_reregistration', 'night_transfer')
        }),
        ('Доп. информация', {
            'fields': ('refundable',)
        }),
        ('Авиакомпании', {
            'fields': ('airlines',)
        }),
        ('Классы обслуживания и цены', {
            'fields': (('economy_available', 'economy_price'), ('business_available', 'business_price'))
        }),
        ('Рейтинг для рекомендаций', {
            'fields': ('recommendation_score',),
            'description': 'Чем выше значение (0-100), тем выше билет будет отображаться в рекомендациях'
        }),
    )

    class Media:
        js = ('admin/js/ticket_admin.js',)

@admin.register(SearchTrainTicket)
class SearchTrainTicketAdmin(CustomModelAdmin):
    list_display = ('from_city', 'to_city', 'departure_date', 'departure_time', 'arrival_time', 
                   'train_type', 'has_classes', 'coupe_price', 'recommendation_score')
    list_display_links = ('from_city', 'to_city')
    list_filter = ('departure_date', 'from_station__city', 'to_station__city',
                  'sitting_available', 'platzkart_available', 'coupe_available', 'sv_available')
    list_editable = ('recommendation_score', 'train_type')
    search_fields = ('from_station__city__name', 'to_station__city__name', 'from_station__name', 'to_station__name', 'train_type')
    filter_horizontal = ('companies',)
    date_hierarchy = 'departure_date'
    
    def from_city(self, obj):
        return f"{obj.from_station.city.name} ({obj.from_station.name})"
    
    def to_city(self, obj):
        return f"{obj.to_station.city.name} ({obj.to_station.name})"
    
    def has_classes(self, obj):
        classes = []
        if obj.sitting_available: classes.append("Сидячий")
        if obj.platzkart_available: classes.append("Плацкарт")
        if obj.coupe_available: classes.append("Купе")
        if obj.sv_available: classes.append("СВ")
        return ", ".join(classes)
    
    from_city.short_description = 'Откуда'
    to_city.short_description = 'Куда'
    has_classes.short_description = 'Доступные классы'
    
    fieldsets = (
        ('Маршрут', {
            'fields': ('from_station', 'to_station', 'departure_date', 'departure_time', 'arrival_time', 'duration', 'train_type')
        }),
        ('Ж/Д компании', {
            'fields': ('companies',)
        }),
        ('Классы обслуживания и цены', {
            'fields': (
                ('sitting_available', 'sitting_price'), 
                ('platzkart_available', 'platzkart_price'),
                ('coupe_available', 'coupe_price'),
                ('sv_available', 'sv_price')
            )
        }),
        ('Рейтинг для рекомендаций', {
            'fields': ('recommendation_score',),
            'description': 'Чем выше значение (0-100), тем выше билет будет отображаться в рекомендациях'
        }),
    )

@admin.register(SearchTour)
class SearchTourAdmin(CustomModelAdmin):
    list_display = ('hotel_name', 'city_country', 'hotel_stars', 'rating', 'price_per_night', 
                   'food_included', 'pets_allowed', 'near_sea', 'image_preview', 'recommendation_score')
    list_display_links = ('hotel_name',)
    list_filter = ('city__country', 'hotel_stars', 'food_included', 'pets_allowed', 'near_sea')
    list_editable = ('recommendation_score', 'hotel_stars', 'price_per_night', 'food_included', 'pets_allowed', 'near_sea')
    search_fields = ('hotel_name', 'city__name', 'city__country__name')
    readonly_fields = ('image_preview',)
    
    def city_country(self, obj):
        return f"{obj.city.name}, {obj.city.country.name}"
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="100" height="70" style="object-fit: cover;" />', obj.image.url)
        return 'Нет изображения'
    
    city_country.short_description = 'Город, Страна'
    image_preview.short_description = 'Превью фото'
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('city', 'hotel_name', 'hotel_stars', 'rating')
        }),
        ('Опции', {
            'fields': ('food_included', 'pets_allowed', 'near_sea')
        }),
        ('Цены', {
            'fields': ('price_per_night', 'recommendation_score')
        }),
        ('Изображение', {
            'fields': ('image', 'image_preview'),
            'description': 'Поддерживаются форматы: JPG, PNG, AVIF, WEBP. Рекомендуемый размер: 500x500 пикселей'
        }),
    )

# Модели уже зарегистрированы в декораторах выше
# admin.site.register(SearchAirTicket, SearchAirTicketAdmin)
# admin.site.register(SearchTrainTicket, SearchTrainTicketAdmin)
# admin.site.register(SearchTour, SearchTourAdmin)
