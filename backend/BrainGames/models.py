from django.db import models
from django.contrib.auth.models import User

# GameType Model
class GameType(models.Model):
    game_type_id = models.AutoField(primary_key=True)
    game_type_name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.game_type_name

# Game Model
class Game(models.Model):
    game_id = models.AutoField(primary_key=True)
    game_name = models.CharField(max_length=255)
    game_types = models.ManyToManyField(GameType, related_name='games')

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

