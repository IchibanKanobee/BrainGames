from django.urls import path, include
from django.contrib import admin
from .views import AddGameTypeView, UpdateGameTypeView, DeleteGameTypeView, GameTypeListView, AddGameView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('djoser.urls')),  # Djoser user management endpoints
    path('auth/', include('djoser.urls.authtoken')),  # Djoser token-based auth
    path('add-game-type/', AddGameTypeView.as_view(), name='add-game-type'),
    path('update-game-type/', UpdateGameTypeView.as_view(), name='update-game-type'),
    path('delete-game-type/', DeleteGameTypeView.as_view(), name='delete-game-type'),
    path('game-types/', GameTypeListView.as_view(), name='game-type-list'),
    path('add-game/', AddGameView.as_view(), name='add-game'),
]