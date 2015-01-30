//
//  SHKAManagerDelegate.h
//  Schicka
//
//  Created by James Nebeker on 12/19/14.
//  Copyright (c) 2014 RadiusNetworks. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RNKMapLocation.h"

@class RNKManager;

@protocol RNKManagerDelegate <NSObject>
@required
@optional


/*!
 @method locationManager:didUpdateMapLocation
 
 @discussion
 Invoked when a new map location is available.
 
 location is a SHKAMapLocation object representing the current location

 */
- (void)locationManager:(RNKManager *)manager
     didUpdateMapLocation:(RNKMapLocation *)location;

@end
