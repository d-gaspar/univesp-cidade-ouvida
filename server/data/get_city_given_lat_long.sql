set @orig_lat=-23.4766;
set @orig_long=-47.4418;
SELECT
	id_cidade,
    nome,
    LATITUDE,
    LONGITUDE,
    (
    6371 *
		acos(cos(radians(@orig_lat)) * 
		cos(radians(LATITUDE)) * 
		cos(radians(LONGITUDE) - 
		radians(@orig_long)) + 
		sin(radians(@orig_lat)) * 
		sin(radians(LATITUDE)))
    ) as dist_km
FROM
	cidade_ouvida.brazil_cities
ORDER BY dist_km
LIMIT 1;