from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.conf import settings
import os

def get_image_upload_path(instance, filename):
    return os.path.join(settings.IMAGE_UPLOAD_DIR, filename)

# GameType Model
class GameType(models.Model):
    game_type_id = models.AutoField(primary_key=True)
    game_type_name = models.CharField(max_length=255, unique=True)
    game_type_image = models.ImageField(upload_to=get_image_upload_path, default=settings.DEFAULT_GAME_TYPE_IMAGE_PATH)  # Add the image field

    def __str__(self):
        return self.game_type_name
    
    
# Game Model
class Game(models.Model):
    game_id = models.AutoField(primary_key=True)
    game_name = models.CharField(max_length=255)
    game_types = models.ManyToManyField(GameType, related_name='games')
    game_complexity = models.IntegerField(default=1,
        validators=[MinValueValidator(1), MaxValueValidator(100)])

    game_route_path = models.CharField(max_length=255, default='') #the url will include parameters for the same component but different complexities
    game_description = models.CharField(max_length=500, default='')
    game_image = models.ImageField(upload_to=get_image_upload_path, default=settings.DEFAULT_GAME_IMAGE_PATH)

    def __str__(self):
        return self.game_name


# GameResult Model
class GameSession(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    game_score = models.IntegerField()
    game_level = models.IntegerField()
    started_at = models.DateTimeField(auto_now_add=True)
    finished_at = models.DateTimeField()

    def __str__(self):
        return f'{self.user.username} - {self.game.game_name} - {self.game_score}'

