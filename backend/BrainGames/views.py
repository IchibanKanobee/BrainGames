# views.py
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import GameType
from .serializers import GameTypeSerializer

class AddGameTypeView(APIView):
    def post(self, request):
        serializer = GameTypeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import GameType

class UpdateGameTypeView(APIView):
    def put(self, request):
        old_name = request.data.get('oldName')
        new_name = request.data.get('newName')

        try:
            game_type = GameType.objects.get(game_type_name=old_name)
            game_type.game_type_name = new_name
            game_type.save()
            return Response({"message": "Game type updated successfully"}, status=status.HTTP_200_OK)
        except GameType.DoesNotExist:
            return Response({"error": "Game type not found"}, status=status.HTTP_404_NOT_FOUND)

class DeleteGameTypeView(APIView):
    def delete(self, request):
        game_type_name = request.data.get('game_type_name')

        try:
            game_type = GameType.objects.get(game_type_name=game_type_name)
            game_type.delete()
            return Response({"message": "Game type deleted successfully"}, status=status.HTTP_200_OK)
        except GameType.DoesNotExist:
            return Response({"error": "Game type not found"}, status=status.HTTP_404_NOT_FOUND)

# API view to get all game types
class GameTypeListView(APIView):
    def get(self, request):
        game_types = GameType.objects.all()
        serializer = GameTypeSerializer(game_types, many=True)
        return Response(serializer.data)
