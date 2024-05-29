from rest_framework import serializers
from .models import Clothing, ClothingDetail, UserClothing



class ClothingDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClothingDetail
        fields = ['clothing_detail_id', 'clothing_img_path']



class UserClothingSerializer(serializers.Serializer):
    clothing_name = serializers.SerializerMethodField()

    def get_clothing_name(self, obj):
        user_id = self.context.get('user_id')
        user_clothing = obj.userclothing_set.filter(user_id=user_id).first()
        return user_clothing.clothing_name if user_clothing else None



class ClothingSerializer(serializers.ModelSerializer):
    clothing_detail = ClothingDetailSerializer(read_only=True)
    user_clothing = UserClothingSerializer(source='*', read_only=True)
    
    class Meta:
        model = Clothing
        fields = ['clothing_id', 'clothing_detail', 'user_clothing']

    # 응답 폼
    def to_representation(self, instance):
        rep = super().to_representation(instance)

        clothing_data = rep.get('clothing_detail', {})
        return {
            'clothing_id': rep.get('clothing_id'),
            'clothing_name': rep['user_clothing'].get('clothing_name'),
            'clothing_img_path': clothing_data.get('clothing_img_path'),
        }
