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
from rest_framework.routers import DefaultRouter
from api.views import TicketViewSet, TrainTicketViewSet, PopularTourViewSet, TravelIdeaViewSet, RegisterView, LoginView, UserProfileView, LogoutView, GetCSRFToken
from django.conf import settings
from django.conf.urls.static import static

# Create a router and register our viewsets with it
router = DefaultRouter()
router.register(r'tickets', TicketViewSet, basename='ticket')
router.register(r'train-tickets', TrainTicketViewSet, basename='train-ticket')
router.register(r'popular-tours', PopularTourViewSet, basename='popular-tour')
router.register(r'travel-ideas', TravelIdeaViewSet, basename='travel-idea')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    # Auth endpoints
    path('api/auth/csrf-token/', GetCSRFToken.as_view(), name='csrf_token'),
    path('api/auth/register/', RegisterView.as_view(), name='register'),
    path('api/auth/login/', LoginView.as_view(), name='login'),
    path('api/auth/logout/', LogoutView.as_view(), name='logout'),
    path('api/auth/profile/', UserProfileView.as_view(), name='profile'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
