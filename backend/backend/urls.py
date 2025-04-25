"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from api.views import (
    TicketViewSet, TrainTicketViewSet, PopularTourViewSet, TravelIdeaViewSet,
    GetCSRFToken, RegisterView, LoginView, LogoutView, UserProfileView,
    CountryViewSet, CityViewSet, LocationSuggestionView,
    SearchAirTicketViewSet, SearchTrainTicketViewSet, SearchTourViewSet,
    AirlineListViewSet, RailwayCompanyListViewSet
)
from django.conf import settings
from django.conf.urls.static import static

# Настраиваем роутер для API
router = routers.DefaultRouter()
router.register(r'tickets', TicketViewSet, basename='tickets')
router.register(r'train-tickets', TrainTicketViewSet, basename='train-tickets')
router.register(r'popular-tours', PopularTourViewSet, basename='popular-tours')
router.register(r'travel-ideas', TravelIdeaViewSet, basename='travel-ideas')
router.register(r'countries', CountryViewSet, basename='countries')
router.register(r'cities', CityViewSet, basename='cities')
router.register(r'search/air-tickets', SearchAirTicketViewSet, basename='search-air-tickets')
router.register(r'search/train-tickets', SearchTrainTicketViewSet, basename='search-train-tickets')
router.register(r'search/tours', SearchTourViewSet, basename='search-tours')
router.register(r'airlines', AirlineListViewSet, basename='airlines')
router.register(r'railway-companies', RailwayCompanyListViewSet, basename='railway-companies')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    # Auth endpoints
    path('api/auth/csrf-token/', GetCSRFToken.as_view(), name='csrf_token'),
    path('api/auth/register/', RegisterView.as_view(), name='register'),
    path('api/auth/login/', LoginView.as_view(), name='login'),
    path('api/auth/logout/', LogoutView.as_view(), name='logout'),
    path('api/auth/profile/', UserProfileView.as_view(), name='profile'),
    # Поисковые подсказки
    path('api/search/suggestions/', LocationSuggestionView.as_view(), name='location-suggestions'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
