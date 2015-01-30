//
//  SHKAManager.h
//  Schicka
//
//  Created by James Nebeker on 12/19/14.
//  Copyright (c) 2014 RadiusNetworks. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreLocation/CoreLocation.h>
#import "RNKManagerDelegate.h"

@class RPKManager;
@protocol RPKManagerDelegate;
@class RNKMapView;

/** SHKAManager
 *
 * This is the main class for used for interacting with the
 * Schicka SDK.
 *
 */
@interface RNKManager : NSObject

/** currentMapLocation
 *
 * Property to fetch the current map location from a SHKAManager instance
 *
 */
@property (readonly) RNKMapLocation *currentMapLocation;

/** manager
 *
 * Creates the manager without a delegate.
 *
 */
+ (RNKManager *)manager;

/** managerWithDelegate
 *
 * Creates the manager, assigns the delegate.
 *
 */
+ (RNKManager *)managerWithDelegate:(id <RNKManagerDelegate> )delegate;

/** start
 *
 * Sets up the manager and starts ProximityKit and CoreLocation.
 *
 */
- (void)start;

/** stop
 *
 * Stops ProximityKit and Corelocation.
 *
 */
- (void)stop;

/** startGeolocation
 *
 * Separate method to start GPS updates, to be called only when needed to save battery
 *
 */
- (void)startGeolocation;

/** stopGeolocation
 *
 * Separate method to stop GPS updates, to be called when GPS is no longer needed
 *
 */
- (void)stopGeolocation;

/** updateMaps
 *
 * Updates maps and map configuration from the server
 *
 */
- (void)updateMaps;

/** addListener
 *
 * Adds the given object to the manager's list of listeners that will receive
 * location updates
 *
 */
- (void)addListener:(id<RNKManagerDelegate>)listener;

/** removeListener
 *
 * Removes the given object from the manager's list of listeners that will recieve
 * location updates.
 *
 */
- (void)removeListener:(id<RNKManagerDelegate>)listener;

/** delegate
 *
 * Primary delegate for the SHKAManager.
 *
 */
@property (assign) id <RNKManagerDelegate> delegate;

/** RPKManager
 *
 * The instance of RPKManager manager that SHKAManager wraps and maintains.
 *
 */
@property (readonly) RPKManager *pkManager;

/** pkManagerDelegate
 *
 * Proxy for all of the RPKManager delgate methods. All of the
 * non-deprecated methods from RPKManagerDelegate will be called
 * on this object.
 *
 * This is useful for accessing the underlying proximity kit functionality
 * while using the same pkManager instance that Schicka wraps
 * and maintains.
 *
 */
@property (assign) id <RPKManagerDelegate> pkManagerDelegate;

/** mapId
 *
 * The mapId of the map currently being viewed
 *
 */
@property NSString* mapId;


/** maps
 *
 * Returns an array of maps defined for this kit
 *
 */
@property (readonly) NSArray *maps;

@end
