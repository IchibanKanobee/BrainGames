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
    game_type_image = models.ImageField(upload_to=get_image_upload_path, default='images/default.jpeg')  # Add the image field

    def __str__(self):
        return self.game_type_name
# Game Model
class Game(models.Model):
    game_id = models.AutoField(primary_key=True)
    game_name = models.CharField(max_length=255)
    game_types = models.ManyToManyField(GameType, related_name='games')
    complexity_score = models.IntegerField(default=1,
        validators=[MinValueValidator(1), MaxValueValidator(10)])
 
    def __str__(self):
        return self.game_name

# GameResult Model
class GameResult(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    game_score = models.IntegerField()
    played_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} - {self.game.game_name} - {self.game_score}'

