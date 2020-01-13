import proj4 from "proj4";

const HTRS96 = 'EPSG:3765';
const WGS84 = 'EPSG:4326';

const CoordinateConverter = {
    convert: function(X, Y) {
        proj4.defs([
            [
                WGS84,
                '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees'
            ],
            [
                HTRS96,
                '+title=HTRS96/TM +proj=tmerc +lat_0=0 +lon_0=16.5 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
            ]
        ]);

        return proj4(proj4(HTRS96), proj4(WGS84),[X, Y]).reverse();
    }
};

export default CoordinateConverter;