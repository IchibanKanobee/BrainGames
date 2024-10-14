# serializers.py
from rest_framework import serializers
from .models import GameType

class GameTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameType
        fields = ['game_type_id', 'game_type_name']
