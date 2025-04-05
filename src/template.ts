export const base = `<?xml version="1.0"?>
<Capabilities xmlns="http://www.opengis.net/wmts/1.0"
  xmlns:ows="http://www.opengis.net/ows/1.1"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:gml="http://www.opengis.net/gml"
  xsi:schemaLocation="http://www.opengis.net/wmts/1.0 http://schemas.opengis.net/wmts/1.0/wmtsGetCapabilities_response.xsd"
  version="1.0.0">
  <ows:ServiceIdentification>
    <ows:Title>{{ service.title | default("Untitled WMTS Service") }}</ows:Title>
    <ows:Abstract>{{ service.abstract }}</ows:Abstract>
    <ows:Keywords>
    {% for keyword in service.keywords %}
      <ows:Keyword>{{ keyword }}</ows:Keyword>
    {% endfor %}
    </ows:Keywords>
    <ows:ServiceType>OGC WMTS</ows:ServiceType>
    <ows:ServiceTypeVersion>1.0.0</ows:ServiceTypeVersion>
    <ows:Fees>none</ows:Fees>
    <ows:AccessConstraints>none</ows:AccessConstraints>
  </ows:ServiceIdentification>
  <Contents>
    {% for layer in layers %}
    <Layer>
      <ows:Title>{{ layer.title }}</ows:Title>
      <ows:Abstract>{{ layer.abstract }}</ows:Abstract>
      <ows:WGS84BoundingBox>
        <ows:LowerCorner>{{ layer.bbox[0].lon }} {{ layer.bbox[0].lat }}</ows:LowerCorner>
        <ows:UpperCorner>{{ layer.bbox[1].lon }} {{ layer.bbox[1].lat }}</ows:UpperCorner>
      </ows:WGS84BoundingBox>
      <ows:Identifier>{{ layer.id }}</ows:Identifier>
      <Style>
        <ows:Identifier>default</ows:Identifier>
      </Style>
      <Format>image/png</Format>
      <TileMatrixSetLink>
        <TileMatrixSet>{{ layer.tile_matrix_set }}</TileMatrixSet>
      </TileMatrixSetLink>
      <ResourceURL format="image/png" resourceType="tile" template="{{ layer.wmts_url }}" />
    </Layer>
    {% endfor %}
    {% for tile_matrix_set in tile_matrix_sets %}
    <TileMatrixSet>
      <ows:Title>{{ tile_matrix_set.title }}</ows:Title>
      <ows:Identifier>{{ tile_matrix_set.id }}</ows:Identifier>
      <ows:SupportedCRS>{{ tile_matrix_set.supported_crs }}</ows:SupportedCRS>
      <WellKnownScaleSet>{{ tile_matrix_set.wellknown_scale_set }}</WellKnownScaleSet>
      {% for tile_matrix in tile_matrix_set.tile_matrixs %}
      <TileMatrix>
        <ows:Identifier>{{ tile_matrix.identifier }}</ows:Identifier>
        <ScaleDenominator>{{ tile_matrix.scale_denominator }}</ScaleDenominator>
        <TopLeftCorner>{{ tile_matrix.top_left_corner[0] }} {{tile_matrix.top_left_corner[1]}}</TopLeftCorner>
        <TileWidth>{{ tile_matrix.tile_width }}</TileWidth>
        <TileHeight>{{ tile_matrix.tile_height }}</TileHeight>
        <MatrixWidth>{{ tile_matrix.matrix_width }}</MatrixWidth>
        <MatrixHeight>{{ tile_matrix.matrix_height }}</MatrixHeight>
      </TileMatrix>
      {% endfor %}
    </TileMatrixSet>
    {% endfor %}
  </Contents>
</Capabilities>
`;
