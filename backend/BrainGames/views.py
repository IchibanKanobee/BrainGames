# views.py
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import GameType
from .serializers import GameTypeSerializer, GameSerializer
from django.core.files.storage import default_storage
from django.conf import settings

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


class AddGameView(APIView):
    def post(self, request):
        serializer = GameSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)