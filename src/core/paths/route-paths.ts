export const RoutePaths = {
  default: "/",
  home: "/",
  book: "/book",
  myBookings: "/bookings",
  checkin: "/checkin",
  scan: "/scan",
  login: "/login",
  profile: "/profile",
  spaces: "/spaces",
  selectDepartment: "/select-department",
  admin: "/admin",
  metrics: "/metrics",
} as const;

export type RoutePathKey = keyof typeof RoutePaths;
export type RoutePathValue = (typeof RoutePaths)[RoutePathKey];
