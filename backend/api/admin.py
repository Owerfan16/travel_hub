from django.contrib import admin
from django.utils.html import format_html
from .models import Airline, Ticket, RailwayCompany, TrainTicket, PopularTour, TravelIdea

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
    list_display = ('hotel_name', 'country', 'city', 'rating', 'price', 'food_included', 'pets_allowed', 'image_preview')
    list_display_links = ('hotel_name', 'country', 'city')
    list_filter = ('country', 'city', 'food_included', 'pets_allowed')
    list_editable = ('rating', 'price', 'food_included', 'pets_allowed')
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
            'fields': ('food_included', 'pets_allowed')
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
