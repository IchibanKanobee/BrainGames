# serializers.py
from rest_framework import serializers
from .models import GameType, Game

class GameTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameType
        fields = ['game_type_id', 'game_type_name', 'game_type_image']


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['game_id', 'game_name', 'game_types', 'game_complexity',
                  'game_url', 'game_description', 'game_image']
