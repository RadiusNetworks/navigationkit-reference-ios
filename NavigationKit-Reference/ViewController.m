//
//  ViewController.m
//  NavigationKit-Reference
//
//  Created by Scott Yoder on 1/30/15.
//  Copyright (c) 2015 Radius Networks. All rights reserved.
//

#import "ViewController.h"
#import "AppDelegate.h"
#import <NavigationKit/NavigationKit.h>

@interface ViewController () <RNKMapViewDelegate>
@property (weak, nonatomic) IBOutlet RNKMapView *mapView;
@property (weak, nonatomic) RNKManager *navKitManager;
@end

@implementation ViewController

- (void)viewDidLoad {
  [super viewDidLoad];
  self.mapView.delegate = self;
  self.navKitManager = ((AppDelegate *)[[UIApplication sharedApplication] delegate]).navKitManager;
  self.mapView.locationManager = self.navKitManager;
  RNKMapConfig *map = self.navKitManager.maps[0];
  [self.mapView loadMap:map];
  // Do any additional setup after loading the view, typically from a nib.
}

- (void)didReceiveMemoryWarning {
  [super didReceiveMemoryWarning];
  // Dispose of any resources that can be recreated.
}

- (void)mapViewDidFinishLoad:(RNKMapView *)mapView {
  self.title = self.mapView.map.name;
  NSLog(@"map loaded");
}

- (void)mapView:(RNKMapView *)mapView didFailLoadWithError:(NSError *)error {
  NSLog(@"map failed to load");
}

@end
