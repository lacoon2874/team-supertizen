from django.db import models


class Clothing(models.Model):
    clothing_id = models.AutoField(primary_key=True)
    clothing_detail = models.ForeignKey('ClothingDetail', models.DO_NOTHING)
    owner_id = models.IntegerField()
    now_at = models.CharField(max_length=20)
    rfid_uid = models.CharField(db_column='RFID_uid', max_length=15)  # Field name made lowercase.
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    washed_at = models.DateTimeField()
    location_modified_at = models.DateTimeField()
    polluted = models.IntegerField()
    worn_count = models.IntegerField()
    category = models.CharField(max_length=20)

    class Meta:
        managed = False
        db_table = 'clothing'


class ClothingDetail(models.Model):
    clothing_detail_id = models.BigAutoField(primary_key=True)
    clothing_img_path = models.CharField(max_length=200)
    color = models.CharField(max_length=20)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'clothing_detail'


class ClothingSeason(models.Model):
    season_id = models.AutoField(primary_key=True)
    clothing_connection = models.ForeignKey('UserClothing', models.DO_NOTHING)
    month = models.IntegerField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'clothing_season'


class ClothingStyle(models.Model):
    style_connection_id = models.BigAutoField(primary_key=True)
    style = models.ForeignKey('Style', models.DO_NOTHING)
    clothing = models.ForeignKey(Clothing, models.DO_NOTHING)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'clothing_style'


class ClothingTexture(models.Model):
    texture_connection_id = models.BigAutoField(primary_key=True)
    texture = models.ForeignKey('Texture', models.DO_NOTHING)
    clothing_detail = models.ForeignKey(ClothingDetail, models.DO_NOTHING)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'clothing_texture'


class Family(models.Model):
    family_id = models.AutoField(primary_key=True)
    washer_id = models.IntegerField()
    air_dresser_id = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'family'


class PastOutfit(models.Model):
    past_outfit_id = models.BigAutoField(primary_key=True)
    schedule = models.ForeignKey('Schedule', models.DO_NOTHING)
    clothing = models.ForeignKey(Clothing, models.DO_NOTHING)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'past_outfit'


class RecommendedOutfit(models.Model):
    recommended_outfit_id = models.BigAutoField(primary_key=True)
    schedule = models.ForeignKey('Schedule', models.DO_NOTHING)
    clothing = models.ForeignKey(Clothing, models.DO_NOTHING)
    x = models.IntegerField()
    y = models.IntegerField()
    width = models.IntegerField()
    height = models.IntegerField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'recommended_outfit'


class Schedule(models.Model):
    schedule_id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey('User', models.DO_NOTHING)
    weather = models.ForeignKey('Weather', models.DO_NOTHING, blank=True, null=True)
    schedule_name = models.CharField(max_length=20)
    schedule_category = models.CharField(max_length=20)
    date = models.DateTimeField()
    location_key = models.IntegerField()
    outfit_image_path = models.CharField(max_length=200)
    schedule_disabled = models.IntegerField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'schedule'


class SiDo(models.Model):
    si_do_id = models.AutoField(primary_key=True)
    si_do_name = models.CharField(max_length=20)

    class Meta:
        managed = False
        db_table = 'si_do'


class SiGunGu(models.Model):
    si_gun_gu_id = models.AutoField(primary_key=True)
    si_do = models.ForeignKey(SiDo, models.DO_NOTHING)
    si_gun_gu_name = models.CharField(max_length=20)
    location_key = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'si_gun_gu'


class Style(models.Model):
    style_id = models.AutoField(primary_key=True)
    style_name = models.CharField(max_length=20)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'style'


class Texture(models.Model):
    texture_id = models.AutoField(primary_key=True)
    texture_name = models.CharField(max_length=20)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'texture'


class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    family = models.ForeignKey(Family, models.DO_NOTHING)
    email = models.CharField(max_length=50)
    password = models.CharField(max_length=20)
    user_name = models.CharField(max_length=20)
    profile_img_path = models.CharField(max_length=200)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    age = models.IntegerField()
    gender = models.CharField(max_length=10)
    fcm_token = models.CharField(max_length=200, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user'


class UserClothing(models.Model):
    clothing_connection_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, models.DO_NOTHING)
    clothing = models.ForeignKey(Clothing, models.DO_NOTHING)
    clothing_name = models.CharField(max_length=20)
    accrue_worn_count = models.IntegerField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    user_clothing_disabled = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'user_clothing'


class Weather(models.Model):
    weather_id = models.BigAutoField(primary_key=True)
    location_key = models.IntegerField()
    icon = models.IntegerField()
    lowest_temperature = models.FloatField()
    highest_temperature = models.FloatField()
    highest_real_feeling_temperature = models.FloatField()
    lowest_real_feeling_temperature = models.FloatField()
    precipitation = models.FloatField()
    snow_cover = models.FloatField()
    humidity = models.FloatField()
    wind_speed = models.FloatField()
    solar_irradiance = models.FloatField(db_column='solar_Irradiance')  # Field name made lowercase.
    uv = models.FloatField()
    uv_message = models.CharField(max_length=20)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'weather'