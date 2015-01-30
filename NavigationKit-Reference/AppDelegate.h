//
//  AppDelegate.h
//  NavigationKit-Reference
//
//  Created by Scott Yoder on 1/30/15.
//  Copyright (c) 2015 Radius Networks. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <NavigationKit/NavigationKit.h>

@interface AppDelegate : UIResponder <UIApplicationDelegate, RNKManagerDelegate>

@property (strong, nonatomic) UIWindow *window;
@property (strong, nonatomic) RNKManager *navKitManager;

@end

