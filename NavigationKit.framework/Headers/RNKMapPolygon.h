//
//  SHKAMapPolygon.h
//  Schicka
//
//  Created by Scott Yoder on 1/26/15.
//  Copyright (c) 2015 RadiusNetworks. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreLocation/CoreLocation.h>

@interface RNKMapPolygon : NSObject
@property (readonly) NSArray *points;

- (void) addPoint: (CLLocationCoordinate2D)point;

@end
