//
//  SCHMapConfig.h
//  Schicka
//
//  Created by James Nebeker on 10/27/14.
//  Copyright (c) 2014 RadiusNetworks. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreGraphics/CoreGraphics.h>

@interface RNKMapConfig : NSObject

@property NSString *mapId;
@property double latitude; // Degrees
@property double longitude; // Degrees
@property double rotationDegrees; // Degrees
@property (readonly) double standardPixelsPerMeter;
@property double pixelsPerMeter; // Pixels per meter
@property long mapPixelWidth; // Map width in pixels
@property (readonly) long scaledMapPixelWidth; // Map width in pixels
@property long mapPixelHeight; // Map height in pixels
@property (readonly) long scaledMapPixelHeight; // Map height in pixels
@property CGPoint mapCornerOffset; // x and y offset (in pixels) from map image top left to actual map (or reference point) top left
@property (readonly) CGPoint scaledMapCornerOffset;
@property CGPoint overlayPixelOffset;
@property (readonly) CGPoint scaledOverlayPixelOffset;
@property Boolean hideMap;
@property Boolean geolocationEnabled;
@property double cropWidth;
@property double cropHeight;
@property (readonly) CGSize scaledCropSize;
@property NSString *name;
@property NSString *filePath;

-(instancetype) initWithJSONObject:(NSDictionary *) jsonDict;


@end
