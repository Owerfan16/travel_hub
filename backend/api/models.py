from django.db import models

# Create your models here.

class Airline(models.Model):
    name = models.CharField(max_length=100, verbose_name="Название")
    code = models.CharField(max_length=10, verbose_name="Код")
    logo = models.FileField(upload_to='airlines/', null=True, blank=True, verbose_name="Логотип")

    class Meta:
        verbose_name = "Авиакомпания"
        verbose_name_plural = "Авиакомпании"

    def __str__(self):
        return self.name

class Ticket(models.Model):
    from_city = models.CharField(max_length=100, verbose_name="Город отправления")
    to_city = models.CharField(max_length=100, verbose_name="Город прибытия")
    departure_time = models.TimeField(verbose_name="Время отправления")
    arrival_time = models.TimeField(verbose_name="Время прибытия")
    current_price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Актуальная цена")
    old_price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Старая цена")
    date = models.DateField(verbose_name="Дата")
    duration = models.CharField(max_length=50, verbose_name="Время в пути")
    transfers = models.CharField(max_length=100, verbose_name="Пересадки")
    airlines = models.ManyToManyField(Airline, verbose_name="Авиакомпании")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Горячий авиабилет"
        verbose_name_plural = "Горячие авиабилеты"

    def __str__(self):
        return f"{self.from_city} — {self.to_city} ({self.date})"

class RailwayCompany(models.Model):
    name = models.CharField(max_length=100, verbose_name="Название")
    code = models.CharField(max_length=10, verbose_name="Код")
    logo = models.FileField(upload_to='railways/', null=True, blank=True, verbose_name="Логотип")

    class Meta:
        verbose_name = "Ж/Д компания"
        verbose_name_plural = "Ж/Д компании"

    def __str__(self):
        return self.name

class TrainTicket(models.Model):
    from_city = models.CharField(max_length=100, verbose_name="Город отправления")
    to_city = models.CharField(max_length=100, verbose_name="Город прибытия")
    departure_time = models.TimeField(verbose_name="Время отправления")
    arrival_time = models.TimeField(verbose_name="Время прибытия")
    current_price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Актуальная цена")
    old_price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Старая цена")
    date = models.DateField(verbose_name="Дата")
    duration = models.CharField(max_length=50, verbose_name="Время в пути")
    ticket_type = models.CharField(max_length=50, verbose_name="Тип билета")  # Купе/СВ/Плацкарт/Сидячий
    companies = models.ManyToManyField(RailwayCompany, verbose_name="Ж/Д компании")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Горячий Ж/Д билет"
        verbose_name_plural = "Горячие Ж/Д билеты"

    def __str__(self):
        return f"{self.from_city} — {self.to_city} ({self.date})"
