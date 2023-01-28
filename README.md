<!-- @format -->

Site like avito.ru

-----Users

1. Admin user has all privileges
2. Moderator has privileges related to advert moderation, editing
3. Simple User can add, edit, delete his/her own adverts.
   ---- User Status
4. wait(If admin accepts, then status changes to active)
5. active

-----Adverts
Category(tree based)
Region(tree based )
Image (multiple, one main image, multiple definitive images)
Attributes(Category Related)

--- Advert Status

1. draft
2. moderation
3. active
4. closed

------ Category
id
name
parent_id

id name parent_id
1 Avto null
2 Nedv null
3 Mototsikl 1
4 Mapet 3

---- Attribute
id
category_id
