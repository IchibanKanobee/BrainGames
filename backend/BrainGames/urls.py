from django.urls import path, include
from django.contrib import admin

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('djoser.urls')),  # Djoser user management endpoints
    path('auth/', include('djoser.urls.authtoken')),  # Djoser token-based auth

]