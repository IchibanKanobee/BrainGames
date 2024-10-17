# views.py
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import GameType, Game
from .serializers import GameTypeSerializer, GameSerializer
from django.core.files.storage import default_storage
from django.conf import settings
from django.shortcuts import get_object_or_404
import json


class AddGameTypeView(APIView):
    def post(self, request):
        serializer = GameTypeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateGameTypeView(APIView):
    def put(self, request):
        old_name = request.data.get('oldName')
        new_name = request.data.get('newName')
        new_image = request.FILES.get('image')  # Get the new image file
        default_image_path = settings.DEFAULT_GAME_TYPE_IMAGE_PATH  # Define the default image path

        try:
            # Find the existing game type by its old name
            game_type = GameType.objects.get(game_type_name=old_name)

            # If a new name is provided, update it
            if new_name:
                game_type.game_type_name = new_name

            # If a new image is provided, update the image field
            if new_image:
                # Check if the current image is not the default one
                if game_type.game_type_image and game_type.game_type_image.path != default_image_path:
                    # Delete the old image from storage
                    default_storage.delete(game_type.game_type_image.path)

                # Save the new image
                game_type.game_type_image = new_image

            # Save the updated game type
            game_type.save()

            return Response({"message": "Game type updated successfully"}, status=status.HTTP_200_OK)

        except GameType.DoesNotExist:
            return Response({"error": "Game type not found"}, status=status.HTTP_404_NOT_FOUND)
        
        
class DeleteGameTypeView(APIView):
    def delete(self, request, old_name, format=None):
        try:
            game_type = GameType.objects.get(game_type_name=old_name)
            game_type.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except GameType.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

# API view to get all game types
class GameTypeListView(APIView):
    def get(self, request):
        game_types = GameType.objects.all()
        serializer = GameTypeSerializer(game_types, many=True)
        return Response(serializer.data)


class AddGameView(APIView):
    def post(self, request):
        serializer = GameSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
class UpdateGameView(APIView):
    def put(self, request, pk):
        # Fetch the game object
        game = get_object_or_404(Game, pk=pk)

        # Extract game_type_ids from request data (JSON-encoded string)
        game_type_ids_str = request.data.get('game_types', '[]')  # Default to an empty list if not provided

        try:
            # Parse the JSON string into a Python list
            game_type_ids = json.loads(game_type_ids_str)

            # Ensure the parsed data is a list of integers
            if not isinstance(game_type_ids, list):
                return Response({'error': 'game_types must be a list.'}, status=status.HTTP_400_BAD_REQUEST)

            # Convert the items in the list to integers
            game_type_ids = [int(id) for id in game_type_ids]
        except (json.JSONDecodeError, ValueError):
            return Response({'error': 'Invalid JSON format or invalid game_type_ids.'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Clear the existing game types
        game.game_types.clear()

        # Fetch the new game types and associate them with the game
        new_game_types = GameType.objects.filter(game_type_id__in=game_type_ids)
        game.game_types.set(new_game_types)

        # Update other game fields using the serializer
        serializer = GameSerializer(game, data=request.data, partial=True)  # partial=True allows updating some fields

        if serializer.is_valid():
            serializer.save()  # Save the updated game object
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

# Delete a game
class DeleteGameView(APIView):
    def delete(self, request, pk):
        game = get_object_or_404(Game, pk=pk)  # Get the game by primary key (game_id)
        game.delete()
        return Response({"message": "Game deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
 
    
# API view to get all game types
class GameListView(APIView):
    def get(self, request):
        games = Game.objects.all()
        serializer = GameSerializer(games, many=True)
        return Response(serializer.data)
    
