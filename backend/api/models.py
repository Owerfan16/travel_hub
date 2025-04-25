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

class PopularTour(models.Model):
    image = models.FileField(upload_to='tours/', verbose_name="Фото тура", help_text="Поддерживаются форматы JPG, PNG, GIF, AVIF")
    rating = models.DecimalField(max_digits=3, decimal_places=1, verbose_name="Оценка", help_text="Например: 4.8")
    country = models.CharField(max_length=100, verbose_name="Страна")
    city = models.CharField(max_length=100, verbose_name="Город")
    hotel_name = models.CharField(max_length=200, verbose_name="Название отеля")
    food_included = models.BooleanField(default=False, verbose_name="Питание включено")
    pets_allowed = models.BooleanField(default=False, verbose_name="Можно с животными")
    near_sea = models.BooleanField(default=False, verbose_name="Рядом с морем")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Цена от")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Популярный тур"
        verbose_name_plural = "Популярные туры"

    def __str__(self):
        return f"{self.country}, {self.city}, {self.hotel_name}"

class TravelIdea(models.Model):
    name = models.CharField(max_length=200, verbose_name="Название локации")
    price_per_day = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Цена за сутки")
    image = models.FileField(
        upload_to='travel_ideas/', 
        verbose_name="Фото", 
        help_text="Поддерживаются форматы JPG, PNG, AVIF"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Идея для поездки"
        verbose_name_plural = "Идеи для поездок"

    def __str__(self):
        return f"{self.name} (от {self.price_per_day} ₽/сутки)"

    def save(self, *args, **kwargs):
        # Проверяем, что файл существует и является изображением
        if self.image and not self.pk:  # Только для новых объектов
            valid_extensions = ['.jpg', '.jpeg', '.png', '.avif']
            import os
            ext = os.path.splitext(self.image.name)[1].lower()
            if ext not in valid_extensions:
                from django.core.exceptions import ValidationError
                raise ValidationError(f'Неподдерживаемый формат файла. Используйте: {", ".join(valid_extensions)}')
        super().save(*args, **kwargs)

# Новые модели для системы поиска

class Country(models.Model):
    name = models.CharField(max_length=100, verbose_name="Название страны")
    code = models.CharField(max_length=2, verbose_name="Код страны", help_text="Двухбуквенный код страны (ISO)", blank=True, null=True)
    
    class Meta:
        verbose_name = "Страна"
        verbose_name_plural = "Страны"
        ordering = ['name']
    
    def __str__(self):
        return self.name

class City(models.Model):
    name = models.CharField(max_length=100, verbose_name="Название города")
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name='cities', verbose_name="Страна")
    
    class Meta:
        verbose_name = "Город"
        verbose_name_plural = "Города"
        ordering = ['name']
        unique_together = ['name', 'country']
    
    def __str__(self):
        return f"{self.name}, {self.country.name}"

class Airport(models.Model):
    name = models.CharField(max_length=200, verbose_name="Название аэропорта")
    code = models.CharField(max_length=3, verbose_name="Код аэропорта", help_text="Трёхбуквенный код аэропорта (IATA)")
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='airports', verbose_name="Город")
    
    class Meta:
        verbose_name = "Аэропорт"
        verbose_name_plural = "Аэропорты"
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({self.code}), {self.city.name}"

class RailwayStation(models.Model):
    name = models.CharField(max_length=200, verbose_name="Название ж/д вокзала")
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='railway_stations', verbose_name="Город")
    
    class Meta:
        verbose_name = "Ж/Д вокзал"
        verbose_name_plural = "Ж/Д вокзалы"
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name}, {self.city.name}"

