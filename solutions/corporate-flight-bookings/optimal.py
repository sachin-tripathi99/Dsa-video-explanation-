class Solution:
    def corpFlightBookings(self, bookings: List[List[int]], n: int) -> List[int]:
        d = [0] * (n + 1)
        for first, last, seats in bookings:
            d[first - 1] += seats
            d[last] -= seats
        return list(accumulate(d[:n]))
