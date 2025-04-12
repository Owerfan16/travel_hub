from django.contrib import admin
from django.utils.html import format_html
from .models import Airline, Ticket, RailwayCompany, TrainTicket

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
