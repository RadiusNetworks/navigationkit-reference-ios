//
//  SHKAMapLocation.h
//  Schicka
//
//  Created by James Nebeker on 11/6/14.
//  Copyright (c) 2014 RadiusNetworks. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreGraphics/CoreGraphics.h>
#import "RNKMapConfig.h"
@interface RNKMapLocation : NSObject

@property CGPoint pixelCoords;
@property NSString *mapId;
@property (strong, nonatomic) RNKMapConfig *map;
@property (nonatomic) long uncertaintyRadiusPixels;
@property double uncertaintyRadiusMeters;

@end
