from django.db import models

# Create your models here.

class Airline(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10)
    logo = models.FileField(upload_to='airlines/', null=True, blank=True)

    def __str__(self):
        return self.name

class Ticket(models.Model):
    from_city = models.CharField(max_length=100)
    to_city = models.CharField(max_length=100)
    departure_time = models.TimeField()
    arrival_time = models.TimeField()
    current_price = models.DecimalField(max_digits=10, decimal_places=2)
    old_price = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    duration = models.CharField(max_length=50)
    transfers = models.CharField(max_length=100)
    airlines = models.ManyToManyField(Airline)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.from_city} — {self.to_city} ({self.date})"
