from django.contrib import admin
from .models import Airline, Ticket

@admin.register(Airline)
class AirlineAdmin(admin.ModelAdmin):
    list_display = ('name', 'code')
    search_fields = ('name', 'code')

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ('from_city', 'to_city', 'date', 'current_price', 'transfers')
    list_filter = ('date', 'airlines')
    search_fields = ('from_city', 'to_city')
    filter_horizontal = ('airlines',)