class SearchAirTicket(models.Model):
    # Основная информация
    from_airport = models.ForeignKey(Airport, on_delete=models.CASCADE, related_name='departures', verbose_name="Аэропорт отправления")
    to_airport = models.ForeignKey(Airport, on_delete=models.CASCADE, related_name='arrivals', verbose_name="Аэропорт прибытия")
    departure_date = models.DateField(verbose_name="Дата вылета")
    departure_time = models.TimeField(verbose_name="Время вылета")
    arrival_time = models.TimeField(verbose_name="Время прибытия")
    duration = models.CharField(max_length=50, verbose_name="Время в пути")
    
    # Пересадки
    has_transfer = models.BooleanField(default=False, verbose_name="Есть пересадка")
    transfer_city = models.ForeignKey(City, on_delete=models.SET_NULL, null=True, blank=True, related_name='air_transfers', verbose_name="Город пересадки")
    transfer_duration = models.PositiveIntegerField(null=True, blank=True, verbose_name="Длительность пересадки (ч)")
    transfer_count = models.PositiveIntegerField(default=0, verbose_name="Количество пересадок", help_text="0 - прямой рейс, 1 - одна пересадка, 2 - две пересадки")
    requires_reregistration = models.BooleanField(default=False, verbose_name="Требуется повторная регистрация")
    night_transfer = models.BooleanField(default=False, verbose_name="Ночная пересадка")
    refundable = models.BooleanField(default=False, verbose_name="Возвратный билет")
    
    # Авиакомпании
    airlines = models.ManyToManyField(Airline, verbose_name="Авиакомпании")
    
    # Классы обслуживания и цены
    economy_available = models.BooleanField(default=True, verbose_name="Доступен эконом-класс")
    economy_price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Цена эконом-класса")
    business_available = models.BooleanField(default=False, verbose_name="Доступен бизнес-класс")
    business_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="Цена бизнес-класса")
    
    # Рейтинг для рекомендаций
    recommendation_score = models.PositiveIntegerField(default=0, verbose_name="Рейтинг рекомендации", help_text="Чем выше значение, тем выше в результатах поиска (0-100)")
    
    # Метаданные
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    
    class Meta:
        verbose_name = "Авиабилет для поиска"
        verbose_name_plural = "Авиабилеты для поиска"
        ordering = ['-recommendation_score', 'economy_price']
    
    def __str__(self):
        return f"{self.from_airport.city.name} — {self.to_airport.city.name} ({self.departure_date})"

class SearchTrainTicket(models.Model):
    # Основная информация
    from_station = models.ForeignKey(RailwayStation, on_delete=models.CASCADE, related_name='departures', verbose_name="Ж/Д вокзал отправления")
    to_station = models.ForeignKey(RailwayStation, on_delete=models.CASCADE, related_name='arrivals', verbose_name="Ж/Д вокзал прибытия")
    departure_date = models.DateField(verbose_name="Дата отправления")
    departure_time = models.TimeField(verbose_name="Время отправления")
    arrival_time = models.TimeField(verbose_name="Время прибытия")
    duration = models.CharField(max_length=50, verbose_name="Время в пути")
    train_type = models.CharField(max_length=100, blank=True, null=True, verbose_name="Тип поезда", help_text="Например: 026Г (двухэтажный состав)")
    
    # Ж/Д компании
    companies = models.ManyToManyField(RailwayCompany, verbose_name="Ж/Д компании")
    
    # Классы обслуживания и цены
    sitting_available = models.BooleanField(default=False, verbose_name="Доступен сидячий")
    sitting_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="Цена сидячего")
    platzkart_available = models.BooleanField(default=False, verbose_name="Доступен плацкарт")
    platzkart_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="Цена плацкарта")
    coupe_available = models.BooleanField(default=False, verbose_name="Доступен купе")
    coupe_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="Цена купе")
    sv_available = models.BooleanField(default=False, verbose_name="Доступен СВ")
    sv_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="Цена СВ")
    
    # Рейтинг для рекомендаций
    recommendation_score = models.PositiveIntegerField(default=0, verbose_name="Рейтинг рекомендации", help_text="Чем выше значение, тем выше в результатах поиска (0-100)")
    
    # Метаданные
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    
    class Meta:
        verbose_name = "Ж/Д билет для поиска"
        verbose_name_plural = "Ж/Д билеты для поиска"
        ordering = ['-recommendation_score', 'coupe_price']
    
    def __str__(self):
        return f"{self.from_station.city.name} — {self.to_station.city.name} ({self.departure_date})"

class SearchTour(models.Model):
    # Основная информация
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='tours', verbose_name="Город")
    hotel_name = models.CharField(max_length=200, verbose_name="Название отеля")
    hotel_stars = models.PositiveIntegerField(verbose_name="Количество звезд отеля", choices=[(i, f"{i}") for i in range(1, 6)])
    rating = models.DecimalField(max_digits=3, decimal_places=1, verbose_name="Рейтинг", help_text="Например: 4.8")
    
    # Опции
    food_included = models.BooleanField(default=False, verbose_name="Питание включено")
    pets_allowed = models.BooleanField(default=False, verbose_name="Можно с животными")
    near_sea = models.BooleanField(default=False, verbose_name="Рядом с морем")
    
    # Изображение
    image = models.FileField(
        upload_to='search_tours/', 
        verbose_name="Фото тура", 
        help_text="Поддерживаются форматы JPG, PNG, AVIF"
    )
    
    # Цена за ночь
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Цена за одну ночь")
    
    # Рейтинг для рекомендаций
    recommendation_score = models.PositiveIntegerField(default=0, verbose_name="Рейтинг рекомендации", help_text="Чем выше значение, тем выше в результатах поиска (0-100)")
    
    # Метаданные
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    
    class Meta:
        verbose_name = "Тур для поиска"
        verbose_name_plural = "Туры для поиска"
        ordering = ['-recommendation_score', 'price_per_night']
    
    def __str__(self):
        return f"{self.hotel_name}, {self.city.name} ({self.hotel_stars}★)"
