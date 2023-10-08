export type User = {
    user_id:number,
    account_address: string,
};

export type RegularTrip = {
    trip_id: string,
    origin: string,
    destination: string,
    distance: number,
    time: string,
    schedule: number,
    created_at: Date,
    updated_at: Date,
};

export type OnetimeTrip = {
    trip_id: string,
    origin: string,
    destination: string,
    distance: number,
    datetime: Date,
    created_at: Date,
    updated_at: Date,
};

export type DriverPrefences = {
    driver_prefences_id: number,
    seats: number,
    price: number,
};

export type AccountTrips = {
    account_id: string,
    driver_prefences_id: number,
    trip_id: string,
    trip: "Regular" | "One-time",
};