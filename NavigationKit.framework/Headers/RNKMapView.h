//
//  SHKAMapView.h
//  Schicka
//
//  Created by Scott Yoder on 12/23/14.
//  Copyright (c) 2014 RadiusNetworks. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "RNKMapPolygon.h"
#import "RNKMapConfig.h"
#import "RNKManager.h"

IB_DESIGNABLE

@protocol RNKMapViewDelegate;

@interface RNKMapView : UIView

@property (strong, nonatomic) id<RNKMapViewDelegate> delegate;

@property (strong, nonatomic) RNKManager *locationManager;

/***
 * The current map
 */
@property (readonly) RNKMapConfig *map;

/***
 * Loads the given map into the view
 */
- (void) loadMap: (RNKMapConfig *)map;

- (void) highlightPolygon: (RNKMapPolygon *)polygon;

/***
 * Executes javascript in the contained webView
 * TODO: get rid of this once we no longer need it
 */
- (NSString *) stringByEvaluatingJavaScriptFromString: (NSString *)javascript;

@end

@protocol RNKMapViewDelegate <NSObject>

@optional

/***
 * Called when the user taps the map.  Returns the point in meters.
 */
- (void)mapView:(RNKMapView *)mapView tappedAt:(CGPoint)pointInMeters;
- (void)mapViewDidFinishLoad:(RNKMapView *)mapView;
- (void)mapView:(RNKMapView *)mapView didFailLoadWithError:(NSError *)error;

@end
